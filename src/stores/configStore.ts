type ConfigState = {
  empresa: Record<string, any>;
  impuestos: Record<string, any>;
  numeracion: Record<string, any>;
};

let state: ConfigState = {
  empresa: {},
  impuestos: {},
  numeracion: {},
};

const listeners = new Set<(state: ConfigState) => void>();

function emit() {
  listeners.forEach((fn) => fn(state));
}

export function getConfigState() {
  return state;
}

export function updateConfig(partial: Partial<ConfigState>) {
  state = { ...state, ...partial };
  emit();
}

export function subscribeConfig(listener: (state: ConfigState) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
