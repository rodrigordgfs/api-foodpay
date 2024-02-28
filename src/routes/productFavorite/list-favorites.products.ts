import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface productFavoriteRequestParams {
  userId: string;
}

const productFavoriteRequestparamsSchema = z.object({
  userId: z.string().uuid(),
});

export async function listFavoritesProduct(app: FastifyInstance) {
  app.get(
    "/product/user/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { userId } = productFavoriteRequestparamsSchema.parse(
          request.params
        ) as productFavoriteRequestParams;

        const favorites = await prisma.productFavorite.findMany({
          where: {
            userId,
          },
          select: {
            product: true,
          },
        });

        return reply.status(StatusCodes.OK).send(favorites);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error find product favorite", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error find product favorite" });
      }
    }
  );
}
