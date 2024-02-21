import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";

export async function listCategories(app: FastifyInstance) {
  app.get(
    "/categorie",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const categories = await prisma.categorie.findMany({
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        return reply.status(StatusCodes.OK).send(categories);
      } catch (error) {
        console.error("Error listing restaurants:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error listing restaurants" });
      }
    }
  );
}
