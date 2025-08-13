import express from "express";
import recipeRoutes from './routes/recipesRoutes'
import dotenv from 'dotenv';
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;


app.use(express.json())

// app.use('/api/v1/recipes') // note: we want to use a versioned version due to APIs contracts
app.use('/recipes/', recipeRoutes)

app.use(errorHandlerMiddleware)

// Start the Express server
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`);
});