import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, database } from "./firebase";
import { signInWithPopup, signOut } from "firebase/auth"; 
import { ref, set, get, child } from "firebase/database";
import { useUserContext } from "./UserContext";
import "./ClientRegister.css";

const ClientRegister = () => {
  const { setUserName } = useUserContext();
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false);

  useEffect(() => {
    console.log("useEffect çalıştı!");
    localStorage.clear();
    console.log("LocalStorage sıfırlandı!");

    signOut(auth).then(() => {
      console.log("📌 Firebase oturumu kapatıldı!");
      setIsGoogleAuthenticated(false);
    }).catch((error) => {
      console.error("🔥 Firebase çıkış hatası:", error);
    });

    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Firebase'de oturum açık:", user.email);
        setUserEmail(user.email);
        setFullName(user.displayName || "");
        setIsGoogleAuthenticated(true);
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userName", user.displayName || "");
      } else {
        console.log("Firebase'de oturum açık değil.");
        setIsGoogleAuthenticated(false);
      }
    });
  }, []);

  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In başlatılıyor...");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Authentication sonucu:", result);

      const email = result.user.email;
      const name = result.user.displayName || "";

      console.log("Google'dan alınan email:", email);
      console.log("Google'dan alınan isim:", name);

      const clientsRef = ref(database, "clients");
      const snapshot = await get(child(clientsRef, "/"));
      const clients = snapshot.val();

      console.log("Firebase Clients:", clients);

      const isEmailExists = clients
        ? Object.values(clients).some((client) => client.email === email)
        : false;

      if (isEmailExists) {
        alert("Bu e-posta adresi zaten kayıtlı. Lütfen farklı bir e-posta adresi kullanın.");
        return;
      }

      setUserEmail(email);
      setFullName(name);
      setIsGoogleAuthenticated(true);
      console.log("Google Authentication başarılı! Buton gizlenmeli.");

      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
    } catch (error) {
      console.error("Google Authentication failed:", error);
      alert("Google ile giriş başarısız. Lütfen tekrar deneyin.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isGoogleAuthenticated) {
      alert("Lütfen önce Google ile giriş yapın.");
      return;
    }

    if (!fullName || !phoneNumber || !gender || !password || !confirmPassword) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }

    const clientId = Date.now().toString();
    const clientData = {
      fullName: fullName,
      email: userEmail,
      phoneNumber: phoneNumber,
      gender: gender,
      password: password,
      role: "client",
    };

    set(ref(database, `clients/${clientId}`), clientData)
      .then(() => {
        alert("Kayıt başarıyla tamamlandı!");
        setUserName(fullName);
        localStorage.setItem("userName", fullName);
        localStorage.setItem("userEmail", userEmail);
        localStorage.setItem("userRole", "client");

        navigate("/");
      })
      .catch((error) => {
        console.error("Firebase kayıt hatası:", error);
        alert("Kayıt sırasında hata oluştu: " + error.message);
      });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>CLIENT REGISTER</h2>

        {}
        {!isGoogleAuthenticated && (
          <div className="google-auth">
            <button type="button" onClick={handleGoogleSignIn} className="google-btn">
              Google ile Giriş Yap
            </button>
          </div>
        )}

        <div>
          <label>Email:</label>
          <input
            type="email"
            value={userEmail}
            readOnly
            placeholder="Google ile kayıt olun"
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Password (Again):</label>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={!isGoogleAuthenticated}>Register</button>
      </form>
    </div>
  );
};

export default ClientRegister;
