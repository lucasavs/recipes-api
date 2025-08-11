import express, { Request, Response } from "express";
import recipeRoutes from './routes/recipesRoutes'

const app = express();
const port = process.env.PORT || 3000;

// Define the root path with a greeting message
// app.get("/", (req: Request, res: Response) => {
//     res.json({ message: "Welcome to the Express + TypeScript Server!" });
// });

// app.use('/api/v1/recipes') // note: we want to use a versioned version due to APIs contracts
app.use('recipes', recipeRoutes)

// Start the Express server
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});