export type UserRole = "OWNER" | "DISPATCHER";
export type Language = "EN" | "ES" | "AUTO";
export type Channel = "VOICE" | "SMS";
export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "ESTIMATE_SCHEDULED"
  | "ESTIMATE_SENT"
  | "WON"
  | "LOST";
export type SubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "PAUSED";
export type SubscriptionTier = "STARTER" | "PROFESSIONAL" | "AGENCY";
export type NotifType = "SMS" | "EMAIL";
export type FollowUpStatus = "PENDING" | "SENT" | "FAILED" | "CANCELED";

export type Organization = {
  id: string;
  clerkOrgId: string;
  name: string;
  slug: string;
  businessName: string;
  timezone: string;
  twilioPhoneNumber: string | null;
  defaultLanguage: Language;
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: SubscriptionTier;
  notificationEmails: string[];
  notificationPhones: string[];
  aiGreetingEn: string | null;
  aiGreetingEs: string | null;
  followUpEnabled: boolean;
  followUpDays: number[];
  testMode: boolean;
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  clerkUserId: string;
  organizationId: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string | null;
};

export type Lead = {
  id: string;
  organizationId: string;
  callerPhone: string;
  callerName: string | null;
  channel: Channel;
  languageDetected: Language;
  jobType: string | null;
  urgency: number | null;
  address: string | null;
  budgetRange: string | null;
  preferredAppointment: string | null;
  status: LeadStatus;
  aiSummary: string | null;
  photoUrls: string[];
  notes: string | null;
  testLead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TranscriptMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  leadId: string;
  organizationId: string;
  channel: Channel;
  transcript: TranscriptMessage[];
  durationSecs: number | null;
  callSid: string | null;
  createdAt: Date;
};

export type FollowUp = {
  id: string;
  leadId: string;
  organizationId: string;
  type: NotifType;
  message: string;
  status: FollowUpStatus;
  scheduledAt: Date;
  sentAt: Date | null;
  error: string | null;
  createdAt: Date;
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New Lead",
  CONTACTED: "Contacted",
  ESTIMATE_SCHEDULED: "Estimate Scheduled",
  ESTIMATE_SENT: "Estimate Sent",
  WON: "Won",
  LOST: "Lost",
};

export const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "#3b82f6",
  CONTACTED: "#8b5cf6",
  ESTIMATE_SCHEDULED: "#f59e0b",
  ESTIMATE_SENT: "#f97316",
  WON: "#10b981",
  LOST: "#94a3b8",
};
