import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

interface ListCategorieByIdRequestParams {
  id: string;
}

const listCategorieByIdRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function listCategorieById(app: FastifyInstance) {
  app.get(
    "/categorie/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = listCategorieByIdRequestParamsSchema.parse(
          request.params
        ) as ListCategorieByIdRequestParams;

        const categorie = await prisma.categorie.findUnique({
          where: {
            id,
          },
          include: {
            restaurant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        if (!categorie) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Categorie not found" });
        }

        return reply.status(StatusCodes.OK).send(categorie);
      } catch (error) {
        console.error("Error listing categorie:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error listing categorie" });
      }
    }
  );
}
