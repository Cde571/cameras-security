type UIState = {
  sidebarOpen: boolean;
  loading: boolean;
  theme: "light" | "dark";
};

let state: UIState = {
  sidebarOpen: true,
  loading: false,
  theme: "light",
};

const listeners = new Set<(state: UIState) => void>();

function emit() {
  listeners.forEach((fn) => fn(state));
}

export function getUIState() {
  return state;
}

export function setSidebarOpen(value: boolean) {
  state = { ...state, sidebarOpen: value };
  emit();
}

export function setLoading(value: boolean) {
  state = { ...state, loading: value };
  emit();
}

export function setTheme(value: "light" | "dark") {
  state = { ...state, theme: value };
  emit();
}

export function subscribeUI(listener: (state: UIState) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
