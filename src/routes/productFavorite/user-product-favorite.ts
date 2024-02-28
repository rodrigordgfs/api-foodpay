import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const productFavoriteRequestParamsSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
});

interface productFavoriteRequestParams {
  productId: string;
  userId: string;
}

async function findProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function findFavoriteProduct(app: FastifyInstance) {
  app.get(
    "/product/:productId/favorite/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { productId, userId } = productFavoriteRequestParamsSchema.parse(
          request.params
        ) as productFavoriteRequestParams;

        const existProduct = await findProductById(productId);

        if (!existProduct) {
          return reply.status(StatusCodes.NOT_FOUND).send({
            message: "Product not found",
          });
        }

        const productFavorite = await prisma.productFavorite.findUnique({
          where: {
            productId_userId: {
              userId,
              productId,
            },
          },
        });

        if (!productFavorite) {
          return reply.status(StatusCodes.OK).send({
            message: "Product favorite not found",
          });
        }

        return reply.status(StatusCodes.OK).send(productFavorite);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error find product favorite", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error find product favorite" });
      }
    }
  );
}
