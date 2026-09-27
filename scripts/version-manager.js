const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const VERSIONS_DIR = path.join(ROOT_DIR, "versions", "page");
const MANIFEST_PATH = path.join(VERSIONS_DIR, "manifest.json");
const TARGET_FILE = path.join(ROOT_DIR, "src", "app", "page.tsx");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      targetFile: "src/app/page.tsx",
      activeVersion: "unknown",
      releases: [],
    };
  }
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch (e) {
    console.error("Error reading manifest.json:", e);
    process.exit(1);
  }
}

function saveManifest(manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

function listVersions() {
  const manifest = loadManifest();
  console.log("\n==================================================");
  console.log("             JOB.COM PAGE RELEASES                ");
  console.log("==================================================");
  console.log(`Active Release: [${manifest.activeVersion}]\n`);

  if (!manifest.releases || manifest.releases.length === 0) {
    console.log("No releases found.");
    return;
  }

  manifest.releases.forEach((rel, idx) => {
    const isActive = rel.version === manifest.activeVersion;
    const prefix = isActive ? "-> (ACTIVE)" : "  ";
    console.log(`${prefix} [${rel.version}] ${rel.title}`);
    console.log(`     File:    ${rel.file}`);
    console.log(`     Created: ${new Date(rel.createdAt).toLocaleString()}`);
    console.log(`     Desc:    ${rel.description}`);
    if (idx < manifest.releases.length - 1) console.log("--------------------------------------------------");
  });
  console.log("==================================================\n");
}

function createSnapshot(version, title, description) {
  if (!version) {
    console.error("Error: Please provide a version identifier (e.g. v1.1.0)");
    process.exit(1);
  }

  ensureDir(VERSIONS_DIR);
  const manifest = loadManifest();

  // Clean version name
  const safeVersion = version.replace(/[^a-zA-Z0-9._-]/g, "");
  const filename = `page.${safeVersion}.tsx`;
  const destPath = path.join(VERSIONS_DIR, filename);

  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`Error: Target file not found at ${TARGET_FILE}`);
    process.exit(1);
  }

  const content = fs.readFileSync(TARGET_FILE, "utf8");
  fs.writeFileSync(destPath, content, "utf8");

  // Check if version exists in manifest
  const existingIndex = manifest.releases.findIndex((r) => r.version === safeVersion);
  const releaseData = {
    version: safeVersion,
    title: title || `Release ${safeVersion}`,
    description: description || `Snapshot created on ${new Date().toISOString()}`,
    file: filename,
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    manifest.releases[existingIndex] = releaseData;
  } else {
    manifest.releases.push(releaseData);
  }

  manifest.activeVersion = safeVersion;
  saveManifest(manifest);

  console.log(`\n Successfully created snapshot [${safeVersion}]`);
  console.log(` Saved file: versions/page/${filename}`);
  console.log(` Manifest updated. Active version set to [${safeVersion}].\n`);
}

function restoreVersion(version) {
  if (!version) {
    console.error("Error: Please provide a version to restore (e.g. v1.0.0-showcase)");
    process.exit(1);
  }

  const manifest = loadManifest();
  const release = manifest.releases.find(
    (r) => r.version.toLowerCase() === version.toLowerCase()
  );

  if (!release) {
    console.error(`\n❌ Error: Version [${version}] not found in manifest.`);
    console.log("Run 'node scripts/version-manager.js list' to see available releases.\n");
    process.exit(1);
  }

  const sourceFile = path.join(VERSIONS_DIR, release.file);
  if (!fs.existsSync(sourceFile)) {
    console.error(`\n❌ Error: Archive file not found: ${sourceFile}\n`);
    process.exit(1);
  }

  // Safety Backup of current working file before overwriting
  if (fs.existsSync(TARGET_FILE)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupName = `page.safety-backup-${timestamp}.tsx`;
    const backupPath = path.join(VERSIONS_DIR, backupName);
    fs.copyFileSync(TARGET_FILE, backupPath);
    console.log(` Created safety backup of current page: versions/page/${backupName}`);
  }

  // Restore the selected version
  fs.copyFileSync(sourceFile, TARGET_FILE);

  // Update manifest
  manifest.activeVersion = release.version;
  saveManifest(manifest);

  console.log(`\n Restored homepage to release [${release.version}] (${release.title})`);
  console.log(` src/app/page.tsx is now updated with the contents of ${release.file}\n`);
}

// CLI handler
const [,, command, ...args] = process.argv;

switch (command) {
  case "list":
    listVersions();
    break;
  case "snapshot":
    createSnapshot(args[0], args[1], args[2]);
    break;
  case "restore":
    restoreVersion(args[0]);
    break;
  default:
    console.log(`
Usage:
  node scripts/version-manager.js list
  node scripts/version-manager.js snapshot <version> [title] [description]
  node scripts/version-manager.js restore <version>

Examples:
  node scripts/version-manager.js list
  node scripts/version-manager.js snapshot v1.1.0-preview "Role-Gated Landing Page" "Updated hero with role-based auth buttons"
  node scripts/version-manager.js restore v1.0.0-showcase
`);
}
