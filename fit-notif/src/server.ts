import express from "express";
import "dotenv/config";
import cors from 'cors'
import bodyParser from "body-parser";
import art from './arts'
import mailingRoutes from './controllers/mailing'


const app = express();


// Augmenter la limite à 10 Mo (vous pouvez ajuster selon vos besoins)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use(bodyParser.json());
app.use(cors());

app.use("/mail", mailingRoutes);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`${art}`);
});
