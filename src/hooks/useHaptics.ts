// Runtime-loaded haptics to avoid Vite/Rollup resolving optional native deps at build time
let hapticsModule: {
  Haptics: any;
  ImpactStyle: any;
  NotificationType: any;
} | null = null;
let hapticsLoadAttempted = false;

async function loadHapticsModule() {
  if (hapticsModule || hapticsLoadAttempted) return hapticsModule;
  hapticsLoadAttempted = true;

  try {
    const dynamicImporter = new Function('modulePath', 'return import(modulePath)') as (
      modulePath: string,
    ) => Promise<any>;

    const mod = await dynamicImporter('@capacitor/haptics');
    hapticsModule = {
      Haptics: mod.Haptics,
      ImpactStyle: mod.ImpactStyle,
      NotificationType: mod.NotificationType,
    };
  } catch {
    hapticsModule = null;
  }

  return hapticsModule;
}

async function vibrateFallback(pattern: number | number[]) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // no-op
  }
}

/** Light tap — swipe cards */
export async function hapticLight() {
  try {
    const mod = await loadHapticsModule();
    if (mod) {
      await mod.Haptics.impact({ style: mod.ImpactStyle.Light });
      return;
    }

    await vibrateFallback(10);
  } catch { /* no-op */ }
}

/** Medium tap — button presses, bribe */
export async function hapticMedium() {
  try {
    const mod = await loadHapticsModule();
    if (mod) {
      await mod.Haptics.impact({ style: mod.ImpactStyle.Medium });
      return;
    }

    await vibrateFallback(18);
  } catch { /* no-op */ }
}

/** Heavy tap — game start, important actions */
export async function hapticHeavy() {
  try {
    const mod = await loadHapticsModule();
    if (mod) {
      await mod.Haptics.impact({ style: mod.ImpactStyle.Heavy });
      return;
    }

    await vibrateFallback(28);
  } catch { /* no-op */ }
}

/** Double sharp vibration — warnings, elections */
export async function hapticWarning() {
  try {
    const mod = await loadHapticsModule();
    if (mod) {
      await mod.Haptics.notification({ type: mod.NotificationType.Warning });
      return;
    }

    await vibrateFallback([30, 80, 30]);
  } catch { /* no-op */ }
}

/** Success vibration */
export async function hapticSuccess() {
  try {
    const mod = await loadHapticsModule();
    if (mod) {
      await mod.Haptics.notification({ type: mod.NotificationType.Success });
      return;
    }

    await vibrateFallback([20, 40, 20]);
  } catch { /* no-op */ }
}

/** Error vibration — game over */
export async function hapticError() {
  try {
    const mod = await loadHapticsModule();
    if (mod) {
      await mod.Haptics.notification({ type: mod.NotificationType.Error });
      return;
    }

    await vibrateFallback([40, 60, 40, 60, 40]);
  } catch { /* no-op */ }
}

/** War drums start — heavy + delay + heavy */
export async function hapticWarStart() {
  try {
    const mod = await loadHapticsModule();
    if (mod) {
      await mod.Haptics.impact({ style: mod.ImpactStyle.Heavy });
      await new Promise(r => setTimeout(r, 120));
      await mod.Haptics.impact({ style: mod.ImpactStyle.Heavy });
      await new Promise(r => setTimeout(r, 120));
      await mod.Haptics.impact({ style: mod.ImpactStyle.Medium });
      return;
    }

    await vibrateFallback([35, 120, 35, 120, 20]);
  } catch { /* no-op */ }
}

/** Double sharp — pre-election, critical alerts */
export async function hapticDoubleSharp() {
  try {
    const mod = await loadHapticsModule();
    if (mod) {
      await mod.Haptics.impact({ style: mod.ImpactStyle.Heavy });
      await new Promise(r => setTimeout(r, 100));
      await mod.Haptics.impact({ style: mod.ImpactStyle.Heavy });
      return;
    }

    await vibrateFallback([30, 100, 30]);
  } catch { /* no-op */ }
}
