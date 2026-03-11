// Dynamic import to avoid build errors when @capacitor/haptics isn't resolvable
let Haptics: any = null;
let ImpactStyle: any = null;
let NotificationType: any = null;

const loadHaptics = (async () => {
  try {
    const mod = await import('@capacitor/haptics');
    Haptics = mod.Haptics;
    ImpactStyle = mod.ImpactStyle;
    NotificationType = mod.NotificationType;
  } catch {
    // Not available (web build without Capacitor)
  }
})();

/** Light tap — swipe cards */
export async function hapticLight() {
  try {
    await loadHaptics;
    if (Haptics) await Haptics.impact({ style: ImpactStyle.Light });
  } catch { /* no-op */ }
}

/** Medium tap — button presses, bribe */
export async function hapticMedium() {
  try {
    await loadHaptics;
    if (Haptics) await Haptics.impact({ style: ImpactStyle.Medium });
  } catch { /* no-op */ }
}

/** Heavy tap — game start, important actions */
export async function hapticHeavy() {
  try {
    await loadHaptics;
    if (Haptics) await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch { /* no-op */ }
}

/** Double sharp vibration — warnings, elections */
export async function hapticWarning() {
  try {
    await loadHaptics;
    if (Haptics) await Haptics.notification({ type: NotificationType.Warning });
  } catch { /* no-op */ }
}

/** Success vibration */
export async function hapticSuccess() {
  try {
    await loadHaptics;
    if (Haptics) await Haptics.notification({ type: NotificationType.Success });
  } catch { /* no-op */ }
}

/** Error vibration — game over */
export async function hapticError() {
  try {
    await loadHaptics;
    if (Haptics) await Haptics.notification({ type: NotificationType.Error });
  } catch { /* no-op */ }
}

/** War drums start — heavy + delay + heavy */
export async function hapticWarStart() {
  try {
    await loadHaptics;
    if (!Haptics) return;
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await new Promise(r => setTimeout(r, 120));
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await new Promise(r => setTimeout(r, 120));
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch { /* no-op */ }
}

/** Double sharp — pre-election, critical alerts */
export async function hapticDoubleSharp() {
  try {
    await loadHaptics;
    if (!Haptics) return;
    await Haptics.impact({ style: ImpactStyle.Heavy });
    await new Promise(r => setTimeout(r, 100));
    await Haptics.impact({ style: ImpactStyle.Heavy });
  } catch { /* no-op */ }
}
