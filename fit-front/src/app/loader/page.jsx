'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './style.scss'; // Ensure your custom CSS for loader is imported

export default function MultiStepForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Loader should be active initially
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Helper function to parse the JWT token
  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  // Insert workout plans into the database
  const insertWorkoutPlans = async (workoutPlans, token) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bdd/workout/bulk`,
        { workoutPlans }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Workout plans inserted successfully:', response.data);
    } catch (error) {
      console.error('Error inserting workout plans into the database:', error);
    }
  };

  // Insert meal plans into the database
  const insertMealPlans = async (mealPlans, token) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bdd/meal/mealplans`,
        { mealplans: mealPlans }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Meal plans inserted successfully:', response.data);
    } catch (error) {
      console.error('Error inserting meal plans into the database:', error);
    }
  };

  // Generate and insert workout plans
  const generateWorkoutPlans = async (userData, token) => {
    const workoutPlanRequest = {
      userData: {
        age: userData.age || 30,
        gender: userData.gender,
        weight: userData.weight,
        height: userData.height,
        fitnessLevel: userData.fitnessLevel,
        goals: userData.goals || ['muscle gain', 'improve endurance'],
        equipment: userData.equipment || ['barbell', 'dumbbells'],
        availability: {
          daysPerWeek: 6,
          minutesPerDay: 90,
        },
        healthConsiderations: userData.healthConsiderations || [],
      },
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .split('T')[0],
    };

    try {
      const workoutResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ai/workoutplan`,
        workoutPlanRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Generated Workout Plans:', workoutResponse.data);

      // Insert the generated workout plans into the database
      await insertWorkoutPlans(workoutResponse.data, token); 
    } catch (error) {
      console.error('Error generating workout plans:', error);
    }
  };

  // Generate and insert meal plans
  const generateMealPlans = async (userData, token) => {
    const mealPlanRequest = {
      userData: {
        age: userData.age || 30,
        gender: userData.gender,
        weight: userData.weight,
        height: userData.height,
        fitnessLevel: userData.fitnessLevel,
        mealsPerDay: 3,
        goals: userData.goals || ['muscle gain', 'improve endurance'],
        dietaryPreferences: {
          type: 'omnivore',
          restrictions: ['peanuts'],
          dislikes: ['Brussels sprouts', 'omelettes'],
        },
        healthConsiderations: ['knee discomfort'],
      },
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 7))
        .toISOString()
        .split('T')[0],
    };

    try {
      const mealResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/ai/mealplans`,
        mealPlanRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Generated Meal Plans:', mealResponse.data);

      // Insert the generated meal plans into the database
      await insertMealPlans(mealResponse.data, token); 
    } catch (error) {
      console.error('Error generating meal plans:', error);
    }
  };

  // Generate both workout and meal plans, then insert them into the database and redirect
  const generatePlans = async (userData, token) => {
    try {
      console.log('Generating plans...');
      await Promise.all([
        generateWorkoutPlans(userData, token),
        generateMealPlans(userData, token),
      ]);

      console.log('Plans generated and inserted successfully.');
      setIsLoading(false); // Stop loader after inserting the data
      router.push('/home'); // Redirect to home after successful insertions
    } catch (error) {
      console.error('Error generating or inserting plans:', error);
      setIsLoading(false);
    }
  };

  // Fetch user and generate plans
  const fetchUserFromBackend = async (email, token) => {
    try {
      console.log('Fetching user from backend...');
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/bdd/user?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log('User Data:', response.data);
        setUser(response.data);
        generatePlans(response.data, token);
      } else {
        console.error('Failed to fetch user data');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setIsLoading(false);
    }
  };

  // Fetch token from cookies and initiate data fetching
  useEffect(() => {
    const getTokenFromCookies = () => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; token=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const tokenFromCookies = getTokenFromCookies();
    if (tokenFromCookies) {
      const decodedToken = parseJwt(tokenFromCookies);
      setToken(tokenFromCookies);
      fetchUserFromBackend(decodedToken.email, tokenFromCookies);
    } else {
      console.log('No token found in cookies');
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen relative flex flex-row justify-center bg-white dark:bg-gray-900 dark:text-gray-100">
      {isLoading ? (
        <div className="absolute top-1/3">
          <div className="loader-container">
            <div className="loader-boxes">
              <div className="box"><div></div><div></div><div></div><div></div></div>
              <div className="box"><div></div><div></div><div></div><div></div></div>
              <div className="box"><div></div><div></div><div></div><div></div></div>
              <div className="box"><div></div><div></div><div></div><div></div></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="content text-xl">
          <div className="content__container">
            <p className="content__container__text mt-2.5">Génération</p>
            <ul className="content__container__list">
              <li className="content__container__list__item">Meal Plans</li>
              <li className="content__container__list__item">Workout Plans</li>
              <li className="content__container__list__item">Your Program</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
