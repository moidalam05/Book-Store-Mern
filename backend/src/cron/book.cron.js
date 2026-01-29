import cron from "node-cron";
import { cleanupInactiveBooks } from "../controllers/book.controller.js";

cron.schedule("0 3 * * *", async () => {
  console.log("Running inactive books cleanup...");
  await cleanupInactiveBooks();
});
