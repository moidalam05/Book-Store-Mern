import cron from "node-cron";
import { cleanupInactiveUsers } from "../controllers/user.controller.js";

cron.schedule("30 2 * * *", async () => {
  console.log("Running inactive user cleanup job...");
  await cleanupInactiveUsers();
});
