-- CreateTable
CREATE TABLE "productFavorites" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "productFavorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productFavorites_productId_userId_key" ON "productFavorites"("productId", "userId");

-- AddForeignKey
ALTER TABLE "productFavorites" ADD CONSTRAINT "productFavorites_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
