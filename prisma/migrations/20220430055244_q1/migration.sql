/*
  Warnings:

  - Added the required column `viewId` to the `Filter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Filter" ADD COLUMN     "viewId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_viewId_fkey" FOREIGN KEY ("viewId") REFERENCES "View"("id") ON DELETE CASCADE ON UPDATE CASCADE;
