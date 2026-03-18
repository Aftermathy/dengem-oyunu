const DEVICE_ID_KEY = 'ims_device_uuid';

/**
 * Returns a persistent device UUID stored in localStorage.
 * Used as a temporary user_id before real auth (Apple Sign In) is implemented.
 */
export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
