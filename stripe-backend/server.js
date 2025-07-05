const express = require("express");
const cors = require("cors");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = express();
const corsOptions = {
  origin: ["http://localhost:5175", "https://rreverse.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ Route للفحص
app.get("/", (req, res) => {
  res.send("Stripe server is working ✅");
});

// ✅ Firebase Admin Init
initializeApp({
  credential: applicationDefault(),
});
const db = getFirestore();

app.post("/create-checkout-session", async (req, res) => {
  const { total, currency, slug } = req.body;

  if (!total || isNaN(total)) {
    return res.status(400).json({ error: "Invalid total amount" });
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

    const stripe = require("stripe")(stripeSecretKey);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency || docCurrency || "usd",
            product_data: {
              name: "Order Total",
            },
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Stripe server running on port ${PORT}`);
});
