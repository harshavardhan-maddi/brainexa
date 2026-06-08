import { supabase } from "./supabase";

/**
 * Retrieve persisted Brainexa data for a given user from Supabase Storage.
 * Returns the parsed JSON object or null if not found / error.
 */
export async function getBrainexaData(userId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.storage
      .from("brainexa-data")
      .download(`${userId}/data.json`);
    if (error) {
      console.warn("Supabase download error", error);
      return null;
    }
    const text = await data?.text();
    return text ? JSON.parse(text) : null;
  } catch (e) {
    console.error("Failed to get Brainexa data", e);
    return null;
  }
}

/**
 * Persist Brainexa data for a given user to Supabase Storage.
 * Overwrites any existing file (upsert).
 */
export async function setBrainexaData(userId: string, payload: any): Promise<void> {
  try {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const { error } = await supabase.storage
      .from("brainexa-data")
      .upload(`${userId}/data.json`, blob, { upsert: true });
    if (error) {
      console.error("Supabase upload error", error);
    }
  } catch (e) {
    console.error("Failed to set Brainexa data", e);
  }
}
