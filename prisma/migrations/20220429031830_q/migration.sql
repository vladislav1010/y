/*
  Warnings:

  - Added the required column `authorId` to the `Automation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseId` to the `Automation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Automation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Automation" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "baseId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "BasePermissions" (
    "userId" TEXT NOT NULL,
    "baseId" TEXT NOT NULL,

    CONSTRAINT "BasePermissions_pkey" PRIMARY KEY ("userId","baseId")
);

-- CreateTable
CREATE TABLE "Base" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationTriggerType" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "AutomationTriggerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationFormField" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "label" TEXT NOT NULL,
    "accessibilityDescription" TEXT,
    "required" BOOLEAN,
    "errorString" TEXT,
    "error" JSONB,
    "props" JSONB NOT NULL,
    "type" TEXT NOT NULL,
    "triggerTypeId" TEXT NOT NULL,

    CONSTRAINT "AutomationFormField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationTriggerTest" (
    "id" SERIAL NOT NULL,
    "triggerId" TEXT NOT NULL,
    "input" JSONB NOT NULL,
    "output" JSONB,
    "error" JSONB,
    "isSuccess" BOOLEAN NOT NULL,

    CONSTRAINT "AutomationTriggerTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationTrigger" (
    "id" TEXT NOT NULL,
    "typeId" TEXT NOT NULL,
    "externalError" JSONB,
    "automationId" TEXT NOT NULL,

    CONSTRAINT "AutomationTrigger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutomationTriggerTest_triggerId_key" ON "AutomationTriggerTest"("triggerId");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationTrigger_automationId_key" ON "AutomationTrigger"("automationId");

-- AddForeignKey
ALTER TABLE "BasePermissions" ADD CONSTRAINT "BasePermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BasePermissions" ADD CONSTRAINT "BasePermissions_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "Base"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Automation" ADD CONSTRAINT "Automation_baseId_fkey" FOREIGN KEY ("baseId") REFERENCES "Base"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationFormField" ADD CONSTRAINT "AutomationFormField_triggerTypeId_fkey" FOREIGN KEY ("triggerTypeId") REFERENCES "AutomationTriggerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationTriggerTest" ADD CONSTRAINT "AutomationTriggerTest_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AutomationTrigger"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationTrigger" ADD CONSTRAINT "AutomationTrigger_automationId_fkey" FOREIGN KEY ("automationId") REFERENCES "Automation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutomationTrigger" ADD CONSTRAINT "AutomationTrigger_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "AutomationTriggerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
