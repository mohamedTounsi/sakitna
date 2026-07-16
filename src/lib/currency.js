/**
 * Currency utility — formats amounts directly in Tunisian Dinar (TND)
 * Prices are stored in TND directly in the database.
 */

/**
 * Format a TND amount as a string
 * @param {number} tnd
 * @returns {string} e.g. "170.50 TND"
 */
export function toTND(tnd) {
  if (!tnd && tnd !== 0) return '—';
  return parseFloat(tnd).toFixed(2) + ' TND';
}

/**
 * Return the raw TND number
 * @param {number} tnd
 * @returns {number}
 */
export function toTNDNumber(tnd) {
  if (!tnd && tnd !== 0) return 0;
  return parseFloat(tnd);
}

/**
 * Calculate product price based on quantity:
 * - 1 article: price1
 * - 2 articles: price2
 * - 3 or more: price2 + (quantity - 2) * price3
 */
export function calculateProductPrice(product, quantity) {
  if (!product) return 0;
  const p1 = parseFloat(product.price1) || 0;
  const p2 = parseFloat(product.price2) || 0;
  const p3 = parseFloat(product.price3) || 0;
  const q = parseInt(quantity) || 0;

  if (q <= 0) return 0;
  if (q === 1) return p1;
  if (q === 2) return p2;
  return p2 + (q - 2) * p3;
}
