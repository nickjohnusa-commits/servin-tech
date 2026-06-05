import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { notifyOwner } from "@/lib/inngest/functions/notify-owner";
import { followUpSequence } from "@/lib/inngest/functions/follow-up-sequence";
import { monthlyReport } from "@/lib/inngest/functions/monthly-report";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [notifyOwner, followUpSequence, monthlyReport],
});
