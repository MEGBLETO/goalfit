import { Router } from "express";
import paymentService from "../business/payments";
import isAuthenticated from "../middlewares/isAuth";

const router = Router();

// Route to create a new payment record
router.post("/create-payment", async (req, res) => {
  const { subscriptionId, stripePaymentIntentId, status } = req.body;
  if (!subscriptionId || !stripePaymentIntentId || !status) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const payment = await paymentService.createPayment(
      subscriptionId,
      stripePaymentIntentId,
      status
    );

    res.status(201).send(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).send({ error: "Failed to create payment" });
  }
});

router.put("/update-payment-status", async (req, res) => {
  const { stripePaymentIntentId, status } = req.body;

  if (!stripePaymentIntentId || !status) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  try {
    const updatedPayment = await paymentService.updatePaymentStatus(
      stripePaymentIntentId,
      status
    );

    res.status(200).send(updatedPayment);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).send({ error: "Failed to update payment status" });
  }
});



// Route for failed payment
router.put("/failed", async (req, res) => {
  const { stripePaymentIntentId } = req.body;

  if (!stripePaymentIntentId) {
    return res.status(400).send({ error: "Missing Stripe Payment Intent ID" });
  }

  try {
    const updatedPayment = await paymentService.updatePaymentStatus(stripePaymentIntentId, "FAILED");
    res.status(200).send(updatedPayment);
  } catch (error) {
    console.error("Error updating payment status to failed:", error);
    res.status(500).send({ error: "Failed to update payment status to failed" });
  }
});

// Route to retrieve a payment by Stripe Payment Intent ID
router.get("/payment/:stripePaymentIntentId", async (req, res) => {
  const { stripePaymentIntentId } = req.params;

  if (!stripePaymentIntentId) {
    return res.status(400).send({ error: "Missing Stripe Payment Intent ID" });
  }

  try {
    const payment = await paymentService.getPaymentByStripeIntentId(stripePaymentIntentId);
    if (!payment) {
      return res.status(404).send({ error: "Payment not found" });
    }
    res.status(200).send(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).send({ error: "Failed to retrieve payment" });
  }
});

// Route to retrieve all payments for a subscription
router.get("/subscription-payments/:subscriptionId", async (req, res) => {
  const { subscriptionId } = req.params;

  if (!subscriptionId) {
    return res.status(400).send({ error: "Missing subscription ID" });
  }

  try {
    const payments = await paymentService.getPaymentsForSubscription(String(subscriptionId));
    res.status(200).send(payments);
  } catch (error) {
    console.error("Error fetching payments for subscription:", error);
    res.status(500).send({ error: "Failed to retrieve payments" });
  }
});

// Route to cancel a payment by Stripe Payment Intent ID
router.post("/cancel-payment", async (req, res) => {
  const { stripePaymentIntentId } = req.body;

  if (!stripePaymentIntentId) {
    return res.status(400).send({ error: "Missing Stripe Payment Intent ID" });
  }

  try {
    const canceledPayment = await paymentService.cancelPayment(stripePaymentIntentId);
    res.status(200).send(canceledPayment);
  } catch (error) {
    console.error("Error canceling payment:", error);
    res.status(500).send({ error: "Failed to cancel payment" });
  }
});

export default router;
