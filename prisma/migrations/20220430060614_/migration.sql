/*
  Warnings:

  - A unique constraint covering the columns `[viewId]` on the table `Filter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Filter_viewId_key" ON "Filter"("viewId");
