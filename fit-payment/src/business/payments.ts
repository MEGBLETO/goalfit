import axios from "axios";
import Stripe from "stripe";
const dayjs = require('dayjs');

const date = dayjs(); // Date actuelle
const FormData = require('form-data');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

class PaymentManager {
  async checkOrCreateStripeCustomer(userID: number) {
    try {
      console.log("userId", userID)
      const response = await axios.get(
        `${process.env.BACKEND_URL}/bdd/user/${userID}`
      );
      const user = response.data;

      if (user && user.stripeCustomerId) {
        return user.stripeCustomerId;
      }

      const customer = await this.createCustomer(user.email);

      await axios.put(`${process.env.BACKEND_URL}/bdd/user/${userID}`, {
        stripeCustomerId: customer.id,
      });

      return customer.id;
    } catch (error) {
      console.error("Error checking or creating Stripe customer:", error);
      throw new Error("Failed to check or create customer");
    }
  }

  // Create a Stripe Checkout Session
  async createSession(stripeCustomerId: string) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer: stripeCustomerId,
        line_items: [
          {
            price: process.env.PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      });

      return session;
    } catch (error) {
      console.error("Error creating Stripe Checkout session:", error);
      throw new Error("Failed to create checkout session");
    }
  }

  // Create a Stripe customer
  async createCustomer(email: string) {
    try {
      const customer = await stripe.customers.create({ email });
      return customer;
    } catch (error) {
      console.error("Error creating Stripe customer:", error);
      throw new Error("Failed to create customer");
    }
  }

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string) {
    try {
      const canceledSubscription = await stripe.subscriptions.cancel(
        subscriptionId
      );
      return {
        message:
          "Demande d'annulation d'abonnement reçue. Vous serez informé une fois que cela sera traité.",
        status: "annulation_initiée",
        accessUntil: "immédiat",
      };
    } catch (error) {
      console.error("Error canceling subscription:", error);
      throw new Error("Failed to cancel subscription");
    }
  }


  // Helper function to retry an operation
  async retryOperation<T>(
    operation: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        console.log(`Retrying operation... attempts remaining: ${retries}`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.retryOperation(operation, retries - 1, delay);
      } else {
        throw error;
      }
    }
  }

  // Helper function to retry an operation
  async handleWebhookEvent(event: Buffer, signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    let stripeEvent: Stripe.Event;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      throw new Error("Webhook signature verification failed");
    }

    switch (stripeEvent.type) {
      case "customer.subscription.created":
        const subscriptionCreated = stripeEvent.data
          .object as Stripe.Subscription;
        console.log("Subscription created:", subscriptionCreated.customer);

        // Create the subscription in the database with startDate and endDate
        await axios.post(
          `${process.env.BACKEND_URL}/bdd/subscription/create-subscription`,
          {
            stripeCustomerId: subscriptionCreated.customer,
            stripeSubscriptionId: subscriptionCreated.id,
            status: subscriptionCreated.status.toUpperCase(),
            startDate: new Date(
              subscriptionCreated.current_period_start * 1000
            ),
            endDate: new Date(subscriptionCreated.current_period_end * 1000),
          }
        );
        break;

      // 2. Handle subscription updates
      case "customer.subscription.updated":
        const subscriptionUpdated = stripeEvent.data
          .object as Stripe.Subscription;
        console.log("Subscription updated:", subscriptionUpdated.customer);

        await this.retryOperation(
          () =>
            axios.put(
              `${process.env.BACKEND_URL}/bdd/subscription/update-subscription-status`,
              {
                stripeSubscriptionId: subscriptionUpdated.id,
                status: subscriptionUpdated.status.toUpperCase(),
                startDate: new Date(
                  subscriptionUpdated.current_period_start * 1000
                ),
                endDate: new Date(
                  subscriptionUpdated.current_period_end * 1000
                ),
              }
            ),
          3, // Retry 3 times
          2000 // Wait for 2 seconds between retries
        );
        break;

      // 3. Handle subscription deletions
      case "customer.subscription.deleted":
        const subscriptionDeleted: any = stripeEvent.data
          .object as Stripe.Subscription;
        console.log("Subscription deleted:", subscriptionDeleted);

        
        const customer = await axios.get(`${process.env.BACKEND_URL}/bdd/user/stripeCustomer/${subscriptionDeleted.customer}`)

        await axios.post(`${process.env.BACKEND_URL}/bdd/subscription/cancel-subscription`,
          {
            stripeSubscriptionId: customer.data.data.subscription.stripeSubscriptionId
          }
        );

        // Créer un FormData pour envoyer les données avec la pièce jointe
        const form = new FormData();
    
        form.append('to', customer.data.data.email);
        form.append('subject', `Désabonement au service fitgoal`);
        form.append('content', `
            FitGoal,
            
            Ce mail a pour objectif de confirmer votre désabonement a nos services.
            Merci pour la confiance que vous nous avez accorder pendant tout ce temps.
            
            Bien cordialement
        `);

        // Envoyer les données avec Axios
        await axios.post(`${process.env.BACKEND_URL}/mailer/mail/send-email`, form, {
          headers: {
              ...form.getHeaders() 
          }
      })
      .then(response => {
          console.log("mail envoyé");
      })
      .catch(err => {
          console.error("Failed to send mail: " + err.message);
      });

        await this.retryOperation(
          () =>
            axios.put(
              `${process.env.BACKEND_URL}/bdd/subscription/update-subscription-status`,
              {
                stripeSubscriptionId: subscriptionDeleted.id,
                status: "CANCELED",
              }
            ),
          3,
          2000
        );
        break;

      // 4. Handle invoice creation (create pending payment)
      case "invoice.created":
        const invoiceCreated = stripeEvent.data.object as Stripe.Invoice;
        console.log("Invoice created:", invoiceCreated.customer);

        // Retry payment creation with status 'PENDING'
        await this.retryOperation(
          () =>
            axios.post(
              `${process.env.BACKEND_URL}/bdd/payment/create-payment`,
              {
                subscriptionId: invoiceCreated.subscription,
                stripePaymentIntentId: invoiceCreated.payment_intent,
                status: "PENDING",
              }
            ),
          3, // Retry 3 times
          2000 // Wait for 2 seconds between retries
        );
        break;

      // 5. Handle successful payment for invoices (update payment status to 'SUCCESS')
      case "invoice.payment_succeeded":
        const invoiceSucceeded = stripeEvent.data.object as Stripe.Invoice;
        console.log("Invoice payment succeeded:", invoiceSucceeded.lines.data[0]);
        let amount;
        let toUse = `${invoiceSucceeded.lines.data[0].amount}`;
        amount = toUse.slice(0, 2) + '.' + toUse.slice(2)

        console.info("Creation de facture");
        const response = await axios.get(`${process.env.BACKEND_URL}/bdd/user/stripeCustomer/${invoiceSucceeded.customer}`)
        const data = {
          documentTitle: `Facture`,
          currency: invoiceSucceeded.currency.toUpperCase(),

          sender: {
            company: 'Fit Goal',
            address: '11 rue barbes Paris',
            zip: '12345',
            city: 'Paris',
            country: 'France',
            email: 'fitgoal@example.com',
          },
          // Customer information
          client: {
            company: `${response.data.data.name} ${response.data.data.surname}`,
            country: 'France',
            email: `${response.data.data.email}`,
          },
          // Invoice information
          invoiceNumber: `${Date.now()}`,
          invoiceDate: `${date.format('YYYY/MM/DD')}`,
          products: [
            {
              quantity: invoiceSucceeded.lines.data[0].quantity,
              description: invoiceSucceeded.lines.data[0].description,
              tax: 0,
              price: parseFloat(amount),
            },
          ],
        "bottomNotice": "Merci pour votre confiance !"
        };
        axios.post(
          `${process.env.BACKEND_URL}/bdd/facture/${response.data.data.id}`, {data}
        )

        // Update payment status to 'SUCCESS'
        await this.retryOperation(
          () =>
            axios.put(
              `${process.env.BACKEND_URL}/bdd/payment/update-payment-status`,
              {
                stripePaymentIntentId: invoiceSucceeded.payment_intent,
                status: "SUCCESS",
              }
            ),
          3,
          2000
        );

        // Optionally, update subscription status to 'ACTIVE'
        await this.retryOperation(
          () =>
            axios.put(
              `${process.env.BACKEND_URL}/bdd/subscription/update-subscription-status`,
              {
                stripeSubscriptionId: invoiceSucceeded.subscription,
                status: "ACTIVE",
              }
            ),
          3,
          2000
        );
        break;

      // 6. Handle payment failure (update payment status to 'FAILED')
      case "invoice.payment_failed":
        const invoiceFailed = stripeEvent.data.object as Stripe.Invoice;
        console.log("Invoice payment failed:", invoiceFailed);

        // Update payment status to 'FAILED'
        await this.retryOperation(
          () =>
            axios.put(
              `${process.env.BACKEND_URL}/bdd/payment/update-payment-status`,
              {
                stripePaymentIntentId: invoiceFailed.payment_intent,
                status: "FAILED",
              }
            ),
          3,
          2000
        );
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }
  }
}

export default PaymentManager;
