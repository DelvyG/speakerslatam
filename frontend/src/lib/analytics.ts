import api from './api';

// Genera o recupera session ID
function getSessionId(): string {
  let sid = sessionStorage.getItem('sl_session');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('sl_session', sid);
  }
  return sid;
}

// Track page view
export async function trackPageView(path: string) {
  try {
    await api.post('/analytics/track', {
      session_id: getSessionId(),
      path,
      referrer: document.referrer || null,
    });
  } catch {
    // Silently fail - analytics should never break the app
  }
}

// Heartbeat to track time on page
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
let pageStartTime = 0;

export function startHeartbeat(path: string) {
  stopHeartbeat();
  pageStartTime = Date.now();

  heartbeatInterval = setInterval(async () => {
    const duration = Math.round((Date.now() - pageStartTime) / 1000);
    try {
      await api.post('/analytics/heartbeat', {
        session_id: getSessionId(),
        path,
        duration_seconds: duration,
      });
    } catch {
      // Silent fail
    }
  }, 30000); // Every 30 seconds
}

export function stopHeartbeat() {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}
