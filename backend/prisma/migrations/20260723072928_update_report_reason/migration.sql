/*
  Warnings:

  - You are about to alter the column `reason` on the `Report` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(5))`.

*/
-- AlterTable
ALTER TABLE `Report` ADD COLUMN `content` VARCHAR(500) NULL,
    MODIFY `reason` ENUM('FRAUD', 'SPAM', 'ABUSE', 'ILLEGAL', 'COPYRIGHT', 'ETC') NOT NULL;
