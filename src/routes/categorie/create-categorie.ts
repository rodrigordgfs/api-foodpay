import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface CreateCategorieRequestBody {
  name: string;
  restaurantId: string;
}

const createCategorieRequestBodySchema = z.object({
  name: z.string(),
  restaurantId: z.string().uuid(),
});

export async function createCategorie(app: FastifyInstance) {
  app.post(
    "/categorie",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { name, restaurantId } =
          createCategorieRequestBodySchema.parse(
            request.body
          ) as CreateCategorieRequestBody;

        const categorie = await prisma.categorie.create({
          data: {
            name,
            restaurantId,
          },
        });

        return reply.status(StatusCodes.CREATED).send(categorie);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error creating categorie:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error creating categorie" });
      }
    }
  );
}
