import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  time: number;
  highlight: boolean;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HighlightProductRequestBody {
  highlight: boolean;
}

interface HighlightProductRequestParams {
  id: string;
}

const highlightProductRequestBodySchema = z.object({
  highlight: z.boolean(),
});

const highlightProductRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

async function findProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function highlightProduct(app: FastifyInstance) {
  app.patch(
    "/product/:id/highlight",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { highlight } = highlightProductRequestBodySchema.parse(
          request.body
        ) as HighlightProductRequestBody;

        const { id } = highlightProductRequestParamsSchema.parse(
          request.params
        ) as HighlightProductRequestParams;

        const existProduct = await findProductById(id);

        if (!existProduct) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Product not found" });
        }

        const product = await prisma.product.update({
          data: {
            highlight,
          },
          where: {
            id,
          },
        });

        return reply.status(StatusCodes.OK).send(product);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error update product:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error update product" });
      }
    }
  );
}
