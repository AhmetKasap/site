import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import connectDB from "./database/db.config.js";
import { blogRouter } from "./routers/blog.router.js";
import { authRouter } from "./routers/auth.router.js";
import { authMiddleware } from "./middlewares/auth.middlewares.js";
import Blog from "./database/blog.model.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");
app.use(expressLayouts);

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Middleware to add path to all responses
app.use((req, res, next) => {
  res.locals.path = req.path;
  if (req.baseUrl) {
    res.locals.path = req.baseUrl + req.path;
  }
  next();
});

// Routes
app.use("/blog", blogRouter);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Ana Sayfa", path: "/" });
});

app.get("/hakkimda", (req, res) => {
  res.render("hakkimda", { title: "Hakkımda", path: "/hakkimda" });
});

app.get("/servisler", (req, res) => {
  res.render("servisler", { title: "Hizmetlerimiz", path: "/servisler" });
});

app.get("/iletisim", (req, res) => {
  res.render("iletisim", { title: "İletişim", path: "/iletisim" });
});

// Admin routes
app.get("/auth/login-avukat-halil-koroglu", (req, res) => {
  res.render("admin-login", { title: "Admin Girişi", path: "/admin/login" });
});

app.get("/admin/dashboard", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.render("admin-dashboard", { 
      title: "Admin Panel",
      path: "/admin/dashboard",
      blogs
    });
  } catch (error) {
    res.status(500).render("error", { 
      title: "Hata",
      path: "/error",
      error: "Blog listesi alınamadı"
    });
  }
});

app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
