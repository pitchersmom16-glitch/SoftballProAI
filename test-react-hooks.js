import { createRequire } from "module";
const require = createRequire(import.meta.url);

try {
  const reactHooks = require("eslint-plugin-react-hooks");
  console.log("Success! Plugin loaded:", Object.keys(reactHooks));
} catch (e) {
  console.error("Failed to load:", e.message);
}
