class RecipeNotFoundError extends Error {
    constructor(message) { 
    super(message); 
    this.name = 'RecipeNotFoundError'; 
  } 
}

export default RecipeNotFoundError