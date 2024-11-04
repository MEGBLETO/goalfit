import { Router } from "express";
import PaymentManager from "../business/payments";
import { body, validationResult } from "express-validator";
import isAuthenticated from "../middlewares/isAuth";
import Stripe from "stripe";
import bodyParser from "body-parser";
import axios from "axios";

const router = Router();
const paymentManager = new PaymentManager();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Route to create a Stripe Checkout session
router.post(
  "/create-checkout-session",
  isAuthenticated,
  async (req: any, res) => {
    try {
      const stripeCustomerId = await paymentManager.checkOrCreateStripeCustomer(
        req.userId
      );
      const session = await paymentManager.createSession(stripeCustomerId);

      res.status(200).send(session);
    } catch (error) {
      console.error("Error creating Stripe checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  }
);

// Route to cancel a subscription
router.post("/cancel-subscription/:subscriptionId",bodyParser(), async (req, res) => {

  const { subscriptionId } = req.params;

  try {
    const canceledSubscription = await paymentManager.cancelSubscription(
      subscriptionId
    );
    res.status(200).send(canceledSubscription);
  } catch (error) {
    console.error("Error canceling subscription:", error);
    res.status(500).json({ error: "Failed to cancel subscription" });
  }
});

router.get("/verif-subscription", isAuthenticated, async (req: any, res) => {
  try{
    if (!req.userId) {
      return res.status(400).json({ message: "User ID not found" });
    }

    let url = `${process.env.BACKEND_URL}/bdd/user/ ${req.userId}`

    const customer: any = await axios.get(url);

    const subscription = await stripe.subscriptions.list({
      customer: customer.stripeCustomerId,
      status: 'active'
    });

    res.status(200).send({data: subscription.data});
  }catch(error){
    res.status(500).send(`Fail to get subscriptions for user with id : ${req.userId} : ${error.message}`);
  }
})

// Webhook handler for Stripe events
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    console.log(sig, "heehehhee88888888");
    console.log(req.body)

    try {
      await paymentManager.handleWebhookEvent(req.body, sig);
      res.status(200).send();
    } catch (error) {
      console.error("Webhook processing failed:", error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

export default router;
