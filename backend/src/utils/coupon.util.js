export const calculateDiscount = ({ coupon, applicableAmount }) => {
  let discount = 0;

  if (coupon.discountType === "percentage") {
    discount = (applicableAmount * coupon.discountValue) / 100;
  } else {
    discount = coupon.discountValue;
  }

  if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
    discount = coupon.maxDiscountAmount;
  }

  return Math.round(discount);
};

export const getApplicableAmount = ({ cart, coupon }) => {
  let applicableAmount = 0;

  cart.items.forEach((item) => {
    let isApplicable = true;

    if (coupon.appliesTo === "book") {
      isApplicable = coupon.applicableBooks.some(
        (b) => b.toString() === item.book.toString()
      );
    }

    if (coupon.appliesTo === "category") {
      isApplicable = coupon.applicableCategories.some(
        (c) => c.toString() === item.category?.toString()
      );
    }

    if (isApplicable) applicableAmount += item.subtotal;
  });

  return applicableAmount;
};

export const validateCouponLock = (cart) => {
  if (!cart.appliedCoupon) return;

  if (cart.appliedCoupon.lockedUntil < new Date()) {
    cart.appliedCoupon = null;
  }
};
