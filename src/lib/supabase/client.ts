import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function uploadLeadPhoto(
  orgId: string,
  leadId: string,
  file: Buffer,
  filename: string
): Promise<string> {
  const path = `leads/${orgId}/${leadId}/${filename}`;
  const { error } = await supabase.storage
    .from("lead-photos")
    .upload(path, file, { contentType: "image/jpeg", upsert: true });

  if (error) throw new Error(`Photo upload failed: ${error.message}`);

  const { data } = supabase.storage.from("lead-photos").getPublicUrl(path);
  return data.publicUrl;
}
