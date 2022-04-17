/*
  Warnings:

  - You are about to drop the column `errorString` on the `AutomationFormField` table. All the data in the column will be lost.
  - You are about to drop the column `props` on the `AutomationFormField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AutomationFormField" DROP COLUMN "errorString",
DROP COLUMN "props";

-- CreateTable
CREATE TABLE "AutomationFormFieldValue" (
    "id" TEXT NOT NULL,
    "errorString" TEXT,
    "props" JSONB NOT NULL,

    CONSTRAINT "AutomationFormFieldValue_pkey" PRIMARY KEY ("id")
);
