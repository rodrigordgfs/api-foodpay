import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";

export async function listRestaurants(app: FastifyInstance) {
  app.get(
    "/restaurant",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
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
          }
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
