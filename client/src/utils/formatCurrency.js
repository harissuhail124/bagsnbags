/**
 * Format currency utility for Bags'n'Bags
 * Standardized to Pakistani Rupee (PKR)
 */
export const formatPrice = (amount) => {
  const val = Number(amount) || 0;
  return `PKR ${val.toLocaleString('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export default formatPrice;
