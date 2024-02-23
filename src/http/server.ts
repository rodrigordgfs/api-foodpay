import fastify from "fastify";
import cors from "@fastify/cors";
import {
  helthCheck,
  createRestaurant,
  listRestaurants,
  listRestaurantById,
  updateRestaurant,
  deleteRestaurantById,
  createRestaurantRate,
  createCategorie,
  deleteCategorieById,
  listCategorieById,
  listCategories,
  updateCategorie,
  createProduct,
  deleteProductById,
  listProductById,
  listProducts,
  updateProduct,
  highlightProduct,
  favoriteRestaurantRate,
} from "../routes";

const app = fastify();

app.register(cors, {
  origin: "*",
});

//Route - Health Check
app.register(helthCheck);

// Route - Restaurant
app.register(createRestaurant);
app.register(listRestaurants);
app.register(listRestaurantById);
app.register(updateRestaurant);
app.register(deleteRestaurantById);

//Route - Restaurant Rate
app.register(createRestaurantRate);

//Route - Restaurant Favorite
app.register(favoriteRestaurantRate);

//Route - Categorie
app.register(createCategorie);
app.register(deleteCategorieById);
app.register(listCategorieById);
app.register(listCategories);
app.register(updateCategorie);

//Route - Product
app.register(createProduct);
app.register(deleteProductById);
app.register(listProductById);
app.register(listProducts);
app.register(updateProduct);
app.register(highlightProduct);

app.listen({ port: 5000 }).then(() => {
  console.log("Server is running on port 5000");
});
