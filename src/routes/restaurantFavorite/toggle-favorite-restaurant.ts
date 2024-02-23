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

interface RestaurantFavorite {
  id: string;
  userId: string;
  restaurantId: string;
}

interface restaurantFavoriteRequestBody {
  userId: string;
}

interface restaurantFavoriteRequestParams {
  restaurantId: string;
}

const restaurantFavoriteRequestBodySchema = z.object({
  userId: z.string().uuid(),
});

async function findRestaurantById(id: string): Promise<Restaurant | null> {
  return prisma.restaurant.findUnique({ where: { id } });
}

async function findRestaurantFavorite(
  userId: string,
  restaurantId: string
): Promise<RestaurantFavorite | null> {
  return prisma.restaurantFavorite.findUnique({
    where: {
      restaurantId_userId: {
        userId,
        restaurantId,
      },
    },
  });
}

export async function favoriteRestaurantRate(app: FastifyInstance) {
  app.post(
    "/restaurant/:restaurantId/favorite",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { userId } = restaurantFavoriteRequestBodySchema.parse(
          request.body
        ) as restaurantFavoriteRequestBody;

        const { restaurantId } =
          request.params as restaurantFavoriteRequestParams;

        const existingRestaurant = await findRestaurantById(restaurantId);

        if (!existingRestaurant) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Restaurant not found" });
        }

        const alreadyFavorited = await findRestaurantFavorite(
          userId,
          restaurantId
        );

        if (alreadyFavorited) {
          await prisma.restaurantFavorite.delete({
            where: {
              id: alreadyFavorited.id,
            },
          });

          return reply
            .status(StatusCodes.OK)
            .send({ message: "Restaurant removed from favorites" });
        }

        await prisma.restaurantFavorite.create({
          data: {
            userId,
            restaurantId,
          },
        });

        return reply
          .status(StatusCodes.CREATED)
          .send({ message: "Restaurant added to favorites" });
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
