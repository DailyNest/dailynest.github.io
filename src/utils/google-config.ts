/**
 * Google Analytics and Tag Manager configuration utilities
 * Values are resolved at build time from environment variables
 */

export const GOOGLE_CONFIG = {
  // Google Analytics Measurement ID
  GA_MEASUREMENT_ID: import.meta.env.PUBLIC_GA_MEASUREMENT_ID || "",

  // Google Tag Manager Container ID
  GTM_ID: import.meta.env.PUBLIC_GTM_ID || "",

  // Google AdSense Client ID
  ADSENSE_CLIENT_ID: import.meta.env.PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || "",

  // Google Site Verification
  SITE_VERIFICATION: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION || "",
} as const;

/**
 * Get the Google Analytics gtag configuration script
 * This returns the actual measurement ID for inline scripts
 */
export function getGATagConfig(): string {
  return GOOGLE_CONFIG.GA_MEASUREMENT_ID;
}

/**
 * Get the Google Tag Manager container ID
 * This returns the actual container ID for inline scripts
 */
export function getGTMContainerId(): string {
  return GOOGLE_CONFIG.GTM_ID;
}

/**
 * Check if Google Analytics is configured
 */
export function hasGoogleAnalytics(): boolean {
  return Boolean(GOOGLE_CONFIG.GA_MEASUREMENT_ID);
}

/**
 * Check if Google Tag Manager is configured
 */
export function hasGoogleTagManager(): boolean {
  return Boolean(GOOGLE_CONFIG.GTM_ID);
}

/**
 * Check if Google AdSense is configured
 */
export function hasGoogleAdSense(): boolean {
  return Boolean(GOOGLE_CONFIG.ADSENSE_CLIENT_ID);
}
