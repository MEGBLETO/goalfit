import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class paymentService {


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
  
    async createPayment(subscriptionId: string, stripePaymentIntentId: string, status: string) {
        try {
          const subscription = await this.getSubscriptionBySubId(subscriptionId)

          console.log(subscription, "hellooo")

          if (!subscription) {
            throw new Error(`Subscription with ID ${subscriptionId} does not exist.`);
          }
     
          const payment = await prisma.payment.create({
            data: {
              subscriptionId: subscription.id,  
              stripePaymentIntentId,
              status,
            },
          });
     
          return payment;
        } catch (error) {
          console.error("Error creating payment:", error);
          throw new Error("Failed to create payment");
        }
      }
      
  

  // Update a payment status
  async  updatePaymentStatus(stripePaymentIntentId: string, status: string) {
    try {
      const paymentExists = await prisma.payment.findUnique({
        where: { stripePaymentIntentId },
      });
      if (!paymentExists) {
        throw new Error(`Payment with intent ID ${stripePaymentIntentId} does not exist.`);
      }
      // Update the payment status
      const updatedPayment = await prisma.payment.update({
        where: { stripePaymentIntentId },
        data: { status },
      });
      return updatedPayment;
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw new Error("Failed to update payment status");
    }
  }
  

  // Get payment by stripePaymentIntentId
  async getPaymentByStripeIntentId(stripePaymentIntentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { stripePaymentIntentId },
      });
      return payment;
    } catch (error) {
      console.error("Error finding payment:", error);
      throw new Error("Failed to retrieve payment");
    }
  }

  // Get all payments for a subscription
  async getPaymentsForSubscription(subscriptionId: string) {
    try {
      const payments = await prisma.payment.findMany({
        where: { subscriptionId }, // Make sure this is a string
      });
      return payments;
    } catch (error) {
      console.error("Error retrieving payments for subscription:", error);
      throw new Error("Failed to retrieve payments");
    }
  }
  

  // Cancel payment by updating its status
  async cancelPayment(stripePaymentIntentId: string) {
    try {
      const canceledPayment = await prisma.payment.update({
        where: { stripePaymentIntentId },
        data: { status: "CANCELED" },
      });
      return canceledPayment;
    } catch (error) {
      console.error("Error canceling payment:", error);
      throw new Error("Failed to cancel payment");
    }
  }

  // Mark a payment as success
  async markPaymentSuccess(stripePaymentIntentId: string) {
    try {
      const successfulPayment = await prisma.payment.update({
        where: { stripePaymentIntentId },
        data: { status: "SUCCESS" },
      });
      return successfulPayment;
    } catch (error) {
      console.error("Error marking payment as success:", error);
      throw new Error("Failed to mark payment as success");
    }
  }

  // Mark a payment as failed
  async markPaymentFailed(stripePaymentIntentId: string) {
    try {
      const failedPayment = await prisma.payment.update({
        where: { stripePaymentIntentId },
        data: { status: "FAILED" },
      });
      return failedPayment;
    } catch (error) {
      console.error("Error marking payment as failed:", error);
      throw new Error("Failed to mark payment as failed");
    }
  }
}

export default new paymentService();
