/**
 * postbuild.js
 * 
 * Vercel CLI v56 expects .next/server/middleware.js.nft.json to exist
 * after the build. Next.js 16 renamed "middleware" to "proxy" and moved
 * the output to .next/server/edge/chunks/. This script creates the
 * legacy nft.json stub so Vercel's post-build step doesn't crash.
 */

const fs = require("fs");
const path = require("path");

const serverDir = path.join(process.cwd(), ".next", "server");
const nftPath = path.join(serverDir, "middleware.js.nft.json");
const middlewareManifest = path.join(serverDir, "middleware", "middleware-manifest.json");

// Only run if the new-style middleware manifest exists (Next.js 16 build)
if (fs.existsSync(middlewareManifest) && !fs.existsSync(nftPath)) {
  const manifest = JSON.parse(fs.readFileSync(middlewareManifest, "utf-8"));

  // Gather edge chunk files referenced by the middleware
  const files = [];
  const rootMiddleware = manifest.middleware?.["/"];
  if (rootMiddleware?.files) {
    for (const f of rootMiddleware.files) {
      files.push(f);
    }
  }

  // Write the nft.json stub Vercel CLI expects
  const nftContent = {
    version: 1,
    files: files.map((f) => ({ path: f })),
  };

  fs.writeFileSync(nftPath, JSON.stringify(nftContent, null, 2));
  console.log("✓ Created .next/server/middleware.js.nft.json for Vercel compatibility");
} else if (fs.existsSync(nftPath)) {
  console.log("✓ .next/server/middleware.js.nft.json already exists");
} else {
  console.log("ℹ No Next.js 16 middleware manifest found, skipping nft.json creation");
}
