import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";

export async function listProducts(app: FastifyInstance) {
  app.get("/product", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
      });

      return reply.status(StatusCodes.OK).send(products);
    } catch (error) {
      console.error("Error listing products:", error);
      return reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Error listing products" });
    }
  });
}
