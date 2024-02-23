import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";

interface ListRestaurantsRequestQuery {
  limit?: number;
}

const listRestaurantsRequestQuerySchema = z.object({
  limit: z.string().optional(),
});

export async function listRestaurants(app: FastifyInstance) {
  app.get(
    "/restaurant",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { limit } = listRestaurantsRequestQuerySchema.parse(
          request.query
        ) as ListRestaurantsRequestQuery;

        const restaurants = await prisma.restaurant.findMany({
          include: {
            rates: {
              select: {
                rate: true,
                userId: true,
              },
            },
            categories: {
              include: {
                products: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
          take: Number(limit) || undefined,
        });

        return reply.status(StatusCodes.OK).send(restaurants);
      } catch (error) {
        console.error("Error listing restaurants:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error listing restaurants" });
      }
    }
  );
}
