const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const staffRoutes = require("./routes/staffRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const startEscalationJob = require("./jobs/escalationJob");
const dns = require("dns");
dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();
app.disable("etag");
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const normalizeOrigin = (origin) => {
  try {
    const parsed = new URL(origin);
    // Normalize origin strings so trailing slash/case differences do not break CORS checks.
    return `${parsed.protocol}//${parsed.host}`.toLowerCase();
  } catch {
    return origin.trim().replace(/\/+$/, "").toLowerCase();
  }
};

const allowedOrigins = (process.env.ALLOWED_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

const corsOptions =
  allowedOrigins.length > 0
    ? {
        origin: (origin, cb) => {
          // Allow same-origin/server-to-server calls that do not send Origin.
          if (!origin) return cb(null, true);
          const normalizedOrigin = normalizeOrigin(origin);
          if (allowedOrigins.includes(normalizedOrigin)) return cb(null, true);
          return cb(new Error(`Not allowed by CORS: ${origin}`));
        },
        optionsSuccessStatus: 204,
      }
    : {
        // Do not crash in hosted environments if ALLOWED_ORIGIN is not set.
        origin: true,
        optionsSuccessStatus: 204,
      };

app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(cors(corsOptions));
app.options(/^\/api\/.*/, cors(corsOptions));
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      startEscalationJob();
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((e) => {
    console.error("DB connection failed", e.message);
    process.exit(1);
  });
