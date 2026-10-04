"use client";

import Card from "@/components/home/Card";
import axios from "axios";
import { useState } from "react";

import { LeetCodeProfile } from "@/types/leetcode";
import { ShieldCheck } from "lucide-react";
import PrivacyPopup from "@/components/home/PrivacyPopup";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleSubmit = async () => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Please enter a LeetCode username.");
      return;
    }

    setLoading(true);
    setError("");
    setProfile(null);

    try {
      const res = await axios.get<LeetCodeProfile>(
        `/api/leetcode/${encodeURIComponent(trimmedUsername)}`,
      );
      setProfile(res.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError("LeetCode user not found.");
        } else {
          setError("Unable to fetch profile. Please try again.");
        }
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col items-center bg-[#1a1a1a] transition-all duration-500 ease-in-out ${
          profile
            ? "min-h-screen justify-start pt-10"
            : "h-screen justify-center"
        } p-6 space-y-8`}
      >
        {/* Heading */}
        <div className="text-center space-y-5">
          <h1 className="text-white text-5xl sm:text-6xl md:text-7xl font-bold">
            Your <span className="text-[#fc8a23]">LeetCode</span> Stats
          </h1>
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl">
            Clear. Actionable. Powerful.
          </h2>
          <h4 className="text-gray-400 text-lg sm:text-xl md:text-2xl">
            See Your Coding Stats At a Glance
          </h4>
        </div>

        {/* Input and Button */}
        <div className="w-full max-w-md flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
          <input
            id="inputBox"
            name="text"
            type="text"
            placeholder="Enter Leetcode Username"
            className="border border-[#fc8a23] rounded-xl text-white p-3 w-full bg-transparent"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="bg-[#fc8a23] text-white px-6 py-2 text-sm rounded-xl hover:bg-[#e07a1c] transition w-full sm:w-auto sm:px-6 sm:py-3 sm:text-base whitespace-nowrap"
          >
            Generate Card
          </button>
        </div>

        {/* Loading / Error */}
        {loading && <p className="text-white text-lg">Loading...</p>}
        {error && <p className="text-red-500 text-lg">{error}</p>}

        {/* Card Component */}
        {profile && (
          <div className="w-full px-4 sm:px-6 md:px-10">
            <Card profile={profile} />
          </div>
        )}
      </div>

      {/* Privacy Button */}
      <button
        onClick={() => setShowPrivacy(true)}
        aria-label="Privacy"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 rounded-full bg-[#fc8a23] p-3 sm:px-5 text-sm font-semibold text-black shadow-lg hover:bg-[#e07a1c] hover:scale-105 transition-all duration-200 focus:bg-[#fc8a23]"
      >
        <ShieldCheck size={18} />
        <span className="hidden sm:inline">Privacy</span>
      </button>

      {/* Privacy Popup */}
      <PrivacyPopup
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
    </>
  );
}
