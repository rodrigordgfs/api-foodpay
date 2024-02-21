import fastify from "fastify";
import cors from "@fastify/cors";
import { helthCheck, createRestaurant, listRestaurants } from "../routes";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(helthCheck);
app.register(createRestaurant);
app.register(listRestaurants);

app.listen({ port: 5000 }).then(() => {
  console.log("Server is running on port 5000");
});
