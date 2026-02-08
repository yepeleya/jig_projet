import express from "express";
import cors from "cors";

const app = express();

// CORS minimal
app.use(cors({
  origin: ["https://jig-projet-ea3m.vercel.app"],
  credentials: true
}));

app.use(express.json());

// Health check ultra-simple
app.get('/', (req, res) => {
  res.json({
    status: 'JIG2026 Backend MINIMAL',
    timestamp: new Date().toISOString(),
    version: 'DIAGNOSTIC_1.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ success: true, status: 'minimal_ok' });
});

// Route de test sans Prisma
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend minimal fonctionne',
    env: {
      node_version: process.version,
      port: process.env.PORT || 'undefined',
      database_url_present: !!process.env.DATABASE_URL,
      jwt_secret_present: !!process.env.JWT_SECRET
    }
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Backend minimal sur port ${PORT}`);
  console.log('Variables:', {
    DATABASE_URL: !!process.env.DATABASE_URL,
    JWT_SECRET: !!process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV
  });
});

export default app;