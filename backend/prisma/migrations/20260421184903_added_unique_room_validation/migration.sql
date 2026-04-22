/*
  Warnings:

  - A unique constraint covering the columns `[propertyId,roomNumber]` on the table `Room` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Room_propertyId_roomNumber_key" ON "Room"("propertyId", "roomNumber");
