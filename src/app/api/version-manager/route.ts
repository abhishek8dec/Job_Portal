import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
const VERSIONS_DIR = path.join(ROOT_DIR, "versions", "page");
const MANIFEST_PATH = path.join(VERSIONS_DIR, "manifest.json");
const TARGET_FILE = path.join(ROOT_DIR, "src", "app", "page.tsx");

interface ManifestRelease {
  version: string;
  title: string;
  description: string;
  file: string;
  createdAt: string;
  tags?: string[];
}

interface Manifest {
  targetFile: string;
  activeVersion: string;
  releases: ManifestRelease[];
}

function loadManifest(): Manifest {
  if (!fs.existsSync(MANIFEST_PATH)) {
    return {
      targetFile: "src/app/page.tsx",
      activeVersion: "unknown",
      releases: [],
    };
  }
  return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

function saveManifest(manifest: Manifest) {
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
}

export async function GET() {
  try {
    const manifest = loadManifest();
    return NextResponse.json({ success: true, manifest });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load versions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, version, title, description } = body;

    const manifest = loadManifest();

    if (action === "restore") {
      if (!version) {
        return NextResponse.json(
          { success: false, error: "Version parameter is required" },
          { status: 400 }
        );
      }

      const release = manifest.releases.find(
        (r) => r.version.toLowerCase() === version.toLowerCase()
      );

      if (!release) {
        return NextResponse.json(
          { success: false, error: `Version [${version}] not found` },
          { status: 404 }
        );
      }

      const sourceFile = path.join(VERSIONS_DIR, release.file);
      if (!fs.existsSync(sourceFile)) {
        return NextResponse.json(
          { success: false, error: `Archive file ${release.file} is missing` },
          { status: 404 }
        );
      }

      // Safety backup
      if (fs.existsSync(TARGET_FILE)) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupName = `page.safety-backup-${timestamp}.tsx`;
        fs.copyFileSync(TARGET_FILE, path.join(VERSIONS_DIR, backupName));
      }

      // Restore
      fs.copyFileSync(sourceFile, TARGET_FILE);

      // Update active version
      manifest.activeVersion = release.version;
      saveManifest(manifest);

      return NextResponse.json({
        success: true,
        message: `Restored to version ${release.version}`,
        activeVersion: release.version,
      });
    }

    if (action === "snapshot") {
      if (!version) {
        return NextResponse.json(
          { success: false, error: "Version identifier is required" },
          { status: 400 }
        );
      }

      const safeVersion = version.replace(/[^a-zA-Z0-9._-]/g, "");
      const filename = `page.${safeVersion}.tsx`;
      const destPath = path.join(VERSIONS_DIR, filename);

      if (!fs.existsSync(TARGET_FILE)) {
        return NextResponse.json(
          { success: false, error: "Target page file does not exist" },
          { status: 500 }
        );
      }

      const content = fs.readFileSync(TARGET_FILE, "utf8");
      fs.writeFileSync(destPath, content, "utf8");

      const existingIndex = manifest.releases.findIndex(
        (r) => r.version === safeVersion
      );

      const releaseData: ManifestRelease = {
        version: safeVersion,
        title: title || `Release ${safeVersion}`,
        description:
          description || `Snapshot taken at ${new Date().toISOString()}`,
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

      return NextResponse.json({
        success: true,
        message: `Snapshot created for ${safeVersion}`,
        activeVersion: safeVersion,
        release: releaseData,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'restore' or 'snapshot'" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Operation failed" },
      { status: 500 }
    );
  }
}
