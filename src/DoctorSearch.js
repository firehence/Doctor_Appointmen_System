import React, { useState } from "react";

const DoctorSearch = () => {
  const specializations = [
    "Kadın Hastalıkları Ve Doğum",
    "Psikoloji",
    "Kulak Burun Boğaz",
    "Genel Cerrahi",
    "Ortopedi Ve Travmatoloji",
    "Diş Hekimi",
    "Dermatoloji",
    "Psikiyatri",
    "Beyin Ve Sinir Cerrahisi",
    "İç Hastalıkları",
    "Göz Hastalıkları",
    "Plastik Rekonstrüktif Ve Estetik Cerrahi",
    "Çocuk Sağlığı Ve Hastalıkları",
    "Üroloji",
    "Kardiyoloji",
    "Nöroloji",
    "Diyetisyen",
    "Kalp Ve Damar Cerrahisi",
    "Pratisyen",
    "Gastroenteroloji",
    "Fiziksel Tıp Ve Rehabilitasyon",
  ];

  const cities = ["Istanbul", "Ankara", "Izmir",  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya",  "Antalya", "Artvin",
    "Aydın", "Balıkesir", "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa",
    "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Edirne", "Elazığ", "Erzincan",
    "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay",
    "Isparta", "Mersin", "Kars", "Kastamonu", "Kayseri", "Kırklareli",
    "Kırşehir", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş",
    "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Rize", "Sakarya", "Samsun",
    "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa",
    "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale",
    "Batman", "Şırnak", "Bartın", "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis",
    "Osmaniye", "Düzce"];

  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleSearch = () => {
    if (selectedSpecialization && selectedCity) {
      alert(
        `Seçilen Uzmanlık: ${selectedSpecialization}, Şehir: ${selectedCity}`
      );
    } else {
      alert("Lütfen uzmanlık alanı ve şehir seçiniz.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Doktor Bul ve Randevu Al</h2>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
        {}
        <select
          value={selectedSpecialization}
          onChange={(e) => setSelectedSpecialization(e.target.value)}
          style={{
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Uzmanlık, ilgi alanı ve hastalık seç</option>
          {specializations.map((specialization, index) => (
            <option key={index} value={specialization}>
              {specialization}
            </option>
          ))}
        </select>

        {}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            padding: "10px",
            width: "200px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Şehir Seç</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>

        {}
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer",
          }}
        >
          Ara
        </button>
      </div>
    </div>
  );
};

export default DoctorSearch;
