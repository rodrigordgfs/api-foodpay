-- CreateTable
CREATE TABLE "restaurantFavorites" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "restaurantFavorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "restaurantFavorites" ADD CONSTRAINT "restaurantFavorites_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
