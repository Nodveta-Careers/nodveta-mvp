const fs = require("fs");
const path = require("path");

const targets = [".next", path.join("node_modules", ".cache")];

for (const target of targets) {
  fs.rmSync(target, { recursive: true, force: true });
}

console.log("Cleaned Next.js cache (.next)");
