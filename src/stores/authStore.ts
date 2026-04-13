export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: AuthUser | null;
  authenticated: boolean;
};

let state: AuthState = {
  user: null,
  authenticated: false,
};

const listeners = new Set<(state: AuthState) => void>();

function emit() {
  listeners.forEach((fn) => fn(state));
}

export function getAuthState() {
  return state;
}

export function setAuthUser(user: AuthUser | null) {
  state = {
    user,
    authenticated: !!user,
  };
  emit();
}

export function clearAuth() {
  state = {
    user: null,
    authenticated: false,
  };
  emit();
}

export function subscribeAuth(listener: (state: AuthState) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
