import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../../lib/prisma";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

interface Restaurant {
  id: string;
  name: string;
  image: string;
  latitude: number;
  longitude: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UpdateRestaurantRequestBody {
  name?: string;
  image?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
}

const updateRestaurantRequestBodySchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
});

interface UpdateRestaurantRequestParams {
  id: string;
}

const updateRestaurantRequestParamsSchema = z.object({
  id: z.string().uuid(),
});

async function findRestaurantById(id: string): Promise<Restaurant | null> {
  return prisma.restaurant.findUnique({ where: { id } });
}

export async function updateRestaurant(app: FastifyInstance) {
  app.patch(
    "/restaurant/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { name, image, latitude, longitude, description } =
          updateRestaurantRequestBodySchema.parse(
            request.body
          ) as UpdateRestaurantRequestBody;

        const { id } = updateRestaurantRequestParamsSchema.parse(
          request.params
        ) as UpdateRestaurantRequestParams;

        const existRestaurant = await findRestaurantById(id);

        if (!existRestaurant) {
          return reply
            .status(StatusCodes.NOT_FOUND)
            .send({ message: "Restaurant not found" });
        }

        const restaurant = await prisma.restaurant.update({
          data: {
            name: name || undefined,
            image: image || undefined,
            latitude: latitude || undefined,
            longitude: longitude || undefined,
            description: description || undefined,
          },
          where: {
            id,
          },
        });

        return reply.status(StatusCodes.OK).send(restaurant);
      } catch (error) {
        if (error instanceof ZodError) {
          const errorMessage = error.errors.map((err) => err.message);
          return reply
            .status(StatusCodes.BAD_REQUEST)
            .send({ message: "Validation error", errors: errorMessage });
        }
        console.error("Error update restaurant:", error);
        return reply
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Error update restaurant" });
      }
    }
  );
}
