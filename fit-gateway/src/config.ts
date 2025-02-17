export const PORT = process.env.PORT || 3000;

const authService = {
  route: "/authenticate",
  target: "http://localhost:5004",
  authRequired: false,
  paths: [
    { path: "/register", method: "POST", authRequired: false },
    { path: "/login", method: "POST", authRequired: false },
    { path: "/request-password-reset", method: "POST", authRequired: false },
    { path: "/reset-password", method: "POST", authRequired: false },
    { path: "/auth/google", method: "GET", authRequired: false },
    { path: "/auth/google/callback", method: "GET", authRequired: false },
  ],
};

const bddService = {
  route: "/bdd",
  target: "http://localhost:5003",
  authRequired: true,
  paths: [
    { path: "/", method: "GET", authRequired: true },
    { path: "/verify-email", method: "GET", authRequired: false },
    { path: "/:id", method: "GET", authRequired: true },
    { path: "/:id", method: "PUT", authRequired: true },
    { path: "/:id", method: "PATCH", authRequired: true },
    { path: "/:id", method: "DELETE", authRequired: true },
    { path: "/stripeCustomer/:id", method: "GET", authRequired: true },
    // Meal Plan Routes
    { path: "/meal", method: "GET", authRequired: true },
    { path: "/meal/mealplans", method: "POST", authRequired: true },
    { path: "/meal/mealplans", method: "PUT", authRequired: true },
    { path: "/meal", method: "DELETE", authRequired: true },
    { path: "/meal/mealplans", method: "DELETE", authRequired: true },
    { path: "/meal/default", method: "GET", authRequired: false },
    { path: "/meal/:id", method: "GET", authRequired: true },
    // Workout Plan Routes
    { path: "/workout", method: "GET", authRequired: true },
    { path: "/workout/default", method: "GET", authRequired: false },
    { path: "/workout", method: "POST", authRequired: true },
    { path: "/workout/bulk", method: "POST", authRequired: true },
    { path: "/workout/:id", method: "GET", authRequired: true },
    { path: "/workout/workoutplans", method: "PUT", authRequired: true },
    { path: "/workout/:id", method: "PUT", authRequired: true },
    { path: "/workout/date", method: "DELETE", authRequired: true },
    { path: "/workout/all", method: "DELETE", authRequired: true },
    { path: "/workout/:id", method: "DELETE", authRequired: true },
    // Payment Routes
    { path: "/payment/create-payment", method: "POST", authRequired: true },
    { path: "/payment/update-payment-status", method: "PUT", authRequired: true },
    { path: "/payment/failed", method: "PUT", authRequired: true },
    { path: "/payment/payment/:stripePaymentIntentId", method: "GET", authRequired: true },
    { path: "/payment/subscription-payments/:subscriptionId", method: "GET", authRequired: true },
    { path: "/payment/cancel-payment", method: "POST", authRequired: true },
    // Facture Routes
    { path: "/facture", method: "GET", authRequired: true },
    { path: "/facture/:userId", method: "POST", authRequired: true },
    // User Routes
    { path: "/user", method: "GET", authRequired: false },
    { path: "/user/verify-email", method: "GET", authRequired: false },
    { path: "/user", method: "POST", authRequired: false },
    { path: "/user/:id", method: "PUT", authRequired: true },
    { path: "/user/:id", method: "PATCH", authRequired: true },
    { path: "/user/:id", method: "GET", authRequired: false },
    { path: "/user/:id", method: "DELETE", authRequired: true },
    { path: "/user/stripeCustomer/:id", method: "GET", authRequired: true },
    // Subscription Routes
    { path: "/subscription/create-subscription", method: "POST", authRequired: true },
    { path: "/subscription/update-subscription-status", method: "PUT", authRequired: true },
    { path: "/subscription/subscription/:subscriptionId", method: "GET", authRequired: true },
    { path: "/subscription/subscription/:stripeSubscriptionId", method: "GET", authRequired: true },
    { path: "/subscription/cancel-subscription", method: "POST", authRequired: true },
  ],
};

const aiService = {
  route: "/ai",
  target: "http://localhost:5002",
  authRequired: true,
  paths: [
    { path: "/mealplan", method: "POST", authRequired: true },
    { path: "/workoutplan", method: "POST", authRequired: true },
  ],
};

const mailerService = {
  route: "/mailer",
  target: "http://localhost:5005",
  authRequired: false,
  paths: [
    { path: "/send-welcome-email", method: "POST", authRequired: false },
    { path: "/send-email", method: "POST", authRequired: false },
    { path: "/send-password-reset-email", method: "POST", authRequired: false },
    { path: "/send-verification-email", method: "POST", authRequired: false },
    { path: "/send-notification-email", method: "POST", authRequired: false },
    { path: "/send-bulk-email", method: "POST", authRequired: false },
  ],
};

export const services = [authService, bddService, aiService, mailerService];

