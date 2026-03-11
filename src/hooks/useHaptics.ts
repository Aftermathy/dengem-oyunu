import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// Check if Capacitor Haptics is available (native only)
let hapticsAvailable: boolean | null = null;

async function checkHaptics(): Promise<boolean> {
  if (hapticsAvailable !== null) return hapticsAvailable;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
    hapticsAvailable = true;
  } catch {
    hapticsAvailable = false;
  }
  return hapticsAvailable;
}

/** Light tap — swipe cards */
export async function hapticLight() {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch { /* web fallback: no-op */ }
}

/** Medium tap — button presses, bribe */
export async function hapticMedium() {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch { /* web fallback: no-op */ }
}

/** Heavy tap — game start, important actions */
export async function hapticHeavy() {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch { /* web fallback: no-op */ }
}

/** Double sharp vibration — warnings, elections */
export async function hapticWarning() {
  try {
    await Haptics.notification({ type: NotificationType.Warning });
  } catch { /* web fallback: no-op */ }
}

/** Success vibration */
export async function hapticSuccess() {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch { /* web fallback: no-op */ }
}

/** Error vibration — game over */
export async function hapticError() {
  try {
    await Haptics.notification({ type: NotificationType.Error });
  } catch { /* web fallback: no-op */ }
}

/** War drums start — heavy + delay + heavy */
export async function hapticWarStart() {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await new Promise(r => setTimeout(r, 120));
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await new Promise(r => setTimeout(r, 120));
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch { /* web fallback: no-op */ }
}

/** Double sharp — pre-election, critical alerts */
export async function hapticDoubleSharp() {
  try {
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await new Promise(r => setTimeout(r, 100));
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch { /* web fallback: no-op */ }
}
