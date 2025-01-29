const redis = require("redis");
const nodemailer = require("nodemailer");

const client = redis.createClient();
client.connect();

// E-posta ayarları
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "aytunyuksek48@gmail.com",
    pass: "sjrl qjzi opnz sgnm",
  },
});

const consumeMessages = async () => {
  while (true) {
    try {
      // Kuyruktan bir mesaj al
      const message = await client.lPop("appointmentQueue");
      if (message) {
        const { clientEmail, doctorName, appointmentId } = JSON.parse(message);

        // E-posta gönder
        const mailOptions = {
          from: "aytunyuksek48@gmail.com",
          to: clientEmail,
          subject: `Doktorunuz ${doctorName} için değerlendirme yapın`,
          html: `
            <h3>Randevu sonrası değerlendirme</h3>
            <p>Lütfen doktorunuz ${doctorName} için değerlendirme yapın.</p>
            <a href="http://localhost:3000/rate?appointmentId=${appointmentId}">Değerlendirme Yap</a>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("E-posta gönderildi:", clientEmail);
      } else {
        // Kuyruk boşsa bekle
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("E-posta gönderim hatası:", error);
    }
  }
};

consumeMessages();
