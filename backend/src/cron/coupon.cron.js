import cron from "node-cron";
import Cart from "../models/cart.model.js";

cron.schedule("*/5 * * * *", async () => {
  const now = new Date();

  await Cart.updateMany(
    {
      appliedCoupon: { $ne: null },
      "appliedCoupon.lockedUntil": { $lte: now },
    },
    {
      $set: {
        appliedCoupon: null,
      },
    }
  );
});
