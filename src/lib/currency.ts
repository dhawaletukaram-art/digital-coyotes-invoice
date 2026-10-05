/**
 * Indian Rupee (INR / ₹) Currency Utilities for Digital Coyotes
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Formats a number into Indian Rupee representation (e.g. ₹1,20,000)
 * Uses standard Indian numbering system (Lakhs, Crores).
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${CURRENCY_SYMBOL}0`;
  }
  return `${CURRENCY_SYMBOL}${Number(amount).toLocaleString('en-IN')}`;
}

/**
 * Formats number with custom currency symbol or default ₹
 */
export function formatPrice(amount: number | null | undefined, symbol = CURRENCY_SYMBOL): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${symbol}0`;
  }
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
}
