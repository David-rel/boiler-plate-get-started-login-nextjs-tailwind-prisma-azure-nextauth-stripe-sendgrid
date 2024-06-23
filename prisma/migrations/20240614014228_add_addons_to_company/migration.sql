/*
  Warnings:

  - You are about to drop the `Addon` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Addon] DROP CONSTRAINT [Addon_companyId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Company] ADD [advancedBookingPackage] BIT NOT NULL CONSTRAINT [Company_advancedBookingPackage_df] DEFAULT 0,
[advancedCrmPackage] BIT NOT NULL CONSTRAINT [Company_advancedCrmPackage_df] DEFAULT 0,
[advancedEcommerceAnalytics] BIT NOT NULL CONSTRAINT [Company_advancedEcommerceAnalytics_df] DEFAULT 0,
[advancedEcommerceBuilder] BIT NOT NULL CONSTRAINT [Company_advancedEcommerceBuilder_df] DEFAULT 0,
[advancedFinancialManagement] BIT NOT NULL CONSTRAINT [Company_advancedFinancialManagement_df] DEFAULT 0,
[advancedFormsAndSurveysPackage] BIT NOT NULL CONSTRAINT [Company_advancedFormsAndSurveysPackage_df] DEFAULT 0,
[advancedInventoryManagement] BIT NOT NULL CONSTRAINT [Company_advancedInventoryManagement_df] DEFAULT 0,
[aiAnalyticsAssistant] BIT NOT NULL CONSTRAINT [Company_aiAnalyticsAssistant_df] DEFAULT 0,
[aiBlogAndResearchAssistant] BIT NOT NULL CONSTRAINT [Company_aiBlogAndResearchAssistant_df] DEFAULT 0,
[aiBookingAssistant] BIT NOT NULL CONSTRAINT [Company_aiBookingAssistant_df] DEFAULT 0,
[aiCrmAssistant] BIT NOT NULL CONSTRAINT [Company_aiCrmAssistant_df] DEFAULT 0,
[aiEmailMarketingAutomation] BIT NOT NULL CONSTRAINT [Company_aiEmailMarketingAutomation_df] DEFAULT 0,
[aiFinancialManagementAssistant] BIT NOT NULL CONSTRAINT [Company_aiFinancialManagementAssistant_df] DEFAULT 0,
[aiFormsAndSurveysAssistant] BIT NOT NULL CONSTRAINT [Company_aiFormsAndSurveysAssistant_df] DEFAULT 0,
[aiInventoryManagementAssistant] BIT NOT NULL CONSTRAINT [Company_aiInventoryManagementAssistant_df] DEFAULT 0,
[aiOnlineStoreAssistant] BIT NOT NULL CONSTRAINT [Company_aiOnlineStoreAssistant_df] DEFAULT 0,
[aiProjectAndTeamManagementAssistant] BIT NOT NULL CONSTRAINT [Company_aiProjectAndTeamManagementAssistant_df] DEFAULT 0,
[aiSalesFunnelAssistant] BIT NOT NULL CONSTRAINT [Company_aiSalesFunnelAssistant_df] DEFAULT 0,
[aiSocialMediaAutomation] BIT NOT NULL CONSTRAINT [Company_aiSocialMediaAutomation_df] DEFAULT 0,
[aiSupportAndHelpDeskAssistant] BIT NOT NULL CONSTRAINT [Company_aiSupportAndHelpDeskAssistant_df] DEFAULT 0,
[aiWebsiteAssistant] BIT NOT NULL CONSTRAINT [Company_aiWebsiteAssistant_df] DEFAULT 0,
[allServiceAnalyticsIntegration] BIT NOT NULL CONSTRAINT [Company_allServiceAnalyticsIntegration_df] DEFAULT 0,
[autoFinanceImporting] BIT NOT NULL CONSTRAINT [Company_autoFinanceImporting_df] DEFAULT 0,
[autoInventoryImporting] BIT NOT NULL CONSTRAINT [Company_autoInventoryImporting_df] DEFAULT 0,
[basicCrmPackage] BIT NOT NULL CONSTRAINT [Company_basicCrmPackage_df] DEFAULT 0,
[blogTemplates] BIT NOT NULL CONSTRAINT [Company_blogTemplates_df] DEFAULT 0,
[crmAndEmailingAnalyticsIntegration] BIT NOT NULL CONSTRAINT [Company_crmAndEmailingAnalyticsIntegration_df] DEFAULT 0,
[emailCrmMarketingCampaignConnection] BIT NOT NULL CONSTRAINT [Company_emailCrmMarketingCampaignConnection_df] DEFAULT 0,
[emailMarketingTemplates] BIT NOT NULL CONSTRAINT [Company_emailMarketingTemplates_df] DEFAULT 0,
[newsletterTemplates] BIT NOT NULL CONSTRAINT [Company_newsletterTemplates_df] DEFAULT 0,
[prioritySupportAndHelpDesk] BIT NOT NULL CONSTRAINT [Company_prioritySupportAndHelpDesk_df] DEFAULT 0,
[projectManagementConnection] BIT NOT NULL CONSTRAINT [Company_projectManagementConnection_df] DEFAULT 0,
[schedulingAndCalendarIntegration] BIT NOT NULL CONSTRAINT [Company_schedulingAndCalendarIntegration_df] DEFAULT 0,
[setupSupport] BIT NOT NULL CONSTRAINT [Company_setupSupport_df] DEFAULT 0,
[socialMediaContentCreation] BIT NOT NULL CONSTRAINT [Company_socialMediaContentCreation_df] DEFAULT 0;

-- DropTable
DROP TABLE [dbo].[Addon];

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
