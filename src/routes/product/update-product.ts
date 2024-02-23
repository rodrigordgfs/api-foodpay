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

interface UpdateProductRequestBody {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  time?: number;
  highlight?: boolean;
}

const updateProductRequestBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  price: z.number().optional(),
  time: z.number().optional(),
  highlight: z.boolean().optional(),
});

interface updateProductRequestBodySchema {
  id: string;
}

const updateProductRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

async function findProductById(id: string): Promise<Product | null> {
  return prisma.product.findUnique({ where: { id } });
}

export async function updateProduct(app: FastifyInstance) {
  app.patch(
    "/product/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { name, image, description, price, time, highlight } =
          updateProductRequestBodySchema.parse(
            request.body
          ) as UpdateProductRequestBody;

        const { id } = updateProductRequestParamsSchema.parse(
          request.params
        ) as updateProductRequestBodySchema;

        const existProduct = await findProductById(id);

        if (!existProduct) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Product not found" });
        }

        const product = await prisma.product.update({
          data: {
            name: name || undefined,
            image: image || undefined,
            description: description || undefined,
            price: price || undefined,
            time: time || undefined,
            highlight: highlight || undefined,
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
