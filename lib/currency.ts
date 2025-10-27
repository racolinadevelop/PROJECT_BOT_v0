export const formatMoney = (cents: number, currency: string = 'USD') =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency }).format(cents / 100);