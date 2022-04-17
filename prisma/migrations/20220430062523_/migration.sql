/*
  Warnings:

  - A unique constraint covering the columns `[filterId]` on the table `View` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filterId` to the `View` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Filter" DROP CONSTRAINT "Filter_viewId_fkey";

-- DropIndex
DROP INDEX "Filter_viewId_key";

-- AlterTable
ALTER TABLE "View" ADD COLUMN     "filterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "View_filterId_key" ON "View"("filterId");

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "Filter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
