/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[User] ADD [createdAt] DATETIME2 NOT NULL CONSTRAINT [User_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
[display] NVARCHAR(1000) NOT NULL CONSTRAINT [User_display_df] DEFAULT 'light',
[firstName] NVARCHAR(1000) NOT NULL,
[lastName] NVARCHAR(1000) NOT NULL,
[password] NVARCHAR(1000) NOT NULL,
[phoneNumber] NVARCHAR(1000),
[profileImage] NVARCHAR(1000),
[role] NVARCHAR(1000) NOT NULL CONSTRAINT [User_role_df] DEFAULT 'user',
[updatedAt] DATETIME2 NOT NULL,
[username] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[VerifiedDevice] (
    [id] NVARCHAR(1000) NOT NULL,
    [deviceId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [VerifiedDevice_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [VerifiedDevice_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateIndex
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_username_key] UNIQUE NONCLUSTERED ([username]);

-- AddForeignKey
ALTER TABLE [dbo].[VerifiedDevice] ADD CONSTRAINT [VerifiedDevice_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
