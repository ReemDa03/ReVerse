const express = require("express");
const cors = require("cors");
const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ 1. Firebase Admin Init
initializeApp({
  credential: applicationDefault(), // أو serviceAccount لو عندك ملف
});
const db = getFirestore();

app.post("/create-checkout-session", async (req, res) => {
  const { total, currency, slug } = req.body;

  try {
    // ✅ 2. جلب بيانات المطعم من Firestore
    const docRef = db.collection("restaurants").doc(slug);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const data = docSnap.data();
    const {
      stripeSecretKey,
      success_url,
      cancel_url,
      currency: docCurrency
    } = data;

    if (!stripeSecretKey || !success_url || !cancel_url) {
      return res.status(400).json({ error: "Missing Stripe or redirect info" });
    }

    const stripe = require("stripe")(stripeSecretKey);

    // ✅ 3. إنشاء جلسة الدفع
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
