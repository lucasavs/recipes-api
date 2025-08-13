import express from "express";
import recipeRoutes from './routes/recipesRoutes'
import dotenv from 'dotenv';
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";

dotenv.config();

console.log("wololose")

const app = express();

app.use(express.json())

// app.use('/api/v1/recipes') // note: we want to use a versioned version due to APIs contracts
app.use('/recipes/', recipeRoutes)

app.use(errorHandlerMiddleware)

export default app