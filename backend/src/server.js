import app from "./app.js";
import { assertRequiredEnv, env } from "./config/env.js";
import { connectDB } from "./config/db.js";

assertRequiredEnv();
await connectDB();

app.listen(env.port, () => {
  console.log(`AssetFlow API listening on port ${env.port}`);
});
