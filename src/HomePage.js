import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Kullanıcı adını localStorage'dan alma
  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() || cityFilter) {
      const queryParams = new URLSearchParams();
      if (searchQuery.trim()) queryParams.append("query", searchQuery);
      if (cityFilter) queryParams.append("city", cityFilter);
      navigate(`/search?${queryParams.toString()}`);
    } else {
      alert("Lütfen bir arama terimi veya şehir seçin.");
    }
  };

  return (
    <div className="homepage">
      <main className="main-content">
        <h1>Doktor veya uzmandan anında yüz yüze veya online randevu al!</h1>
        <p>185.000 doktor, diş hekimi, diyetisyen, psikolog...</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Doktor, uzmanlık veya kurum adı"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="city-select"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">Şehrinizi Seçiniz</option>
            <option value="Istanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="Izmir">İzmir</option>
          </select>
          <button className="search-button" onClick={handleSearch}>
            Ara
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
