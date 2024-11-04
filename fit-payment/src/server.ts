import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import paymentRoute from "./controllers/payment";
import cors from "cors";
import art from './art' 

const app = express();
// app.use(bodyParser.json());
app.use(cors());

app.use("/payment", paymentRoute);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
 console.log(art)
});
