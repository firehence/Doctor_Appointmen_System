import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "./UserContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { userName, setUserName } = useUserContext();

  const handleLogout = () => {
    localStorage.removeItem("userName");
    setUserName("");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">doktorsitesi.com</div>
      <nav>
        {userName ? (
          <>
            <span className="welcome-message">Hoşgeldiniz, {userName}</span>
            <button className="logout-button" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </>
        ) : (
          <>
            <a href="/blog">Blog</a>
            <a href="/client-register">Kayıt Ol</a>
            <a href="/login">Giriş Yap</a>
            <button
              className="doctor-button"
              onClick={() => navigate("/register")}
            >
              Doktor musunuz?
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
