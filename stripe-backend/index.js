const express = require("express");
const cors = require("cors");
const stripeLib = require("stripe");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json"); // ← حمليها من Firebase Console
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

app.post("/create-checkout-session", async (req, res) => {
  const { total, currency = "usd", slug } = req.body;

  if (!slug) return res.status(400).json({ error: "Missing slug" });

  try {
    // 1. Get settings from Firestore
    const docRef = db.collection("ReVerse").doc(slug);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Store not found" });
    }

    const data = docSnap.data();
    const stripeSecretKey = data.stripeSecretKey;
    const successUrl = data.success_url || "https://rreverse.netlify.app/success";
    const cancelUrl = data.cancel_url || "https://rreverse.netlify.app/cancel";

    if (!stripeSecretKey) {
      return res.status(500).json({ error: "Stripe Secret Key missing" });
    }

    const stripe = stripeLib(stripeSecretKey);

    // 2. Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Order Total" },
            unit_amount: total * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return res.status(200).json({ id: session.id });
  } catch (err) {
    console.error("Stripe error", err);
    return res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));
