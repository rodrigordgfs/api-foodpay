import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface CreateRestaurantRequestBody {
  name: string;
  image: string;
  latitude: number;
  longitude: number;
  description: string;
}

const createRestaurantRequestBodySchema = z.object({
  name: z.string(),
  image: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string(),
});

export async function createRestaurant(app: FastifyInstance) {
  app.post(
    "/restaurant",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { name, image, latitude, longitude, description } =
          createRestaurantRequestBodySchema.parse(
            request.body
          ) as CreateRestaurantRequestBody;

        const restaurant = await prisma.restaurant.create({
          data: {
            name,
            image,
            latitude,
            longitude,
            description,
          },
        });

        return reply.status(StatusCodes.CREATED).send(restaurant);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error creating restaurant:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error creating restaurant" });
      }
    }
  );
}
