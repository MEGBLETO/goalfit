import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class SubscriptionService {
  // Create a new subscription
  async createSubscription({
    stripeCustomerId,
    stripeSubscriptionId,
    status,
    startDate,
    endDate,
  }: {
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: string;
    startDate: Date;   
    endDate: Date;    
  }) {
    try {
      // Find the user by Stripe Customer ID
      const user = await prisma.user.findUnique({
        where: { stripeCustomerId },
      });
  
      if (!user) {
        throw new Error("User not found with the provided Stripe Customer ID");
      }
  
      const subscription = await prisma.subscription.create({
        data: {
          userId: user.id,  
          stripeCustomerId,
          stripeSubscriptionId,
          status,
          startDate,  
          endDate,    
        },
      });
  
      return subscription;
    } catch (error) {
      console.error("Error creating subscription:", error);
      throw new Error("Failed to create subscription");
    }
  }
  


  // Update the subscription status
  async updateSubscriptionStatus(
    stripeSubscriptionId: string, 
    status: string, 
    startDate: Date,  
    endDate: Date   
  ) {
    try {
      const subscriptionExists = await this.getSubscriptionBySubId(stripeSubscriptionId);
  

      console.log(subscriptionExists)
      if (!subscriptionExists) {
        throw new Error(`Subscription with ID ${stripeSubscriptionId} does not exist.`);
      }
  
      const updatedSubscription = await prisma.subscription.update({
        where: { stripeSubscriptionId },
        data: { 
          status,
          startDate,  
          endDate    
        },
      });
    
      return updatedSubscription;
    } catch (error) {
      console.error("Error updating subscription status:", error);
      throw new Error("Failed to update subscription status");
    }
  }
  

  // Get subscription by user ID
  async getSubscriptionBySubId(subscriptionId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: {
          stripeSubscriptionId: subscriptionId
        },
      });
      return subscription;
    } catch (error) {
      console.error("Error fetching subscription by user ID:", error);
      throw new Error("Failed to retrieve subscription");
    }
  }

  // Get subscription by Stripe Subscription ID
  async getSubscriptionByStripeId(stripeSubscriptionId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: {
          stripeSubscriptionId,
        },
      });
      return subscription;
    } catch (error) {
      console.error("Error fetching subscription by Stripe ID:", error);
      throw new Error("Failed to retrieve subscription");
    }
  }

  // Cancel a subscription
  async cancelSubscription(stripeSubscriptionId: string) {
    try {
      console.log("stripe Subscription id",stripeSubscriptionId);
      const canceledSubscription = await prisma.subscription.update({
        where: {
          stripeSubscriptionId,
        },
        data: {
          status: "CANCELED",
        },
      });

      console.log("cancel subscription ", canceledSubscription);
      return canceledSubscription;
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw new Error("Failed to cancel subscription");
    }
  }
}

export default new SubscriptionService();
