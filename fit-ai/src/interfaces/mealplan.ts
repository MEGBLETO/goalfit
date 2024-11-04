export interface UserDataI {
  age: number;
  gender: string;
  weight: number;
  height: number;
  fitnessLevel: string;
  goals: string[];
  dietaryPreferences: {
    type: string;
    restrictions: string[];
    dislikes: string[];
  };
  equipment: string[];
  availability: {
    daysPerWeek: number;
    minutesPerDay: number;
  };
  healthConsiderations: string[];
}

export interface FitnessPlan {
  userData: UserDataI;
  weeks: number;
}
