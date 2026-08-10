#!/usr/bin/env node
/**
 * TGen generate script (Electron template)
 *
 * Reads `app.config.json` (pushed by the TGen website) and rewrites the
 * template so the next build is branded for that app:
 *
 *   - token replacement: package.json (electron-builder config), index.html
 *   - app icon: build/icon.ico (multi-size Windows icon) generated from
 *     assets/logo.png (or a solid brand-color square if no logo is present)
 *
 * Idempotent — safe to run twice.
 *
 * Usage: node scripts/generate.mjs [targetRoot]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const log = (msg) => console.log(`[generate] ${msg}`);

/* ------------------------------------------------------------------ */
/* Config                                                             */
/* ------------------------------------------------------------------ */

function loadConfig() {
  const configPath = path.join(root, 'app.config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error(`Missing app.config.json in ${root}`);
  }
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

const ALLOWED_THEMES = ['light', 'dark', 'system'];

function sanitizeAppName(name) {
  if (typeof name !== 'string' || !name.trim()) {
    throw new Error('appName is required and must be a non-empty string');
  }
  const cleaned = name
    .replace(/["'`<>;\\\n\r\t]/g, '')
    .trim()
    .slice(0, 40);
  if (!cleaned) {
    throw new Error('appName contains only invalid characters');
  }
  return cleaned;
}

function toPackageName(appName) {
  const base = appName.replace(/[^a-zA-Z0-9]/g, '');
  if (!base) {
    throw new Error('appName has no usable letters/numbers for the package name');
  }
  const named = base.charAt(0).toUpperCase() + base.slice(1);
  return /^[a-zA-Z]/.test(named) ? named : `App${named}`;
}

function sanitizePackageName(pkg) {
  if (typeof pkg !== 'string' || !/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(pkg)) {
    throw new Error(
      `packageName "${pkg}" is invalid — expected e.g. com.example.myapp (lowercase, dot-separated)`,
    );
  }
  return pkg.toLowerCase();
}

function sanitizeColor(color) {
  if (typeof color !== 'string' || !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) {
    throw new Error(`primaryColor "${color}" is invalid — expected #RRGGBB or #RGB`);
  }
  return color.length === 4
    ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toLowerCase()
    : color.toLowerCase();
}

function sanitizeVersion(version) {
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
    throw new Error(`version "${version}" is invalid — expected semver like 1.0.0`);
  }
  return version;
}

function resolveConfig(raw) {
  const appName = sanitizeAppName(raw.appName);
  return {
    ...raw,
    appName,
    slug: raw.slug || appName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    packageName: sanitizePackageName(raw.packageName),
    primaryColor: sanitizeColor(raw.primaryColor || '#3B82F6'),
    supportEmail: typeof raw.supportEmail === 'string' ? raw.supportEmail : 'support@example.com',
    version: sanitizeVersion(raw.version || '1.0.0'),
    theme: ALLOWED_THEMES.includes(raw.theme) ? raw.theme : 'light',
  };
}

/* ------------------------------------------------------------------ */
/* Token replacement                                                  */
/* ------------------------------------------------------------------ */

function tokenMap(cfg) {
  return {
    APP_NAME: cfg.appName,
    APP_NAME_JS: toPackageName(cfg.appName),
    PACKAGE_NAME: cfg.packageName,
    PRIMARY_COLOR: cfg.primaryColor,
    VERSION: cfg.version,
    SUPPORT_EMAIL: cfg.supportEmail,
  };
}

function applyTokens(files, tokens) {
  const patterns = Object.entries(tokens).map(([key, value]) => [
    new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
    value,
  ]);
  let touched = 0;
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    let content = original;
    for (const [pattern, value] of patterns) {
      content = content.replace(pattern, value);
    }
    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      touched++;
      log(`tokens applied -> ${path.relative(root, file)}`);
    }
  }
  return touched;
}

/* ------------------------------------------------------------------ */
/* Icon (Windows .ico)                                                 */
/* ------------------------------------------------------------------ */

async function generateIcon(cfg) {
  const logoPath = path.join(root, cfg.logoUrl || 'assets/logo.png');
  let source;
  if (fs.existsSync(logoPath)) {
    source = logoPath;
  } else {
    log(`logo not found at ${cfg.logoUrl || 'assets/logo.png'} — using solid brand color`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="${cfg.primaryColor}"/></svg>`;
    source = sharp(Buffer.from(svg));
  }

  const icoSizes = [16, 24, 32, 48, 64, 128, 256];
  const pngs = [];
  for (const size of icoSizes) {
    const data = await sharp(source).resize(size, size, { fit: 'cover' }).png().toBuffer();
    pngs.push({ size, data });
  }

  // ICONDIR: reserved(2) type(2) count(2)
  const dir = Buffer.alloc(6 + pngs.length * 16);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // type: icon
  dir.writeUInt16LE(pngs.length, 4); // image count

  let offset = 6 + pngs.length * 16;
  pngs.forEach((p, i) => {
    const entryStart = 6 + i * 16;
    dir.writeUInt8(p.size === 256 ? 0 : p.size, entryStart); // width (0 = 256)
    dir.writeUInt8(p.size === 256 ? 0 : p.size, entryStart + 1); // height
    dir.writeUInt8(0, entryStart + 2); // color palette
    dir.writeUInt8(0, entryStart + 3); // reserved
    dir.writeUInt16LE(1, entryStart + 4); // planes
    dir.writeUInt16LE(32, entryStart + 6); // bit count
    dir.writeUInt32LE(p.data.length, entryStart + 8); // data size
    dir.writeUInt32LE(offset, entryStart + 12); // data offset
    offset += p.data.length;
  });

  const ico = Buffer.concat([dir, ...pngs.map((p) => p.data)]);
  const outPath = path.join(root, 'build', 'icon.ico');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, ico);
  log(`icon -> build/icon.ico (${pngs.length} sizes)`);
}

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  log('reading app.config.json');
  const cfg = resolveConfig(loadConfig());
  log(
    `config: "${cfg.appName}" pkg=${cfg.packageName} color=${cfg.primaryColor} theme=${cfg.theme} v${cfg.version}`,
  );

  const tokenFiles = ['package.json', 'app/index.html'];
  const touched = applyTokens(tokenFiles.map((f) => path.join(root, f)), tokenMap(cfg));
  log(`token files updated: ${touched}`);

  await generateIcon(cfg);
  log('done — template is ready to build');
}

main().catch((err) => {
  console.error(`[generate] FAILED: ${err.message}`);
  process.exit(1);
});
