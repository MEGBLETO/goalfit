import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserManager {
  async createUser(data: any) {
    try {
      const user = await prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  async updateUser(id: number, data: any) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data,
      });
      return user;
    } catch (error) {
      console.error("Error updating user:", error);
      throw new Error("Failed to update user");
    }
  }

  async updateUserProfile(id: number, data: any) {
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          contact: data.contact,
          name: data.name,
          surname: data.surname,
          age: data.age,
          gender: data.gender,
          weight: data.weight,
          height: data.height,
          fitnessLevel: data.fitnessLevel,
          firstLogin: false,
          dietaryPreferences: {
            upsert: {
              create: {
                type: data.dietaryPreferences?.type || "Unknown", // Ensure type is provided
                dislikes: data.dietaryPreferences?.dislikes || [],
                restrictions: data.dietaryPreferences?.restrictions || [],
              },
              update: {
                type: data.dietaryPreferences?.type || "Unknown", // Ensure type is updated
                dislikes: data.dietaryPreferences?.dislikes || [],
                restrictions: data.dietaryPreferences?.restrictions || [],
              },
            },
          },
          equipment: data.equipment,
          availability: {
            upsert: {
              create: {
                daysPerWeek: data.availability?.daysPerWeek || 0,
                minutesPerDay: data.availability?.minutesPerDay || 0,
              },
              update: {
                daysPerWeek: data.availability?.daysPerWeek || 0,
                minutesPerDay: data.availability?.minutesPerDay || 0,
              },
            },
          },
          healthConsiderations: data.healthConsiderations || [],
        },
      });
  
      return updatedUser;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Failed to update user profile");
    }
  }
  
  
  async deleteUser(id: number) {
    try {
      await prisma.goal.deleteMany({ where: { userId: id } });
      await prisma.dietaryPreference.deleteMany({ where: { userId: id } });
      await prisma.availability.deleteMany({ where: { userId: id } });

      const mealPlans = await prisma.mealPlan.findMany({
        where: { userId: id },
      });
      for (const mealPlan of mealPlans) {
        await prisma.meal.deleteMany({
          where: {
            OR: [
              { id: mealPlan.morningMealId },
              { id: mealPlan.afternoonMealId },
              { id: mealPlan.eveningMealId },
            ],
          },
        });
        await prisma.nutrition.deleteMany({
          where: {
            id: {
              in: [
                mealPlan.morningMealId,
                mealPlan.afternoonMealId,
                mealPlan.eveningMealId,
              ],
            },
          },
        });
      }

      await prisma.mealPlan.deleteMany({ where: { userId: id } });
      await prisma.workoutPlan.deleteMany({ where: { userId: id } });
      await prisma.userWeightEntry.deleteMany({ where: { userId: id } });

      const deleteUser = await prisma.user.delete({
        where: { id },
      });

      return deleteUser;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user and related records");
    }
  }

  async findUserByVerificationToken(token: string) {
    try {
      console.log("Searching for token:", token); // Log the token being searched
      const user = await prisma.user.findFirst({
        where: {
          verificationToken: token,
        },
      });
      if (!user) {
        console.error("User not found with the provided verification token:", token);
        return null;
      }
      return user;
    } catch (error) {
      console.error("Error finding user by verification token:", error);
      throw new Error("Failed to find user by verification token");
    }
  }

  async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        include: {
          subscription: true,
        },
      });
      return users;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async getUserById(id: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          subscription: true,
          mealPlans: true,
          workoutPlans: true,
        },
      });
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw new Error("Failed to fetch user");
    }
  }
  

  async getUserByEmail(email: string) {
    try {
      console.log(email, "helllo")
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      console.log(user, "helllooooo")
      return user;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      throw new Error("Failed to fetch user by email");
    }
  }

  async getUserByStripeCustomerId(stripeCustomerId: string) {
    try {

      const user = await prisma.user.findUnique({
        where: { stripeCustomerId : stripeCustomerId },
        include: {
          subscription: true,
        },
      });
      if (!user) {
        throw new Error(`User with stripe ID ${stripeCustomerId} not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error fetching user with stripe ID ${stripeCustomerId}:`, error);
      throw new Error("Failed to fetch user by stripe customer ID");
    }
  }
}

export default UserManager;
