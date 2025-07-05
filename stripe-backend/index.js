const express = require("express");
const cors = require("cors");
const stripeLib = require("stripe");
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = express();

// ✅ CORS options المعدلة
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5175",
      "https://rreverse.netlify.app",
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"], // أضفنا OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"], // أضفنا Authorization تحسبًا
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ ضروري للـ preflight requests
app.use(express.json());

// ✅ Firebase Admin Init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// ✅ Route للفحص
app.get("/", (req, res) => {
  res.send("✅ Stripe server is running");
});

// ✅ Stripe Checkout API
app.post("/create-checkout-session", async (req, res) => {
  const { total, currency, slug } = req.body;

  if (!total || isNaN(total)) {
    return res.status(400).json({ error: "Invalid total amount" });
  }

  if (!slug) {
    return res.status(400).json({ error: "Missing restaurant slug" });
  }

  try {
    const docRef = db.collection("ReVerse").doc(slug);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const data = docSnap.data();
    const { stripeSecretKey, success_url, cancel_url, currency: docCurrency } = data;

    if (!stripeSecretKey || !success_url || !cancel_url) {
      return res.status(400).json({ error: "Missing Stripe or redirect info" });
    }

    const stripe = stripeLib(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency || docCurrency || "usd",
            product_data: { name: "Order Total" },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url,
      cancel_url,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Stripe server running on port ${PORT}`);
});
