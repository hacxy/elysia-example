/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `elysia_user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `elysia_user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `elysia_user` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `elysia_user_email_key` ON `elysia_user`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `elysia_user_phone_key` ON `elysia_user`(`phone`);
