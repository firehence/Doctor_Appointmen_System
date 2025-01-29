const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cors = require("cors");
const { QueueServiceClient } = require("@azure/storage-queue");
const { ref, push, get, child } = require("firebase/database");
const { database } = require("./firebase");
const redis = require("redis"); // 📌 Redis ekledik

const app = express();

// ✅ **Redis Bağlantısı**
const redisClient = redis.createClient();
redisClient.connect()
  .then(() => console.log("✅ Redis'e bağlandı!"))
  .catch((err) => console.error("❌ Redis bağlantı hatası:", err));

app.use(cors());
app.use(bodyParser.json());

// ✅ **Azure Queue Storage Bilgileri**
const accountName = "se4458";
const accountKey = "YNLiBBCu/qmNIzLbO5RxUNparKIpI7IjV7W4cWkIkEZzuFxkqOWrBPmkZsOaoOMi+PicWfNHjWrX+AStM0KhpQ==";

const queueServiceClient = QueueServiceClient.fromConnectionString(
  `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
);
const queueClient = queueServiceClient.getQueueClient("appointmentsqueue");

// **📌 E-Posta Yapılandırması**
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aytunyuksek48@gmail.com",
    pass: "sjrl qjzi opnz sgnm",
  },
});

// 📌 **Firebase'den Veri Alma (Redis Cache Kullanımı ile)**
app.get("/api/firebase/:collection", async (req, res) => {
  try {
    const { collection } = req.params;

    // ✅ Önce Redis cache'ini kontrol et
    const cachedData = await redisClient.get(collection);
    if (cachedData) {
      console.log(`📌 Redis Cache'den veri alındı: ${collection}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    // ✅ Redis'te yoksa Firebase'den çek
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, collection));

    if (snapshot.exists()) {
      const data = snapshot.val();

      // ✅ Redis'e kaydet (10 dakika cache süresi)
      await redisClient.setEx(collection, 600, JSON.stringify(data));

      console.log(`📌 Firebase'den veri alındı ve Redis'e kaydedildi: ${collection}`);
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: "Veri bulunamadı." });
    }
  } catch (error) {
    console.error("🔥 Veri alırken hata oluştu:", error);
    res.status(500).json({ error: "Veri alınamadı." });
  }
});

// 📌 **Randevu Oluşturma ve Azure Kuyruğa Ekleme**
app.post("/api/appointments", async (req, res) => {
  try {
    console.log("🟢 Yeni randevu isteği alındı:", req.body);

    const { clientEmail, clientName, doctorName, day, time } = req.body;

    if (!clientEmail || !clientName || !doctorName || !day || !time) {
      console.error("❌ Eksik bilgiler mevcut:", req.body);
      return res.status(400).json({ error: "Eksik bilgiler mevcut." });
    }

    const appointmentId = `${doctorName}-${day}-${time}`.replace(/\s+/g, "-").toLowerCase();
    const message = JSON.stringify({ clientEmail, clientName, appointmentId, doctorName, day, time });

    try {
      await queueClient.sendMessage(Buffer.from(message).toString("base64"));
      console.log(`📩 Azure Queue'ya mesaj gönderildi: ${message}`);
    } catch (queueError) {
      console.error("❌ Azure Queue'ya mesaj gönderilirken hata:", queueError);
      return res.status(500).json({ error: "Azure Queue'ya mesaj gönderilemedi." });
    }

    // **📧 Kullanıcıya E-Posta Gönderme**
    const mailOptions = {
      from: "aytunyuksek48@gmail.com",
      to: clientEmail,
      subject: `Doktorunuz ${doctorName} için değerlendirme yapın`,
      html: `
        <h3>Randevu sonrası değerlendirme</h3>
        <p>Lütfen doktorunuz <b>${doctorName}</b> için değerlendirme yapın.</p>
        <a href="http://localhost:3000/rate?appointmentId=${appointmentId}">Değerlendirme Yap</a>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("📧 E-posta başarıyla gönderildi:", mailOptions);
    } catch (emailError) {
      console.error("❌ E-posta gönderim hatası:", emailError);
      return res.status(500).json({ error: "E-posta gönderilirken hata oluştu." });
    }

    res.status(200).json({ message: "Randevu kaydedildi ve kuyruğa eklendi." });
  } catch (error) {
    console.error("❌ Genel hata oluştu:", error);
    res.status(500).json({ error: "Randevu oluşturulurken hata oluştu." });
  }
});

// 📌 **Firebase'e Veri Ekleme**
app.post("/api/firebase/:collection", async (req, res) => {
  try {
    const { collection } = req.params;
    const newData = req.body;

    if (!newData) {
      return res.status(400).json({ error: "Gönderilecek veri bulunamadı." });
    }

    const newRef = ref(database, collection);
    const pushedRef = await push(newRef, newData);

    // ✅ Redis Cache'i Güncelle
    await redisClient.setEx(collection, 600, JSON.stringify(newData));

    res.status(200).json({ message: "Veri başarıyla eklendi", id: pushedRef.key, data: newData });
  } catch (error) {
    console.error("🔥 Firebase'e veri eklenirken hata oluştu:", error);
    res.status(500).json({ error: "Firebase'e veri eklenemedi." });
  }
});

// 📌 **Sunucu Başlatma**
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 API çalışıyor: http://localhost:${PORT}`);
});


