export const recalculateCart = (cart) => {
  cart.originalPriceTotal = cart.items.reduce(
    (sum, i) => sum + i.price.original * i.quantity,
    0
  );

  cart.discountedPriceTotal = cart.items.reduce(
    (sum, i) => sum + i.price.discounted * i.quantity,
    0
  );

  cart.productDiscountTotal =
    cart.originalPriceTotal - cart.discountedPriceTotal;

  cart.productDiscountPercent =
    cart.originalPriceTotal > 0
      ? Math.round((cart.productDiscountTotal / cart.originalPriceTotal) * 100)
      : 0;

  const couponDiscount = cart.appliedCoupon?.discountAmount || 0;

  cart.finalPayableAmount = Math.max(
    cart.discountedPriceTotal - couponDiscount,
    0
  );
};
