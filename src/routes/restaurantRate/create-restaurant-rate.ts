import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateRestaurantRateRequestBody {
  userId: string;
  rate: number;
}

interface CreateRestaurantRateRequestParams {
  restaurantId: string;
}

const createRestaurantRequestBodySchema = z.object({
  userId: z.string(),
  rate: z.number(),
});

async function findRestaurantById(id: string): Promise<Restaurant | null> {
  return prisma.restaurant.findUnique({ where: { id } });
}

export async function createRestaurantRate(app: FastifyInstance) {
  app.post(
    "/restaurant/:restaurantId/rate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { userId, rate } = createRestaurantRequestBodySchema.parse(
          request.body
        ) as CreateRestaurantRateRequestBody;

        const { restaurantId } =
          request.params as CreateRestaurantRateRequestParams;

        const existingRestaurant = await findRestaurantById(restaurantId);

        if (!existingRestaurant) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Restaurant not found" });
        }

        const restaurantRate = await prisma.restaurantRate.create({
          data: {
            rate,
            userId,
            restaurantId,
          },
        });

        return reply.status(StatusCodes.CREATED).send(restaurantRate);
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
