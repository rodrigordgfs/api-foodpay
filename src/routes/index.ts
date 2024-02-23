import { helthCheck } from "./helth-check";
import { createRestaurant } from "./restaurant/create-restaurant";
import { listRestaurants } from "./restaurant/list-restaurants";
import { listRestaurantById } from "./restaurant/list-restaurants-by-id";
import { updateRestaurant } from "./restaurant/update-restaurant";
import { deleteRestaurantById } from "./restaurant/delete-restaurant";
import { createRestaurantRate } from "./restaurantRate/create-restaurant-rate";
import { createCategorie } from "./categorie/create-categorie";
import { deleteCategorieById } from "./categorie/delete-categorie";
import { listCategorieById } from "./categorie/list-categorie-by-id";
import { listCategories } from "./categorie/list-categories";
import { updateCategorie } from "./categorie/update-categorie";
import { createProduct } from "./product/create-product";
import { deleteProductById } from "./product/delete-product";
import { listProductById } from "./product/list-product-by-id";
import { listProducts } from "./product/list-products";
import { updateProduct } from "./product/update-product";
import { highlightProduct } from "./product/highlight-product";
import { favoriteRestaurantRate } from "./restaurantFavorite/toggle-favorite-restaurant";

export {
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
};
