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

const restaurantFavoriteRequestparamsSchema = z.object({
  userId: z.string().uuid(),
  restaurantId: z.string().uuid(),
});

interface restaurantFavoriteRequestParams {
  restaurantId: string;
  userId: string;
}

async function findRestaurantById(id: string): Promise<Restaurant | null> {
  return prisma.restaurant.findUnique({ where: { id } });
}

export async function findFavoriteRestaurant(app: FastifyInstance) {
  app.get(
    "/restaurant/:restaurantId/favorite/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { restaurantId, userId } =
          restaurantFavoriteRequestparamsSchema.parse(
            request.params
          ) as restaurantFavoriteRequestParams;

        const existRestaurant = await findRestaurantById(restaurantId);

        if (!existRestaurant) {
          return reply.status(StatusCodes.NOT_FOUND).send({
            message: "Restaurant not found",
          });
        }

        const restaurantFavorite = await prisma.restaurantFavorite.findUnique({
          where: {
            restaurantId_userId: {
              userId,
              restaurantId,
            },
          },
        });

        if (!restaurantFavorite) {
          return reply.status(StatusCodes.NOT_FOUND).send({
            message: "Restaurant favorite not found",
          });
        }

        return reply.status(StatusCodes.OK).send(restaurantFavorite);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error find restaurant favorite", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error find restaurant favorite" });
      }
    }
  );
}
