import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface Categorie {
  id: string;
  name: string;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DeleteCategorieByIdRequestParams {
  id: string;
}

const deleteCategorieByIdRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

async function findCategorieById(id: string): Promise<Categorie | null> {
  return prisma.categorie.findUnique({ where: { id } });
}

export async function deleteCategorieById(app: FastifyInstance) {
  app.delete(
    "/categorie/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = deleteCategorieByIdRequestParamsSchema.parse(
          request.params
        ) as DeleteCategorieByIdRequestParams;

        const existCategorie = await findCategorieById(id);

        if (!existCategorie) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Categorie not found" });
        }

        await prisma.categorie.delete({
          where: {
            id,
          },
        });

        return reply
          .status(StatusCodes.OK)
          .send({ message: "Categorie deleted" });
      } catch (error) {
        console.error("Error delete categorie:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error delete categorie" });
      }
    }
  );
}
