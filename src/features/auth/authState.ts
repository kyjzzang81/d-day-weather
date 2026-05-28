export const AUTH_SESSION_STORAGE_KEY = "ggg.auth.session.v1";
export const AUTH_STATE_CHANGED_EVENT = "ggg:authStateChanged";

type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  email?: string;
  name?: string;
};

export function isUserLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(readAuthSession()?.accessToken);
}

export function readAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed.accessToken) return null;
    if (parsed.expiresAt && parsed.expiresAt <= Math.floor(Date.now() / 1000)) {
      clearAuthSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function signInWithGoogle(): void {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!supabaseUrl || !anonKey) {
    window.alert("Supabase 설정이 필요해요.");
    return;
  }

  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const searchParams = new URLSearchParams({
    provider: "google",
    redirect_to: redirectTo,
  });

  window.location.assign(`${supabaseUrl.replace(/\/$/, "")}/auth/v1/authorize?${searchParams.toString()}`);
}

export function signOut(): void {
  clearAuthSession();
}

export function handleAuthCallbackFromUrl(): boolean {
  if (typeof window === "undefined") return false;
  if (!window.location.hash.includes("access_token")) return false;

  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  if (!accessToken) return false;

  const expiresIn = Number(params.get("expires_in") ?? "0");
  const profile = parseJwtPayload(accessToken);
  const session: AuthSession = {
    accessToken,
    refreshToken: params.get("refresh_token") ?? undefined,
    expiresAt: expiresIn > 0 ? Math.floor(Date.now() / 1000) + expiresIn : undefined,
    email: typeof profile.email === "string" ? profile.email : undefined,
    name:
      typeof profile.user_metadata?.full_name === "string"
        ? profile.user_metadata.full_name
        : typeof profile.user_metadata?.name === "string"
          ? profile.user_metadata.name
          : undefined,
  };

  writeAuthSession(session);
  window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
  return true;
}

function writeAuthSession(session: AuthSession): void {
  window.localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

function clearAuthSession(): void {
  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
}

function parseJwtPayload(token: string): Record<string, any> {
  try {
    const [, payload] = token.split(".");
    if (!payload) return {};
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = window.atob(normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "="));
    return JSON.parse(decoded) as Record<string, any>;
  } catch {
    return {};
  }
}
