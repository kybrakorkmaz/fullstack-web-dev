import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import axios from "axios";
import flash from "connect-flash";

const app = express();
const port = process.env.PORT || 3000;

const API_URL = "https://www.themealdb.com/api/json/v1/1/";
const API_URL_DRINKS = "https://www.thecocktaildb.com/api/json/v1/1/";

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "gizliKelime",
  resave: false,
  saveUninitialized: true
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMessage = req.flash("error"); // her yerde sadece messageError kullanılır
  next();
});

const categories = [ 
    { name: "Breakfast", value: "Breakfast", image: "breakfast.png" }, 
    { name: "Starter", value: "Starter", image: "starter.png" }, 
    { name: "Meat", value: "Meat", image: "meat.png", subcategories: [ 
        { name: "Beef", value: "Beef", image: "beef.png" }, 
        { name: "Chicken", value: "Chicken", image: "chicken.png" }, 
        { name: "Lamb", value: "Lamb", image: "lamb.png" }, 
        { name: "Pork", value: "Pork", image: "pork.png" }, 
        { name: "Goat", value: "Goat", image: "goat.png" } ]}, 
    { name: "Seafood", value: "Seafood", image: "seafood.png" }, 
    { name: "Pasta", value: "Pasta", image: "pasta.png" }, 
    { name: "Vegetarian", value: "Vegetarian", image: "vegetarian.png" }, 
    { name: "Vegan", value: "Vegan", image: "vegan.png" }, 
    { name: "Side", value: "Side", image: "side.png" }, 
    { name: "Miscellaneous", value: "Miscellaneous", image: "miscellaneous.png" }, 
    { name: "Dessert", value: "Dessert", image: "dessert.png" }, 
    { name: "Cocktails", value: "Cocktails", image: "cocktails.png" }, 
    { name: "Drinks", value: "Drinks", image: "drinks.png" } 
];
function getSubCategories(mainCategory) {
  const category = categories.find(cat => cat.value === mainCategory);
  return category?.subcategories || [];
}

// === Ana Sayfa ===
app.get("/", (req, res) => {
  res.render("index.ejs", { categories });
});
app.get("/navbar", (req, res)=>{
  res.render("index.ejs", { categories });
});
// === Arama – yalnızca burada flash kullanılacak ===
app.get("/search", async (req, res) => {
  try {
    const query = req.query.searchq;
    if (!query || query.trim() === "") {
      req.flash("error", "Search query cannot be empty.");
      return res.redirect("/");
    }
    
    const resultM = await axios.get(`${API_URL}search.php?s=${query}`);
    const resultD = await axios.get(`${API_URL_DRINKS}search.php?s=${query}`);
    const recipes = resultM.data.meals || resultD.data.drinks;

    if (!recipes || recipes.length === 0) {
      console.log("No recipes found for the given query.");
       req.flash("error", "No recipes found for the given query.");
      return res.redirect("/");
    }
    //console.log("recipe length:", recipes.length);
    if(recipes.length === 1){
      res.render("recipe.ejs", { recipe: recipes });
    }else{
      res.render("menu.ejs", { menu: recipes });
    }
    
  } catch (error) {
    console.error("API error:", error);
    req.flash("error", "An error occurred while fetching recipes.");
    return res.redirect("/");
  }
});

// === Menü ===
app.get("/menu", async (req, res) => {
  const category = req.query.category;
  if (!category) {
    return res.render("menu.ejs", { menu: [], messageError: "Category is required." });
  }

  const subCategories = getSubCategories(category);
  if (subCategories.length > 0) {
    return res.render("subMenu.ejs", { subCategories });
  }

  try {
    let recipes = [];

    if (category === "Cocktails") {
      const result = await axios.get(`${API_URL_DRINKS}filter.php?a=alcoholic`);
      recipes = result.data.drinks || [];
    } else if (category === "Drinks") {
      const result = await axios.get(`${API_URL_DRINKS}filter.php?a=non alcoholic`);
      recipes = result.data.drinks || [];
    } else {
      const result = await axios.get(`${API_URL}filter.php?c=${encodeURIComponent(category)}`);
      recipes = result.data.meals || [];
    }

    if (!recipes || recipes.length === 0) {
      return res.render("menu.ejs", { menu: [], messageError: "No recipes found for this category." });
    }

    res.render("menu.ejs", { menu: recipes });
  } catch (error) {
    console.error("API error:", error);
    return res.render("menu.ejs", { menu: [], messageError: "An error occurred while fetching recipes." });
  }
});

// === Alt Menü ===
app.get("/subMenu", async (req, res) => {
  const subCategory = req.query.subCategory;

  if (!subCategory) {
    return res.render("menu.ejs", { menu: [], messageError: "Subcategory is required." });
  }

  try {
    const result = await axios.get(`${API_URL}filter.php?c=${encodeURIComponent(subCategory)}`);
    const recipes = result.data.meals || [];

    if (!recipes || recipes.length === 0) {
      return res.render("menu.ejs", { menu: [], messageError: "No recipes found for this subcategory." });
    }

    res.render("menu.ejs", { menu: recipes });
  } catch (error) {
    console.error("API error:", error);
    return res.render("menu.ejs", { menu: [], messageError: "An error occurred while fetching recipes." });
  }
});

// === Tarif Detayı ===
app.get("/recipe", async (req, res) => {
  const selectedRecipeId = req.query.recipe;
  const isDrink = req.query.isDrink;

  if (!selectedRecipeId || selectedRecipeId.trim() === "") {
    return res.render("menu.ejs", { menu: [], messageError: "Recipe ID is required." });
  }

  try {
    let selectedRecipe = [];

    if (isDrink === "true") {
      const result = await axios.get(`${API_URL_DRINKS}lookup.php?i=${encodeURIComponent(selectedRecipeId)}`);
      selectedRecipe = result.data.drinks || [];
    } else {
      const result = await axios.get(`${API_URL}lookup.php?i=${encodeURIComponent(selectedRecipeId)}`);
      selectedRecipe = result.data.meals || [];
    }

    if (!selectedRecipe || selectedRecipe.length === 0) {
      return res.render("menu.ejs", { menu: [], messageError: "Recipe not found." });
    }

    res.render("recipe.ejs", { recipe: selectedRecipe });
  } catch (error) {
    console.error("API error:", error);
    return res.render("menu.ejs", { menu: [], messageError: "An error occurred while fetching the recipe." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
