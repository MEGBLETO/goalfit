import { Router } from "express";
import subscriptionService from "../business/subscriptions";
import isAuthenticated from "../middlewares/isAuth";

const router = Router();

// Route to create a subscription
router.post("/create-subscription", async (req, res) => {
  const { stripeCustomerId, stripeSubscriptionId, status, startDate, endDate } = req.body;

  if (!stripeCustomerId || !stripeSubscriptionId || !status || !startDate || !endDate) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const subscription = await subscriptionService.createSubscription({
      stripeCustomerId,
      stripeSubscriptionId,
      status,
      startDate: new Date(startDate),  
      endDate: new Date(endDate),      
    });
    res.status(201).send(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).send({ error: "Failed to create subscription" });
  }
});


// Route to update subscription status
router.put("/update-subscription-status", async (req, res) => {
  const { stripeSubscriptionId, status, startDate, endDate } = req.body;

  if (!stripeSubscriptionId || !status || !startDate || !endDate) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const updatedSubscription = await subscriptionService.updateSubscriptionStatus(
      stripeSubscriptionId,
      status,
      new Date(startDate),
      new Date(endDate)      
    );
    res.status(200).send(updatedSubscription);
  } catch (error) {
    console.error("Error updating subscription status:", error);
    res.status(500).send({ error: "Failed to update subscription status" });
  }
});

// Route to get subscription by user ID
router.get("/subscription/:subscriptionId", async (req, res) => {
  const { subscriptionId } = req.params;

  try {
    const subscription = await subscriptionService.getSubscriptionBySubId(subscriptionId);
    if (!subscription) {
      return res.status(404).send({ error: "Subscription not found" });
    }
    res.status(200).send(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).send({ error: "Failed to retrieve subscription" });
  }
});

// Route to get subscription by Stripe Subscription ID
router.get("/subscription/:stripeSubscriptionId", isAuthenticated, async (req, res) => {
  const { stripeSubscriptionId } = req.params;

  if (!stripeSubscriptionId) {
    return res.status(400).send({ error: "Missing Stripe Subscription ID" });
  }

  try {
    const subscription = await subscriptionService.getSubscriptionByStripeId(stripeSubscriptionId);
    if (!subscription) {
      return res.status(404).send({ error: "Subscription not found" });
    }
    res.status(200).send(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    res.status(500).send({ error: "Failed to retrieve subscription" });
  }
});

// Route to cancel a subscription
router.post("/cancel-subscription", async (req, res) => {
  const { stripeSubscriptionId } = req.body;
  console.log("stripe Subscription id",stripeSubscriptionId);

  if (!stripeSubscriptionId) {
    return res.status(400).send({ error: "Missing Stripe Subscription ID" });
  }

  try {
    const canceledSubscription = await subscriptionService.cancelSubscription(stripeSubscriptionId);
    console.log("cancel subscription ", canceledSubscription);
    res.status(200).send(canceledSubscription);
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).send({ error: "Failed to cancel subscription" });
  }
});

export default router;
