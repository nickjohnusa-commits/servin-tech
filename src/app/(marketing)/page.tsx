// This file must have a default export to satisfy Next.js 16's type validator.
// The actual "/" route is served by app/page.tsx — this file is never reached.
import { notFound } from "next/navigation";

export default function MarketingRootPage() {
  notFound();
}
