import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface CreateProductRequestBody {
  name: string;
  description: string;
  price: number;
  image: string;
  time: number;
  categoryId: string;
}

const createProductRequestBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string(),
  time: z.number(),
  categoryId: z.string().uuid(),
});

export async function createProduct(app: FastifyInstance) {
  app.post("/product", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { name, description, price, image, time, categoryId } =
        createProductRequestBodySchema.parse(
          request.body
        ) as CreateProductRequestBody;

      const product = await prisma.product.create({
        data: {
          name,
          description,
          price,
          image,
          time,
          categoryId,
        },
      });

      return reply.status(StatusCodes.CREATED).send(product);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((err) => err.message);
        return reply
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: "Validation error", errors: errorMessage });
      }
      console.error("Error creating product:", error);
      return reply
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: "Error creating product" });
    }
  });
}
