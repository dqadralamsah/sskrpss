/*
  Warnings:

  - You are about to drop the column `orderDate` on the `purchaseorder` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `purchaseorder` DROP COLUMN `orderDate`,
    ADD COLUMN `estimatedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `purchaseorderitem` ADD COLUMN `receivedById` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_receivedById_fkey` FOREIGN KEY (`receivedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
