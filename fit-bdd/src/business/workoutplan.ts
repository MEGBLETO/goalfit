import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class WorkoutManager {
  // Create a new workout plan with associated workouts and exercises
  async createWorkoutPlan(data: any) {
    const { userId, day, workouts } = data;
    try {
      const workoutPlan = await prisma.workoutPlan.create({
        data: {
          userId,
          day: new Date(day),
          workouts: {
            create: workouts.map((workout: any) => ({
              name: workout.name,
              description: workout.description,
              duration: workout.duration,
              intensity: workout.intensity,
              exercises: {
                create: workout.exercises.map((exercise: any) => ({
                  name: exercise.name,
                  reps: exercise.reps,
                })),
              },
            })),
          },
        },
        include: {
          workouts: {
            include: {
              exercises: true,
            },
          },
        },
      });
      return workoutPlan;
    } catch (error) {
      console.error("Error creating workout plan:", error);
      throw new Error("Failed to create workout plan.");
    }
  }

  async getDefaultWorkoutPlans() {
    try {
      const defaultWorkoutPlans = await prisma.workoutPlan.findMany({
        where: { userId: null }, 
        include: {
          workouts: {
            include: {
              exercises: true, // Fetch related exercises as well
            },
          },
        },
      });
      return defaultWorkoutPlans;
    } catch (error) {
      console.error("Error fetching default workout plans:", error);
      throw new Error("Failed to fetch default workout plans.");
    }
  }
  

  

  // Bulk create workout plans with associated workouts and exercises
  async bulkCreateWorkoutPlans(data: any) {
    const { userId, workoutPlans, isDefault } = data;
  
    try {
      const createdWorkoutPlans = await prisma.$transaction(
        workoutPlans.map((workoutPlan: any) => {
          const workoutDay = new Date(workoutPlan.date);
          if (isNaN(workoutDay.getTime())) {
            throw new Error(`Invalid date format: ${workoutPlan.day}`);
          }
  
          return prisma.workoutPlan.create({
            data: {
              userId,
              day: workoutDay,
              isDefault: isDefault ?? false,
              workouts: {
                create: workoutPlan.workouts.map((workout: any) => ({
                  name: workout.name,
                  description: workout.description,
                  duration: workout.duration,
                  intensity: workout.intensity,
                  exercises: {
                    create: workout.exercises.map((exercise: any) => ({
                      name: exercise.name,
                      reps: exercise.reps,
                      bodyPart: exercise.bodyPart, 
                      description: exercise.description, 
                    })),
                  },
                })),
              },
            },
            include: {
              workouts: {
                include: {
                  exercises: true,
                },
              },
            },
          });
        })
      );
  
      return createdWorkoutPlans;
    } catch (error) {
      console.error("Error bulk creating workout plans:", error);
      throw new Error("Failed to bulk create workout plans.");
    }
  }

  // Update an existing workout plan and its associated workouts and exercises
  async updateWorkoutPlan(id: number, data: any) {
    const { day, workouts } = data;

    try {
      const updatedWorkoutPlan = await prisma.workoutPlan.update({
        where: { id },
        data: {
          day: new Date(day),
          workouts: {
            deleteMany: {}, 
            create: workouts.map((workout: any) => ({
              name: workout.name,
              description: workout.description,
              duration: workout.duration,
              intensity: workout.intensity,
              exercises: {
                create: workout.exercises.map((exercise: any) => ({
                  name: exercise.name,
                  reps: exercise.reps,
                  bodyPart: exercise.bodyPart,  
                  description: exercise.description, 
                })),
              },
            })),
          },
        },
        include: {
          workouts: {
            include: {
              exercises: true,
            },
          },
        },
      });
      return updatedWorkoutPlan;
    } catch (error) {
      console.error(`Error updating workout plan with id ${id}:`, error);
      throw new Error("Failed to update workout plan.");
    }
  }

  // Delete a workout plan and all associated workouts and exercises
  async deleteWorkoutPlan(id: number) {
    try {
      await prisma.workoutPlan.delete({
        where: { id },
      });
      return { message: `Workout plan with id ${id} deleted successfully.` };
    } catch (error) {
      console.error(`Error deleting workout plan with id ${id}:`, error);
      throw new Error("Failed to delete workout plan.");
    }
  }

  // Delete a workout plan for a specific date
  async deleteWorkoutPlanByDate(userId: number, date: string) {
    try {
      const workoutPlan = await prisma.workoutPlan.deleteMany({
        where: {
          userId,
          day: new Date(date),
        },
      });

      if (workoutPlan.count === 0) {
        throw new Error("No workout plan found for the specified date.");
      }

      return { message: `Workout plan for date ${date} deleted successfully.` };
    } catch (error) {
      console.error(`Error deleting workout plan for user ${userId} on date ${date}:`, error);
      throw new Error("Failed to delete workout plan for the specified date.");
    }
  }

  // Get a workout plan by ID, including workouts and exercises
  async getWorkoutPlanById(id: number) {
    try {
      const workoutPlan = await prisma.workoutPlan.findUnique({
        where: { id },
        include: {
          workouts: {
            include: {
              exercises: true,
            },
          },
        },
      });

      if (!workoutPlan) {
        throw new Error("Workout plan not found.");
      }

      return workoutPlan;
    } catch (error) {
      console.error(`Error fetching workout plan with id ${id}:`, error);
      throw new Error("Failed to fetch workout plan.");
    }
  }

  // Get all workout plans for a specific user
  async getWorkoutPlansForUser(userId: number) {
    try {
      const workoutPlans = await prisma.workoutPlan.findMany({
        where: { userId },
        include: {
          workouts: {
            include: {
              exercises: true,
            },
          },
        },
      });

      return workoutPlans;
    } catch (error) {
      console.error(`Error fetching workout plans for user with id ${userId}:`, error);
      throw new Error("Failed to fetch workout plans for user.");
    }
  }

  async replaceWorkoutPlans(userId: number, workoutPlans: any[]) {
    try {
      return await prisma.$transaction(
        workoutPlans.map((workoutPlan: any) => {
          const day = new Date(workoutPlan.date);
          if (isNaN(day.getTime())) {
            throw new Error(`Invalid date format: ${workoutPlan.date}`);
          }
  
          return prisma.workoutPlan.upsert({
            where: {
              userId_day: {
                userId: userId,
                day: day,
              },
            },
            update: {
              workouts: {
                deleteMany: {}, 
                create: workoutPlan.workouts.map((workout: any) => ({
                  name: workout.name,
                  description: workout.description,
                  duration: workout.duration,
                  intensity: workout.intensity,
                  exercises: {
                    create: workout.exercises.map((exercise: any) => ({
                      name: exercise.name,
                      reps: exercise.reps,
                    })),
                  },
                })),
              },
            },
            create: {
              userId,
              day,
              workouts: {
                create: workoutPlan.workouts.map((workout: any) => ({
                  name: workout.name,
                  description: workout.description,
                  duration: workout.duration,
                  intensity: workout.intensity,
                  exercises: {
                    create: workout.exercises.map((exercise: any) => ({
                      name: exercise.name,
                      reps: exercise.reps,
                    })),
                  },
                })),
              },
            },
            include: {
              workouts: {
                include: {
                  exercises: true,
                },
              },
            },
          });
        })
      );
    } catch (error) {
      console.error("Error replacing workout plans:", error);
      throw new Error("Failed to replace workout plans.");
    }
  }
  

  // Delete all workout plans for a user
  async deleteAllWorkoutPlansForUser(userId: number) {
    try {
      await prisma.workoutPlan.deleteMany({
        where: { userId },
      });
      return { message: `All workout plans for user with id ${userId} deleted successfully.` };
    } catch (error) {
      console.error(`Error deleting workout plans for user with id ${userId}:`, error);
      throw new Error("Failed to delete workout plans for user.");
    }
  }
}

export default WorkoutManager;
