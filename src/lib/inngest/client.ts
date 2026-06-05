import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "servin-tech",
  eventKey: process.env.INNGEST_EVENT_KEY,
});

export type LeadCreatedEvent = {
  name: "lead/created";
  data: {
    leadId: string;
    organizationId: string;
  };
};

export type EstimateSentEvent = {
  name: "lead/estimate-sent";
  data: {
    leadId: string;
    organizationId: string;
  };
};

export type FollowUpCanceledEvent = {
  name: "lead/follow-up-canceled";
  data: {
    leadId: string;
  };
};

export type Events = LeadCreatedEvent | EstimateSentEvent | FollowUpCanceledEvent;
