// Demo mode has been removed. Provide a lightweight compatible stub
// so any lingering imports won't break the app during migration.
export function DemoModeProvider({ children }) {
  return children;
}

export function useDemoMode() {
  // Return real-time defaults
  return {
    demoMode: false,
    SIMULATION_SPEED: 1,
    toggleDemoMode: () => {},
  };
}
