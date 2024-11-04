import express from 'express'
import 'dotenv/config'
// import art from '../art.js'
import workoutRoute from "./controllers/Workout"
import mealPlanRoute from "./controllers/MealPlan"
import bodyParser from 'body-parser'
import cors from "cors"
import art from './art'

const app = express()

app.use(cors())
app.use(bodyParser.json());



console.log("hiii")
app.use('/mealplan', mealPlanRoute)
app.use('/workoutplan', workoutRoute)



const PORT = process.env.PORT || 3003

app.listen(PORT, () => {
    console.log(art)
})