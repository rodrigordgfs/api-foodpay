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

interface ProductFavorite {
  id: string;
  userId: string;
  productId: string;
}

interface productFavoriteRequestParams {
  productId: string;
  userId: string;
}

const productFavoriteRequestParamsSchema = z.object({
  userId: z.string().uuid(),
  productId: z.string().uuid(),
});

async function findProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

async function findProductFavorite(
  userId: string,
  productId: string
): Promise<ProductFavorite | null> {
  return prisma.productFavorite.findUnique({
    where: {
      productId_userId: {
        userId,
        productId,
      },
    },
  });
}

export async function favoriteProduct(app: FastifyInstance) {
  app.post(
    "/product/:productId/favorite/:userId",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { productId, userId } = productFavoriteRequestParamsSchema.parse(
          request.params
        ) as productFavoriteRequestParams;

        const existProduct = await findProductById(productId);
        if (!existProduct) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Product not found" });
        }

        const alreadyFavorited = await findProductFavorite(userId, productId);

        if (alreadyFavorited) {
          await prisma.productFavorite.delete({
            where: {
              id: alreadyFavorited.id,
            },
          });
          return reply
            .status(StatusCodes.OK)
            .send({ message: "Product removed from favorites" });
        }

        await prisma.productFavorite.create({
          data: {
            userId,
            productId,
          },
        });

        return reply
          .status(StatusCodes.CREATED)
          .send({ message: "Product added to favorites" });
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error creating product favorite", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error creating product favorite" });
      }
    }
  );
}
