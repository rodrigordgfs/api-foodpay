import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface Categorie {
  id: string;
  name: string;
  image: string;
  restaurantId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateCategorieRequestBody {
  name?: string;
  image?: string;
}

const updateCategorierequestBodySchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
});

interface UpdateCategorieRequestParams {
  id: string;
}

const updateCategorieRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

async function findCategorieById(id: string): Promise<Categorie | null> {
  return prisma.categorie.findUnique({ where: { id } });
}

export async function updateCategorie(app: FastifyInstance) {
  app.patch(
    "/categorie/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { name, image } = updateCategorierequestBodySchema.parse(
          request.body
        ) as UpdateCategorieRequestBody;

        const { id } = updateCategorieRequestParamsSchema.parse(
          request.params
        ) as UpdateCategorieRequestParams;

        const existCategorie = await findCategorieById(id);

        if (!existCategorie) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Categorie not found" });
        }

        const categorie = await prisma.categorie.update({
          data: {
            name: name || undefined,
            image: image || undefined,
          },
          where: {
            id,
          },
        });

        return reply.status(StatusCodes.OK).send(categorie);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error update categorie:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error update categorie" });
      }
    }
  );
}
