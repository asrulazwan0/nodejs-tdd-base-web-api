// Apply a saved preference before styles load to avoid flashing the wrong theme.
try {
  const theme = localStorage.getItem('tdd-api-docs-theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch {
  // System colors remain available when browser storage is blocked.
}
