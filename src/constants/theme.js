// Theme Constants - Single Source of Truth for Colors, Spacing, etc.

export const COLORS = {
  // Brand: confident, memorable — not dull, not loud (decision-readiness / regulated)
  brand: {
    deepTeal: '#0E7C7B',        // Primary — trust, stability
    mindBlue: '#118AB2',        // Links, secondary UI
    deepIndigo: '#073B4C',      // Hero, depth
    accentGold: '#B8935A',      // Muted gold — warmth, premium
    accentCoral: '#B85441',     // Deeper coral — emphasis
    neuroYellow: '#B8935A',     // Alias for accentGold
    neuralCoral: '#B85441',     // Alias for accentCoral
  },
  primary: {
    teal: '#0E7C7B',
    ocean: '#118AB2',
  },
  secondary: {
    yellow: '#B8935A',
    coral: '#B85441',
  },
  
  // Contrast Colors
  contrast: {
    indigo: '#073B4C',     // Deep Indigo
    purple: '#6A4C93',
  },
  
  // Functional Colors
  retention: {
    green: '#06D6A0',
    yellow: '#B8935A',
    red: '#B85441',
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
  
  // Gradients — hero stays teal/indigo/blue for impact without bright
  gradients: {
    primary: 'linear-gradient(135deg, #0E7C7B, #118AB2)',
    teal: 'linear-gradient(135deg, #0E7C7B, #118AB2)',
    hero: 'linear-gradient(135deg, #073B4C 0%, #0E7C7B 45%, #118AB2 100%)', // Indigo → Teal → Blue only
    brand: 'linear-gradient(135deg, #073B4C 0%, #0E7C7B 50%, #118AB2 100%)',
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
    '--color-brand-deep-indigo': COLORS.brand.deepIndigo,
    '--color-brand-accent-gold': COLORS.brand.accentGold,
    '--color-brand-accent-coral': COLORS.brand.accentCoral,
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

