export interface Language {
  languageName: string;
  problemsSolved: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  creationDate: string;
}

export interface LeetCodeProfile {
  username: string;
  profile: {
    realName: string | null;
    userAvatar: string;
  };
  languageProblemCount: Language[];
  badges: Badge[];
}
