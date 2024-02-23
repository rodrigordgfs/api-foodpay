/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,userId]` on the table `restaurantFavorites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "restaurantFavorites_restaurantId_userId_key" ON "restaurantFavorites"("restaurantId", "userId");
