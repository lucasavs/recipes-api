import { NextFunction, Request, Response } from 'express';
import RecipeNotFoundError from '../errors/recipeNotFoudError';

const errorHandlerMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof RecipeNotFoundError) {
        res.status(404).json({
            message: "No recipe found",
        })
    } else {
        console.error(error, error.stack)
        res.status(500).json({
            message: "Internal server error",
        })
    }

    
}

export default errorHandlerMiddleware