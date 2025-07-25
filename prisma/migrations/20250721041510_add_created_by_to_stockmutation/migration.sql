/*
  Warnings:

  - Added the required column `createdById` to the `StockMutation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stockmutation` ADD COLUMN `createdById` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `StockMutation` ADD CONSTRAINT `StockMutation_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
