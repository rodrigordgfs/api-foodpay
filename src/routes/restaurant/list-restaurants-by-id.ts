import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface ListRestaurantByIdRequestParams {
  id: string;
}

const listRestaurantByIdRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function listRestaurantById(app: FastifyInstance) {
  app.get(
    "/restaurant/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = listRestaurantByIdRequestParamsSchema.parse(
          request.params
        ) as ListRestaurantByIdRequestParams;

        const restaurants = await prisma.restaurant.findUnique({
          where: {
            id,
          },
        });

        if (!restaurants) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Restaurant not found" });
        }

        return reply.status(StatusCodes.OK).send(restaurants);
      } catch (error) {
        console.error("Error listing restaurant:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error listing restaurant" });
      }
    }
  );
}
