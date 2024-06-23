/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Company] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000),
    [subscriptionType] NVARCHAR(1000) NOT NULL,
    [subscriptionPrice] FLOAT(53) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [stripeCustomerId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Company_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Company_email_key] UNIQUE NONCLUSTERED ([email]),
    CONSTRAINT [Company_stripeCustomerId_key] UNIQUE NONCLUSTERED ([stripeCustomerId])
);

-- CreateTable
CREATE TABLE [dbo].[Addon] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [companyId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Addon_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- RedefineTables
BEGIN TRANSACTION;
ALTER TABLE [dbo].[User] DROP CONSTRAINT [User_email_key];
DECLARE @SQL NVARCHAR(MAX) = N''
SELECT @SQL += N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(PARENT_OBJECT_ID))
    + '.'
    + QUOTENAME(OBJECT_NAME(PARENT_OBJECT_ID))
    + ' DROP CONSTRAINT '
    + OBJECT_NAME(OBJECT_ID) + ';'
FROM SYS.OBJECTS
WHERE TYPE_DESC LIKE '%CONSTRAINT'
    AND OBJECT_NAME(PARENT_OBJECT_ID) = 'User'
    AND SCHEMA_NAME(SCHEMA_ID) = 'dbo'
EXEC sp_executesql @SQL
;
CREATE TABLE [dbo].[_prisma_new_User] (
    [id] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [companyId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);
IF EXISTS(SELECT * FROM [dbo].[User])
    EXEC('INSERT INTO [dbo].[_prisma_new_User] ([email],[id]) SELECT [email],[id] FROM [dbo].[User] WITH (holdlock tablockx)');
DROP TABLE [dbo].[User];
EXEC SP_RENAME N'dbo._prisma_new_User', N'User';
COMMIT;

-- AddForeignKey
ALTER TABLE [dbo].[Addon] ADD CONSTRAINT [Addon_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
