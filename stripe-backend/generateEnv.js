const fs = require("fs");

// 🔥 مسار ملف الخدمة عندك
const raw = fs.readFileSync("./serviceAccountKey.json", "utf8");
const json = JSON.parse(raw);

let envContent = "";
for (const [key, value] of Object.entries(json)) {
  let val = typeof value === "string" ? value : JSON.stringify(value);
  val = val.replace(/\n/g, "\\n"); // 🔁 مهم جدًا للمفتاح
  envContent += `FIREBASE_${key.toUpperCase()}="${val}"\n`;
}

fs.writeFileSync(".env.firebase", envContent);
console.log("✅ .env.firebase created");
