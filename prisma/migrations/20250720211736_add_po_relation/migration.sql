-- AlterTable
ALTER TABLE `stockmutation` ADD COLUMN `sourceId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `StockMutation` ADD CONSTRAINT `StockMutation_sourceId_fkey` FOREIGN KEY (`sourceId`) REFERENCES `PurchaseOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
