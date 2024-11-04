import express from "express";
import bodyParser from "body-parser";
import 'dotenv/config';
import helmet from "helmet";
import morgan from "morgan";
import { PORT } from "./config";
import { setupProxies } from "./proxy";
import cors from "cors"
import art from './art'

const app = express();

app.use(cors())
app.use(helmet());
app.use(morgan("combined"));

setupProxies(app);

app.post('/', (req, res) => {
  console.log(req)
  res.send('API Gateway is running');
});

app.listen(PORT, () => {
  console.log(art);
});
