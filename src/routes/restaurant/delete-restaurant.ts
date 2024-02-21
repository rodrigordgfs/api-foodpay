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

interface DeleteRestaurantByIdRequestParams {
  id: string;
}

const deleteRestaurantByIdRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

async function findRestaurantById(id: string): Promise<Restaurant | null> {
  return prisma.restaurant.findUnique({ where: { id } });
}

export async function deleteRestaurantById(app: FastifyInstance) {
  app.delete(
    "/restaurant/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = deleteRestaurantByIdRequestParamsSchema.parse(
          request.params
        ) as DeleteRestaurantByIdRequestParams;

        const existRestaurant = await findRestaurantById(id);

        if (!existRestaurant) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Restaurant not found" });
        }

        await prisma.restaurant.delete({
          where: {
            id,
          },
        });

        return reply.status(StatusCodes.OK).send({ message: "Restaurant deleted" });
      } catch (error) {
        console.error("Error delete restaurant:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error delete restaurant" });
      }
    }
  );
}
