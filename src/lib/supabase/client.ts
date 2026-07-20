import { environment } from "@/environments/environment";
import { createBrowserClient } from "@supabase/ssr";

export default function createClient() {
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = environment;
  return createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
}
