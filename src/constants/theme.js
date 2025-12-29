// Theme Constants - Single Source of Truth for Colors, Spacing, etc.

export const COLORS = {
  // Brand Color Palette (from Brand Guidelines)
  brand: {
    deepTeal: '#0E7C7B',        // Deep Teal
    mindBlue: '#118AB2',        // Mind Blue
    neuroYellow: '#FFD166',     // Neuro Yellow
    neuralCoral: '#EF476F',     // Neural Coral
    deepIndigo: '#073B4C',      // Deep Indigo
  },
  
  // Primary Colors (aliases for backward compatibility)
  primary: {
    teal: '#0E7C7B',      // Deep Teal
    ocean: '#118AB2',     // Mind Blue
  },
  
  // Secondary Colors (aliases for backward compatibility)
  secondary: {
    yellow: '#FFD166',     // Neuro Yellow
    coral: '#EF476F',      // Neural Coral
  },
  
  // Contrast Colors
  contrast: {
    indigo: '#073B4C',     // Deep Indigo
    purple: '#6A4C93',
  },
  
  // Functional Colors
  retention: {
    green: '#06D6A0',
    yellow: '#FFD166',
    red: '#EF476F',
  },
  
  // Text Colors
  text: {
    dark: '#1F2937',
    gray: '#6B7280',
    light: '#9CA3AF',
    primary: '#1a1a1a',
    secondary: '#666',
    muted: '#888',
  },
  
  // Background Colors
  background: {
    light: '#F9FAFB',
    surface: '#FFFFFF',
    divider: '#E5E7EB',
  },
  
  // Gradients (using brand colors)
  gradients: {
    primary: 'linear-gradient(135deg, #EF476F, #FFD166)', // Neural Coral to Neuro Yellow
    teal: 'linear-gradient(135deg, #0E7C7B, #118AB2)',     // Deep Teal to Mind Blue
    hero: 'linear-gradient(135deg, #073B4C 0%, #118AB2 40%, #FFD166 70%, #EF476F 100%)', // Deep Indigo → Mind Blue → Neuro Yellow → Neural Coral
    brand: 'linear-gradient(135deg, #0E7C7B 0%, #118AB2 25%, #FFD166 50%, #EF476F 75%, #073B4C 100%)', // Full brand palette
  },
};

export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

export const BORDER_RADIUS = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',
};

// Export CSS variables for dynamic theming
export const getCSSVariables = () => {
  return {
    // Brand colors
    '--color-brand-deep-teal': COLORS.brand.deepTeal,
    '--color-brand-mind-blue': COLORS.brand.mindBlue,
    '--color-brand-neuro-yellow': COLORS.brand.neuroYellow,
    '--color-brand-neural-coral': COLORS.brand.neuralCoral,
    '--color-brand-deep-indigo': COLORS.brand.deepIndigo,
    // Primary colors (aliases)
    '--color-primary-teal': COLORS.primary.teal,
    '--color-primary-ocean': COLORS.primary.ocean,
    '--color-secondary-yellow': COLORS.secondary.yellow,
    '--color-secondary-coral': COLORS.secondary.coral,
    '--color-retention-green': COLORS.retention.green,
    '--color-retention-yellow': COLORS.retention.yellow,
    '--color-retention-red': COLORS.retention.red,
    '--color-text-primary': COLORS.text.primary,
    '--color-text-secondary': COLORS.text.secondary,
    '--color-text-muted': COLORS.text.muted,
    '--color-background-light': COLORS.background.light,
    '--color-background-surface': COLORS.background.surface,
    '--spacing-xs': SPACING.xs,
    '--spacing-sm': SPACING.sm,
    '--spacing-md': SPACING.md,
    '--spacing-lg': SPACING.lg,
    '--spacing-xl': SPACING.xl,
  };
};

// Inject theme variables into document root
export const injectThemeVariables = () => {
  const variables = getCSSVariables();
  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

