import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface restaurantFavoriteRequestParams {
  userId: string;
}

const restaurantFavoriteRequestparamsSchema = z.object({
  userId: z.string().uuid(),
});

export async function listFavoritesRestaurant(app: FastifyInstance) {
  app.get(
    "/restaurant/user/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { userId } = restaurantFavoriteRequestparamsSchema.parse(
          request.params
        ) as restaurantFavoriteRequestParams;

        const favorites = await prisma.restaurantFavorite.findMany({
          where: {
            userId,
          },
          select: {
            restaurant: true,
          }
        });

        return reply.status(StatusCodes.OK).send(favorites);
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
