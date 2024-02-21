import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";

interface ListProductByIdRequestParams {
  id: string;
}

const listProductByIdRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

export async function listProductById(app: FastifyInstance) {
  app.get(
    "/product/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = listProductByIdRequestParamsSchema.parse(
          request.params
        ) as ListProductByIdRequestParams;

        const product = await prisma.product.findUnique({
          where: {
            id,
          },
          include: {
            category: true,
          },
        });

        if (!product) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Product not found" });
        }

        return reply.status(StatusCodes.OK).send(product);
      } catch (error) {
        console.error("Error listing product:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error listing product" });
      }
    }
  );
}
