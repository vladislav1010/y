/*
  Warnings:

  - You are about to drop the column `Operator` on the `FilterCondition` table. All the data in the column will be lost.
  - Added the required column `operator` to the `FilterCondition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FilterCondition" DROP COLUMN "Operator",
ADD COLUMN     "operator" TEXT NOT NULL;
