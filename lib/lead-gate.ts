const STORAGE_KEY = "vls_datasheet_unlocked";

/** Site-wide, not per-product: once a visitor has given their details for any
 *  datasheet, don't ask again for the rest of the browser session/device. */
export function isDatasheetUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function unlockDatasheet(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, "true");
  } catch {
    // localStorage unavailable (private mode, storage disabled) — the gate just re-prompts next time.
  }
}
