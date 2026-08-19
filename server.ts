import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import type { Product, SiteSettings } from "./src/types.ts";

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");

// Initial Seed Data
const INITIAL_SETTINGS: SiteSettings = {
  store_name: "KICKS VAULT",
  logo_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=400&q=80",
  description: "Curated Authentic Preloved & Secondhand Sneakers. Handpicked, Legit Checked, and Ready to Wear.",
  whatsapp_number: "6281234567890",
  instagram_username: "kicksvault.id",
  instagram_url: "https://instagram.com/kicksvault.id",
  address: "Jl. Senopati No. 45, Kebayoran Baru, Jakarta Selatan 12190",
  opening_hours: "Senin - Minggu: 11:00 - 21:00 WIB",
  hero_title: "CURATED SECONDHAND SNEAKERS & STREETWEAR",
  hero_subtitle: "Dapatkan sneaker vintage, grail, dan hypebeast second original berkualitas grade A dengan garansi 100% authentic.",
  hero_banner_url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1600&q=85",
  whatsapp_button_text: "Beli via WhatsApp",
  whatsapp_message_template: "Halo Kicks Vault, saya tertarik untuk membeli sepatu ini:\n\n*Nama*: {product_name}\n*Brand*: {brand}\n*Size*: {size}\n*Kondisi*: {condition}\n*Harga*: {price}\n\nApakah item ini masih tersedia? Bisa minta video detailnya? Terima kasih!",
  announcement_text: "🔥 NEW DROP EVERY FRIDAY 19:00 WIB | FREE SNEAKER CLEANING WIPES SETIAP PEMBELIAN 🔥",
  announcement_enabled: true
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Air Jordan 1 Retro High OG 'Lost & Found' (Chicago)",
    brand: "Jordan",
    size: "42.5 EUR / 9 US / 27 CM",
    condition: "9.5/10 (VNDS - Like New)",
    price: 3450000,
    original_price: 5200000,
    description: "Kondisi sangat mulus terawat. Pemakaian indoor 2x saja. Stars sol 99%, crack leather original look, insole print masih utuh 100%. Lengkap receipt & receipt invoice OG.",
    image_url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"
    ],
    status: "available",
    box_condition: "Complete OG Box, extra white laces & vintage receipt",
    sku: "DZ5485-612",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "prod-2",
    name: "Nike Dunk Low Retro 'Panda' White Black",
    brand: "Nike",
    size: "41 EUR / 8 US / 26 CM",
    condition: "9.0/10 (Very Good Condition)",
    price: 1350000,
    original_price: 2100000,
    description: "Kondisi overall sangat bersih, upper kulit halus tanpa lecet parah. Insole print sedikit pudar, outsoles tebal no heel drag. Sudah deep cleaned siap pakai.",
    image_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=800&q=80"
    ],
    status: "available",
    box_condition: "Replacement Good Box",
    sku: "DD1391-100",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "prod-3",
    name: "New Balance 990v3 MiUSA 'Marblehead' Teddy Santis",
    brand: "New Balance",
    size: "43 EUR / 9.5 US / 27.5 CM",
    condition: "9.2/10 (Great Suede Condition)",
    price: 2850000,
    original_price: 4400000,
    description: "Suede premium hairy masih hidup dan lembut. Midsole ENCAP empuk dan responsif, tidak ada noda membandel. Dipakai casual weekend saja.",
    image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    additional_images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=800&q=80"
    ],
    status: "available",
    box_condition: "OG Box Made in USA Edition",
    sku: "M990TG3",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "prod-4",
    name: "Asics Gel-Kayano 14 'Cream Pure Silver'",
    brand: "Asics",
    size: "42 EUR / 8.5 US / 26.5 CM",
    condition: "9.6/10 (Near Pristine)",
    price: 2400000,
    original_price: 3200000,
    description: "Very rare size! Mesh sangat bersih, silver overlay mengkilap no peel off. Gel cushioning empuk dan outsoles 98% utuh. Like new feeling.",
    image_url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    status: "available",
    box_condition: "OG Box & Hangtag",
    sku: "1201A019-105",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "prod-5",
    name: "Air Jordan 4 Retro 'Military Black'",
    brand: "Jordan",
    size: "44 EUR / 10 US / 28 CM",
    condition: "9.0/10 (Very Good Condition)",
    price: 4200000,
    original_price: 6800000,
    description: "Netting bersih, wings kokoh tanpa retak/kuning, heel tab aman, air bubble jernih. Salah satu Jordan 4 paling dicari saat ini.",
    image_url: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    status: "sold",
    box_condition: "OG Box complete",
    sku: "DH6927-111",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    id: "prod-6",
    name: "Salomon XT-6 'Black Phantom' Gore-Tex",
    brand: "Salomon",
    size: "42.5 EUR / 9 US / 27 CM",
    condition: "9.4/10 (Excellent Trail/Street Ready)",
    price: 2650000,
    original_price: 3900000,
    description: "Quicklace system kencang dan mulus, membrane Gore-Tex tahan air berfungsi 100%. Grip Contagrip sol masih tajam dan tebal.",
    image_url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    status: "available",
    box_condition: "OG Box",
    sku: "L41663500",
    created_at: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    id: "prod-7",
    name: "Adidas Originals Samba OG 'Cloud White Core Black'",
    brand: "Adidas",
    size: "40.5 EUR / 7.5 US / 25.5 CM",
    condition: "8.8/10 (Good Condition - Vintage Look)",
    price: 1100000,
    original_price: 2000000,
    description: "Suede T-toe toebox bersih, gum sole klasik dan grip mantap. Sedikit creasing natural di bagian toebox yang membuat tampilan vintage lebih berkarakter.",
    image_url: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    status: "available",
    box_condition: "OG Blue Box",
    sku: "B75806",
    created_at: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    id: "prod-8",
    name: "Travis Scott x Air Jordan 1 Low OG 'Reverse Mocha'",
    brand: "Jordan",
    size: "43 EUR / 9.5 US / 27.5 CM",
    condition: "9.8/10 (Grail Condition / Pass As VNDS)",
    price: 13500000,
    original_price: 19500000,
    description: "Holy Grail sneaker! Reverse swoosh, cactus jack embroidery presisi, nubuck mocha super hidup, insole print 100%. Verified by CheckCheck & LegitApp certificate included.",
    image_url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
    additional_images: [],
    status: "sold",
    box_condition: "Special Travis Scott Box + 3 Sets Extra Laces",
    sku: "DM7866-162",
    created_at: new Date(Date.now() - 86400000 * 12).toISOString()
  }
];

// Helper functions for reading & writing database
function getSettings(): SiteSettings {
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(INITIAL_SETTINGS, null, 2));
    return INITIAL_SETTINGS;
  }
  try {
    const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
  } catch {
    return INITIAL_SETTINGS;
  }
}

function saveSettings(settings: SiteSettings) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

function getProducts(): Product[] {
  if (!fs.existsSync(PRODUCTS_FILE)) {
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(INITIAL_PRODUCTS, null, 2));
    return INITIAL_PRODUCTS;
  }
  try {
    const data = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return INITIAL_PRODUCTS;
  }
}

function saveProducts(products: Product[]) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

interface AuthData {
  username: string;
  passwordHash: string; // plain or simple hash for demo
  token: string;
}

function getAuthData(): AuthData {
  if (!fs.existsSync(AUTH_FILE)) {
    const defaultAuth: AuthData = {
      username: "admin",
      passwordHash: "admin123",
      token: "kicks-vault-admin-token-secure-key-98234"
    };
    fs.writeFileSync(AUTH_FILE, JSON.stringify(defaultAuth, null, 2));
    return defaultAuth;
  }
  try {
    return JSON.parse(fs.readFileSync(AUTH_FILE, "utf-8"));
  } catch {
    return {
      username: "admin",
      passwordHash: "admin123",
      token: "kicks-vault-admin-token-secure-key-98234"
    };
  }
}

function saveAuthData(data: AuthData) {
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data, null, 2));
}

// Ensure initial files exist on startup
getSettings();
getProducts();
getAuthData();

// Middleware to check admin token
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const authData = getAuthData();
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. Admin token is missing." });
  }

  const token = authHeader.split(" ")[1];
  if (token !== authData.token) {
    return res.status(403).json({ error: "Forbidden. Invalid admin token." });
  }

  next();
}

// ================= API ENDPOINTS ================= //

// 1. Settings Endpoints
app.get("/api/settings", (req, res) => {
  try {
    const settings = getSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengambil pengaturan", details: err.message });
  }
});

app.put("/api/settings", requireAdminAuth, (req, res) => {
  try {
    const current = getSettings();
    const updated: SiteSettings = {
      ...current,
      ...req.body
    };
    saveSettings(updated);
    res.json({ success: true, settings: updated, message: "Pengaturan website berhasil disimpan" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menyimpan pengaturan", details: err.message });
  }
});

// 2. Products Endpoints
app.get("/api/products", (req, res) => {
  try {
    const products = getProducts();
    // sort by created_at desc
    const sorted = [...products].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    res.json(sorted);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengambil daftar produk", details: err.message });
  }
});

app.get("/api/products/:id", (req, res) => {
  try {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengambil data produk", details: err.message });
  }
});

app.post("/api/products", requireAdminAuth, (req, res) => {
  try {
    const {
      name,
      brand,
      size,
      condition,
      price,
      original_price,
      description,
      image_url,
      additional_images,
      status,
      box_condition,
      sku
    } = req.body;

    if (!name || !brand || !size || !condition || price === undefined) {
      return res.status(400).json({ error: "Mohon lengkapi data produk: nama, brand, ukuran, kondisi, dan harga." });
    }

    const newProduct: Product = {
      id: "prod-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
      name,
      brand,
      size,
      condition,
      price: Number(price),
      original_price: original_price ? Number(original_price) : undefined,
      description: description || "",
      image_url: image_url || "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
      additional_images: Array.isArray(additional_images) ? additional_images : [],
      status: status === "sold" ? "sold" : "available",
      box_condition: box_condition || "Good Condition Box",
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      created_at: new Date().toISOString()
    };

    const products = getProducts();
    products.unshift(newProduct);
    saveProducts(products);

    res.status(201).json({ success: true, product: newProduct, message: "Produk berhasil ditambahkan" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menambahkan produk", details: err.message });
  }
});

app.put("/api/products/:id", requireAdminAuth, (req, res) => {
  try {
    const products = getProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    const existing = products[index];
    const updated: Product = {
      ...existing,
      ...req.body,
      id: existing.id, // ID must remain unchanged
      price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
      original_price: req.body.original_price ? Number(req.body.original_price) : existing.original_price,
      status: req.body.status === "sold" ? "sold" : "available",
    };

    products[index] = updated;
    saveProducts(products);

    res.json({ success: true, product: updated, message: "Produk berhasil diperbarui" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memperbarui produk", details: err.message });
  }
});

app.delete("/api/products/:id", requireAdminAuth, (req, res) => {
  try {
    const products = getProducts();
    const filtered = products.filter(p => p.id !== req.params.id);
    if (filtered.length === products.length) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    saveProducts(filtered);
    res.json({ success: true, message: "Produk berhasil dihapus" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal menghapus produk", details: err.message });
  }
});

// 3. Auth Endpoints
app.post("/api/auth/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const authData = getAuthData();

    if (username === authData.username && password === authData.passwordHash) {
      return res.json({
        success: true,
        token: authData.token,
        username: authData.username,
        message: "Login admin berhasil"
      });
    }

    res.status(401).json({ error: "Username atau password salah" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal memproses login", details: err.message });
  }
});

app.post("/api/auth/verify", (req, res) => {
  try {
    const { token } = req.body;
    const authData = getAuthData();

    if (token && token === authData.token) {
      return res.json({ valid: true, username: authData.username });
    }

    res.status(401).json({ valid: false, error: "Sesi admin telah berakhir" });
  } catch (err: any) {
    res.status(500).json({ valid: false, error: err.message });
  }
});

app.post("/api/auth/change-password", requireAdminAuth, (req, res) => {
  try {
    const { newPassword, currentPassword } = req.body;
    const authData = getAuthData();

    if (currentPassword !== authData.passwordHash) {
      return res.status(400).json({ error: "Password saat ini tidak sesuai" });
    }

    if (!newPassword || newPassword.length < 5) {
      return res.status(400).json({ error: "Password baru minimal 5 karakter" });
    }

    authData.passwordHash = newPassword;
    saveAuthData(authData);

    res.json({ success: true, message: "Password admin berhasil diubah" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mengubah password", details: err.message });
  }
});

// 4. Reset & Seed helper
app.post("/api/reset-data", requireAdminAuth, (req, res) => {
  try {
    saveSettings(INITIAL_SETTINGS);
    saveProducts(INITIAL_PRODUCTS);
    res.json({ success: true, message: "Katalog dan pengaturan berhasil direset ke data default" });
  } catch (err: any) {
    res.status(500).json({ error: "Gagal mereset data", details: err.message });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start Server with Vite or Static
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sneaker Store Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
