import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { StatusCodes } from "http-status-codes";
import { z, ZodError } from "zod";
interface ListProductsRequestQuery {
  highlight?: boolean;
  limit?: number;
}

const listProductRequestQuerySchema = z.object({
  highlight: z.string().optional(),
  limit: z.string().optional(),
});

export async function listProducts(app: FastifyInstance) {
  app.get("/product", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { highlight, limit } = listProductRequestQuerySchema.parse(
        request.query
      ) as ListProductsRequestQuery;

      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
        where: {
          highlight: Boolean(highlight) || undefined,
        },
        take: Number(limit) || undefined,
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
