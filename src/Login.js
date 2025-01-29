import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, database } from "./firebase"; 
import { signInWithPopup } from "firebase/auth";
import { ref, get, child } from "firebase/database";
import { useUserContext } from "./UserContext"; 
import "./Login.css";

const Login = () => {
  const { setUserName, setUserRole } = useUserContext(); 
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      const clientsRef = ref(database, "clients");
      const doctorsRef = ref(database, "doctors");

      const clientSnapshot = await get(child(clientsRef, "/"));
      const doctorSnapshot = await get(child(doctorsRef, "/"));

      const clients = clientSnapshot.val();
      const doctors = doctorSnapshot.val();

      const client = clients
        ? Object.values(clients).find((c) => c.email === email)
        : null;

      const doctor = doctors
        ? Object.values(doctors).find((d) => d.email === email)
        : null;

      if (client) {
        updateLocalStorage(client.fullName, email, "client");
        alert("Giriş başarılı (Client)!");
        navigate("/");
      } else if (doctor) {
        updateLocalStorage(doctor.fullName, email, "doctor");
        alert("Giriş başarılı (Doctor)!");
        navigate("/");
      } else {
        alert("Bu e-posta ile kayıtlı kullanıcı bulunamadı.");
      }
    } catch (error) {
      console.error("Google Authentication failed:", error);
      alert("Authentication failed. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      alert("Lütfen telefon numarası ve şifre girin.");
      return;
    }

    const clientsRef = ref(database, "clients");
    const doctorsRef = ref(database, "doctors");

    const clientSnapshot = await get(child(clientsRef, "/"));
    const doctorSnapshot = await get(child(doctorsRef, "/"));

    const clients = clientSnapshot.val();
    const doctors = doctorSnapshot.val();

    const client = clients
      ? Object.values(clients).find(
          (c) => c.phoneNumber === phoneNumber && c.password === password
        )
      : null;

    const doctor = doctors
      ? Object.values(doctors).find(
          (d) => d.phoneNumber === phoneNumber && d.password === password
        )
      : null;

    if (client) {
      updateLocalStorage(client.fullName, client.email, "client");
      alert("Giriş başarılı (Client)!");
      navigate("/");
    } else if (doctor) {
      updateLocalStorage(doctor.fullName, doctor.email, "doctor");
      alert("Giriş başarılı (Doctor)!");
      navigate("/");
    } else {
      alert("Telefon numarası veya şifre yanlış.");
    }
  };


  const updateLocalStorage = (name, email, role) => {
    localStorage.clear(); 
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userRole", role);
    setUserName(name);
    setUserRole(role);
  };

  return (
    <div className="login-container">
      <h2>LOGIN</h2>
      <div className="google-auth">
        <button type="button" onClick={handleGoogleSignIn}>
          Google ile Giriş Yap
        </button>
      </div>
      <form onSubmit={handleLogin}>
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
          <label>Password:</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
