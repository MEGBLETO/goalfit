import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Define default exercises
  const exercises = [
    {
      name: "Push-ups",
      reps: "15 reps",
      bodyPart: "Chest",
      description: "A basic push-up exercise to strengthen the chest and triceps.",
    },
    {
      name: "Squats",
      reps: "20 reps",
      bodyPart: "Legs",
      description: "Bodyweight squats to strengthen your quads and glutes.",
    },
    {
      name: "Lunges",
      reps: "12 reps per leg",
      bodyPart: "Legs",
      description: "Lunges to work your legs and improve stability.",
    },
    {
      name: "Plank",
      reps: "Hold for 1 minute",
      bodyPart: "Core",
      description: "Hold the plank position to strengthen your core.",
    },
  ];

  // Define default workouts
  const defaultWorkoutPlans = [
    {
      day: new Date(), // Today as default date
      isDefault: true, // This will mark it as default
      workouts: [
        {
          name: "Morning Workout",
          description: "A quick workout to get your day started.",
          duration: "30 minutes",
          intensity: "Medium",
          exercises: exercises, // Use default exercises
        },
        {
          name: "Evening Workout",
          description: "End your day with this evening workout.",
          duration: "45 minutes",
          intensity: "High",
          exercises: exercises, // Use default exercises
        },
      ],
    },
    {
      day: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow as default date
      isDefault: true,
      workouts: [
        {
          name: "Full-body Strength",
          description: "A workout that targets all major muscle groups.",
          duration: "60 minutes",
          intensity: "High",
          exercises: exercises,
        },
      ],
    },
  ];

  for (const plan of defaultWorkoutPlans) {
    const createdWorkoutPlan = await prisma.workoutPlan.create({
      data: {
        day: plan.day,
        isDefault: plan.isDefault,
        workouts: {
          create: plan.workouts.map((workout) => ({
            name: workout.name,
            description: workout.description,
            duration: workout.duration,
            intensity: workout.intensity,
            exercises: {
              create: workout.exercises.map((exercise) => ({
                name: exercise.name,
                reps: exercise.reps,
                bodyPart: exercise.bodyPart,
                description: exercise.description,
              })),
            },
          })),
        },
      },
    });

    console.log(`Created default workout plan with id: ${createdWorkoutPlan.id}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
