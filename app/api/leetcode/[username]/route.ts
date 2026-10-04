import { NextResponse } from "next/server";
import axios from "axios";

import cache from "@/lib/cache/cache";

interface RouteContext {
  params: Promise<{
    username: string;
  }>;
}

interface LeetCodeProfile {
  username: string;
  profile: {
    realName: string | null;
    userAvatar: string;
  };
  languageProblemCount: {
    languageName: string;
    problemsSolved: number;
  }[];
  badges: {
    id: string;
    name: string;
    icon: string;
    creationDate: string;
  }[];
}

interface LeetCodeResponse {
  data: {
    matchedUser: LeetCodeProfile | null;
  };
}

export async function fetchLeetcodeProfile(
  username: string
): Promise<LeetCodeProfile | null> {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          realName
          userAvatar
        }
        languageProblemCount {
          languageName
          problemsSolved
        }
        badges {
          id
          name
          icon
          creationDate
        }
      }
    }
  `;

  const response = await axios.post<LeetCodeResponse>(
    "https://leetcode.com/graphql",
    {
      query,
      variables: {
        username,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.data.matchedUser;
}

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { username } = await params;

    // Check cache
    const cached = cache.get(username);

    if (cached) {
      return NextResponse.json(cached);
    }

    // Fetch from LeetCode
    const userData = await fetchLeetcodeProfile(username);

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Save to cache
    cache.set(username, userData);

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
