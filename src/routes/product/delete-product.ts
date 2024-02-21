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
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DeleteProductByIdRequestParams {
  id: string;
}

const deleteProductByIdRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

async function findProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function deleteProductById(app: FastifyInstance) {
  app.delete(
    "/product/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = deleteProductByIdRequestParamsSchema.parse(
          request.params
        ) as DeleteProductByIdRequestParams;

        const existProduct = await findProductById(id);

        if (!existProduct) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Product not found" });
        }

        await prisma.product.delete({
          where: {
            id,
          },
        });

        return reply
          .status(StatusCodes.OK)
          .send({ message: "Product deleted" });
      } catch (error) {
        console.error("Error delete product:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error delete product" });
      }
    }
  );
}
