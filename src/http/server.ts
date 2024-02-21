import fastify from "fastify";
import cors from "@fastify/cors";
import {
  helthCheck,
  createRestaurant,
  listRestaurants,
  listRestaurantById,
  updateRestaurant,
  deleteRestaurantById,
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

app.listen({ port: 5000 }).then(() => {
  console.log("Server is running on port 5000");
});
