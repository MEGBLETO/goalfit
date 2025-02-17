import express, { Request, Response, NextFunction } from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import userRoute from "./controllers/users";
import mealPlanRoute from "./controllers/mealplan";
import workoutRoute from "./controllers/workoutplan";
import factureRoute from './controllers/facture';
import subscriptionRoute from "./controllers/subscriptions";
import paymentRoutes from "./controllers/payments";
import cors from "cors";
import art from './art';

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/workout", workoutRoute);
app.use("/meal", mealPlanRoute);
app.use("/facture", factureRoute);
app.use("/user", userRoute);
app.use('/subscription', subscriptionRoute);
app.use('/payment', paymentRoutes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(art);
  console.log(`Server is running on port ${PORT}`);
});
