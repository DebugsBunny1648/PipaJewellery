/**
 * Aurelia design tokens — mobile.
 * Same palette and type system as the web storefront and admin panel
 * (ivory ground, deep emerald primary, antique-gold accent; Fraunces +
 * Inter + IBM Plex Mono), translated into a JS token object since React
 * Native has no CSS custom properties.
 */
export const colors = {
  bg: '#FAF6EF',
  surface: '#FFFFFF',
  surfaceSunken: '#F3EEE3',
  ink: '#201C18',
  inkSoft: '#5B554C',
  inkFaint: '#8B8377',
  primary: '#0F3D30',
  primaryDark: '#0A2B22',
  primaryTint: '#E4EBE7',
  gold: '#AD8548',
  goldSoft: '#E9DCC4',
  blush: '#E7C9BE',
  line: '#E1D8C8',
  danger: '#A23B2E',
  dangerTint: '#F5E4E1',
  success: '#2E6B4F',
  successTint: '#E3EEE8',
  warning: '#9A6A24',
  warningTint: '#F4E9D3'
};

export const fonts = {
  display: 'Fraunces_500Medium',
  displaySemibold: 'Fraunces_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemibold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  label: 'IBMPlexMono_500Medium'
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 48 };

export const radius = { sm: 4, md: 8, lg: 16, pill: 999 };

export const typeScale = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 22, xxl: 28, xxxl: 34
};

export const shadow = {
  card: {
    shadowColor: '#201C18',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3
  }
};
