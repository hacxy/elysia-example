/*
  Warnings:

  - You are about to drop the column `role` on the `elysia_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `elysia_user` DROP COLUMN `role`;

-- CreateTable
CREATE TABLE `elysia_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `elysia_role_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `elysia_user_role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `elysia_user_role_userId_key`(`userId`),
    INDEX `elysia_user_role_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `elysia_user_role` ADD CONSTRAINT `elysia_user_role_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `elysia_user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `elysia_user_role` ADD CONSTRAINT `elysia_user_role_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `elysia_role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
