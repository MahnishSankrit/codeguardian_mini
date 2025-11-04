// index.js — AWS Lambda RDS Health Monitor (Node.js 20.x)

console.log("✅ Lambda cold start successful — entering handler");

const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const mysql = require("mysql2/promise");
const PDFDocument = require("pdfkit");

// ===== Environment Variables (set these in Lambda Configuration) =====
const REGION = process.env.AWS_REGION || "ap-south-1";
const S3_BUCKET = process.env.S3_BUCKET; // e.g. my-rds-reports-681414095576
const SECRET_NAME = process.env.SECRET_NAME; // e.g. repo-service/DB_SECRET
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER || "admin";
const REPORT_PREFIX = process.env.REPORT_PREFIX || "rds-report";

// ===== AWS Clients =====
const secretsClient = new SecretsManagerClient({ region: REGION });
const s3Client = new S3Client({ region: REGION });

// ===== Helper: Fetch DB password from AWS Secrets Manager =====
async function getDbPasswordFromSecret(secretId) {
  console.log("🔐 Fetching DB password from Secrets Manager:", secretId);
  const res = await secretsClient.send(
    new GetSecretValueCommand({ SecretId: secretId })
  );
  if (!res || !res.SecretString) throw new Error("Empty secret value");

  try {
    const secret = JSON.parse(res.SecretString);
    return (
      secret.password ||
      secret.DB_PASSWORD ||
      secret.db_password ||
      secret.DBPassword ||
      null
    );
  } catch {
    return res.SecretString; // fallback: plain text secret
  }
}

// ===== Helper: Generate PDF report =====
async function createPdfBuffer(reportData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];

      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      doc.fontSize(22).text("RDS Health Report", { align: "center" });
      doc.moveDown();
      doc.fontSize(11).text(`Generated at: ${new Date().toISOString()}`);
      doc.moveDown(1.5);

      doc.fontSize(14).text("Summary", { underline: true });
      doc.moveDown(0.3);

      const lines = [
        `DB Host: ${reportData.dbHost}`,
        `DB Name: ${reportData.dbName}`,
        `Status: ${reportData.status}`,
        `MySQL Version: ${reportData.version || "N/A"}`,
        `Connected Threads: ${reportData.threads_connected ?? "N/A"}`,
        `Commits Count: ${reportData.commitsCount ?? "N/A"}`,
        `Pulls Count: ${reportData.pullsCount ?? "N/A"}`,
        `Duration (ms): ${reportData.durationMs ?? "N/A"}`,
      ];
      lines.forEach((l) => {
        doc.fontSize(10).text("• " + l);
        doc.moveDown(0.1);
      });

      if (reportData.errors?.length) {
        doc.moveDown(1);
        doc.fontSize(14).text("Errors", { underline: true });
        reportData.errors.forEach((e) => {
          doc.fontSize(10).text("- " + e);
        });
      }

      doc.addPage();
      doc.fontSize(12).text("Raw Report Data", { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10).text(JSON.stringify(reportData, null, 2));

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

// ===== Lambda Handler =====
exports.handler = async (event) => {
  console.log("🚀 Lambda execution started", new Date().toISOString());

  const start = Date.now();
  let conn;
  const report = {
    dbHost: DB_HOST,
    dbName: DB_NAME,
    status: "unknown",
    version: null,
    threads_connected: null,
    commitsCount: null,
    pullsCount: null,
    durationMs: null,
    errors: [],
  };

  try {
    if (!DB_HOST || !DB_NAME)
      throw new Error("DB_HOST and DB_NAME must be set in Lambda environment");

    if (!S3_BUCKET) throw new Error("S3_BUCKET not configured");
    if (!SECRET_NAME) throw new Error("SECRET_NAME not configured");

    // Get DB password
    const password = await getDbPasswordFromSecret(SECRET_NAME);
    if (!password) throw new Error("DB password not found in secret");
    console.log("✅ Got DB password from Secrets Manager");

    // Connect to MySQL
    console.log("🔌 Connecting to RDS MySQL:", DB_HOST);
    conn = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password,
      database: DB_NAME,
      connectTimeout: 8000,
    });

    report.status = "connected";
    console.log("✅ MySQL connected successfully");

    // Query MySQL version
    const [verRows] = await conn.query("SELECT VERSION() AS version");
    report.version = verRows?.[0]?.version;
    console.log("🧩 MySQL version:", report.version);

    // Threads connected
    try {
      const [rows] = await conn.query("SHOW STATUS LIKE 'Threads_connected'");
      report.threads_connected = rows?.[0]?.Value || "N/A";
    } catch (e) {
      report.errors.push("Threads check failed: " + e.message);
    }

    // Commits count
    try {
      const [[commits]] = await conn.query("SELECT COUNT(*) AS cnt FROM Commits");
      report.commitsCount = commits?.cnt ?? 0;
    } catch (e) {
      report.errors.push("Commits count failed: " + e.message);
    }

    // Pulls count
    try {
      const [[pulls]] = await conn.query("SELECT COUNT(*) AS cnt FROM Pulls");
      report.pullsCount = pulls?.cnt ?? 0;
    } catch (e) {
      report.errors.push("Pulls count failed: " + e.message);
    }

    report.durationMs = Date.now() - start;

    // Create and upload PDF
    console.log("📝 Generating PDF report...");
    const pdfBuffer = await createPdfBuffer(report);
    const key = `${REPORT_PREFIX}-${new Date().toISOString().replace(/[:.]/g, "-")}.pdf`;

    console.log(`📤 Uploading report to S3: ${S3_BUCKET}/${key}`);
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      })
    );

    if (conn) await conn.end();
    console.log("✅ Lambda completed successfully");

    return {
      status: "success",
      s3Bucket: S3_BUCKET,
      s3Key: key,
      report,
    };
  } catch (err) {
    console.error("❌ Error:", err.message);
    report.status = "error";
    report.errors.push(err.message);
    report.durationMs = Date.now() - start;

    if (conn) {
      try {
        await conn.end();
      } catch {}
    }

    try {
      console.log("🛠️ Creating error report PDF...");
      const pdfBuffer = await createPdfBuffer(report);
      const key = `${REPORT_PREFIX}-error-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.pdf`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          Body: pdfBuffer,
          ContentType: "application/pdf",
        })
      );

      console.log("❌ Error PDF uploaded to S3:", key);
      return {
        status: "error",
        error: err.message,
        s3Bucket: S3_BUCKET,
        s3Key: key,
        report,
      };
    } catch (e) {
      console.error("💥 Fatal error while uploading error report:", e.message);
      return {
        status: "fatal-error",
        message: "Failed to upload even error report",
        originalError: err.message,
        pdfError: e.message,
      };
    }
  }
};
