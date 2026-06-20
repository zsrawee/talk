#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const schemaDir = path.join(__dirname, "..", "prisma");
const target = path.join(schemaDir, "schema.prisma");
const source = path.join(schemaDir, "schema.sqlite.prisma");

if (fs.existsSync(source)) {
  fs.copyFileSync(source, target);
  console.log("✓ Switched to SQLite (local) schema");
} else {
  console.warn("⚠ schema.sqlite.prisma not found, keeping current schema");
}
