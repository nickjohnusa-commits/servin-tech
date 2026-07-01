-- AddIndex: composite indexes for common lead query patterns
CREATE INDEX "leads_organizationId_testLead_idx" ON "leads"("organizationId", "testLead");
CREATE INDEX "leads_organizationId_callerPhone_idx" ON "leads"("organizationId", "callerPhone");
CREATE INDEX "leads_organizationId_status_createdAt_idx" ON "leads"("organizationId", "status", "createdAt");
