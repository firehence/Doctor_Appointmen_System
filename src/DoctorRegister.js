import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ref, set, get, child } from "firebase/database";
import { auth, googleProvider, database } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { useUserContext } from "./UserContext"; 
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./DoctorRegister.css";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const { setUserName } = useUserContext(); 
  const [userEmail, setUserEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [areaOfInterest, setAreaOfInterest] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [availableHours, setAvailableHours] = useState({ start: "", end: "" });
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [town, setTown] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 39.92077, lng: 32.85411 }); // Ankara

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      const doctorsRef = ref(database, "doctors");
      const snapshot = await get(child(doctorsRef, "/"));
      const doctors = snapshot.val();

      const isEmailExists = doctors
        ? Object.values(doctors).some((doctor) => doctor.email === email)
        : false;

      if (isEmailExists) {
        alert("Bu e-posta adresi zaten kayıtlı. Lütfen farklı bir e-posta adresi kullanın.");
        return;
      }

      setUserEmail(email); 
    } catch (error) {
      console.error("Google Authentication failed:", error);
      alert("Authentication failed. Please try again.");
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setCoordinates(e.latlng);
      },
    });

    return <Marker position={coordinates}></Marker>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail || !fullName || !areaOfInterest || !address || !city) {
      alert("Lütfen gerekli tüm alanları doldurun!");
      return;
    }

    const doctorId = Date.now().toString(); 
    const doctorData = {
      fullName: fullName,
      email: userEmail,
      areaOfInterest: areaOfInterest,
      availableDays: availableDays,
      availableHours: availableHours,
      address: address,
      city: city,
      town: town,
      coordinates: coordinates,
    };

    set(ref(database, `doctors/${doctorId}`), doctorData)
      .then(() => {
        alert("Doktor başarıyla kaydedildi!");
        setUserName(fullName); 
        localStorage.setItem("userName", fullName);
        navigate("/"); 
      })
      .catch((error) => {
        console.error("Veri kaydedilirken bir hata oluştu:", error);
        alert("Bir hata oluştu: " + error.message);
      });
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h2>ADD ME AS DOCTOR</h2>
        <div className="google-auth">
          <label>Email:</label>
          <input
            type="email"
            placeholder="Authenticate with Google"
            value={userEmail}
            readOnly
          />
          <button type="button" onClick={handleGoogleSignIn}>
            Authenticate with Google
          </button>
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
          <label>Area of Interest:</label>
          <select
            value={areaOfInterest}
            onChange={(e) => setAreaOfInterest(e.target.value)}
          >
            <option value="">Select Area</option>
          <option value="Kadın Hastalıkları Ve Doğum">Orthopedics</option>
          <option value="Psikoloji">Psikoloji</option>
          <option value="Kulak Burun Boğaz">Kulak Burun Boğaz</option>
          <option value="Genel Cerrahi">Genel Cerrahi</option>
          <option value="Ortopedi Ve Travmatoloji">Ortopedi Ve Travmatoloji</option>
          <option value="Diş Hekimi">Diş Hekimi</option>
          <option value="Dermatoloji">Dermatoloji</option>
          <option value="Psikiyatri">Psikiyatri</option>
          <option value="Beyin Ve Sinir Cerrahisi">Beyin Ve Sinir Cerrahisi</option>
          <option value="İç Hastalıkları">İç Hastalıkları</option>
          <option value="Göz Hastalıkları">Göz Hastalıkları</option>
          <option value="Plastik Rekonstrüktif Ve Estetik Cerrahi">Plastik Rekonstrüktif Ve Estetik Cerrahi</option>
          <option value="Çocuk Sağlığı Ve Hastalıkları">Çocuk Sağlığı Ve Hastalıkları</option>
          <option value="Üroloji">Üroloji</option>
          <option value="Kardiyoloji">Kardiyoloji</option>
          <option value="Nöroloji">Nöroloji</option>
          <option value="Diyetisyen">Diyetisyen</option>
          <option value="Kalp Ve Damar Cerrahisi">Kalp Ve Damar Cerrahisi</option>
          <option value="Pratisyen">Pratisyen</option>
          <option value="Gastroenteroloji">Gastroenteroloji</option>
          <option value="Fiziksel Tıp Ve Rehabilitasyon">Fiziksel Tıp Ve Rehabilitasyon</option>
          <option value="Göğüs Hastalıkları">Göğüs Hastalıkları</option>
          <option value="Çocuk Ve Ergen Psikiyatrisi">Çocuk Ve Ergen Psikiyatrisi</option>
          <option value="Endokrinoloji Ve Metabolizma Hastalıkları">Endokrinoloji Ve Metabolizma Hastalıkları</option>
          <option value="Fizyoterapi Ve Rehabilitasyon">Fizyoterapi Ve Rehabilitasyon</option>
          <option value="Çocuk Cerrahisi">Çocuk Cerrahisi</option>
          <option value="Psikolojik Danışma Ve Rehberlik">Psikolojik Danışma Ve Rehberlik</option>
          <option value="Tıbbi Onkoloji">Tıbbi Onkoloji</option>
          <option value="Dil Ve Konuşma Terapisi">Dil Ve Konuşma Terapisi</option>
          <option value="Ortodonti">Ortodonti</option>
          <option value="Radyoloji">Radyoloji</option>
          <option value="Romatoloji">Romatoloji</option>
          <option value="Ağız Diş Ve Çene Cerrahisi">Ağız Diş Ve Çene Cerrahisi</option>
          <option value="Aile Hekimliği">Aile Hekimliği</option>
          <option value="Çocuk Nörolojisi">Çocuk Nörolojisi</option>
          <option value="Göğüs Cerrahisi">Göğüs Cerrahisi</option>
          <option value="Anesteziyoloji Ve Reanimasyon">Anesteziyoloji Ve Reanimasyon</option>
          <option value="Periodontoloji">Periodontoloji</option>
          <option value="Çocuk Alerjisi">Çocuk Alerjisi</option>
          <option value="Çocuk Diş Hekimliği (Pedodonti)">Çocuk Diş Hekimliği (Pedodonti)</option>
          <option value="Nefroloji">Nefroloji</option>
          <option value="Hematoloji">Hematoloji</option>
          <option value="Çocuk Kardiyolojisi">Çocuk Kardiyolojisi</option>
          <option value="Akupunktur">Akupunktur</option>
          <option value="Aile Danışmanlığı">Aile Danışmanlığı</option>
          <option value="Enfeksiyon Hastalıkları">Enfeksiyon Hastalıkları</option>
          <option value="Çocuk Endokrinolojisi">Çocuk Endokrinolojisi</option>
          <option value="Ozon Terapi">Ozon Terapi</option>
          <option value="Çocuk Gastroenteroloji Hepatoloji Ve Beslenme">Çocuk Gastroenteroloji Hepatoloji Ve Beslenme</option>
          <option value="Ergoterapi">Ergoterapi</option>
          <option value="Acil Tıp">Acil Tıp</option>
          <option value="El Cerrahisi">El Cerrahisi</option>
          <option value="Gastroenteroloji Cerrahisi">Gastroenteroloji Cerrahisi</option>
          <option value="Mezoterapi">Mezoterapi</option>
          <option value="Çocuk Nefrolojisi">Çocuk Nefrolojisi</option>
          <option value="Alerji Hastalıkları">Alerji Hastalıkları</option>
          <option value="Protetik Diş Tedavisi">Protetik Diş Tedavisi</option>
          <option value="Radyasyon Onkolojisi">Radyasyon Onkolojisi</option>
          <option value="Algoloji">Algoloji</option>
          <option value="Sertifikalı Medikal Estetik">Sertifikalı Medikal Estetik</option>
          <option value="Jinekolojik Onkoloji Cerrahisi">Jinekolojik Onkoloji Cerrahisi</option>
          <option value="Endodonti">Endodonti</option>
          <option value="Çocuk Gelişimi">Çocuk Gelişimi</option>
          <option value="Perinatoloji">Perinatoloji</option>
          <option value="Spor Hekimliği">Spor Hekimliği</option>
          <option value="Fitoterapi">Fitoterapi</option>
          <option value="Çocuk Hematolojisi">Çocuk Hematolojisi</option>
          <option value="Çocuk Göğüs Hastalıkları">Çocuk Göğüs Hastalıkları</option>
          <option value="Çocuk Ürolojisi">Çocuk Ürolojisi</option>
          <option value="Tıbbi Biyokimya">Tıbbi Biyokimya</option>
          <option value="Cerrahi Onkoloji">Cerrahi Onkoloji</option>
          <option value="Kupa Terapi (Hacamat)">Kupa Terapi (Hacamat)</option>
          <option value="Neonatoloji">Neonatoloji</option>
          <option value="Tıbbi Patoloji">Tıbbi Patoloji</option>
          <option value="Nükleer Tıp">Nükleer Tıp</option>
          <option value="Çocuk Romatolojisi">Çocuk Romatolojisi</option>
          <option value="Üreme Endokrinolojisi Ve İnfertilite">Üreme Endokrinolojisi Ve İnfertilite</option>
          <option value="Tıbbi Mikrobiyoloji">Tıbbi Mikrobiyoloji</option>
          <option value="Restoratif Diş Tedavisi">Restoratif Diş Tedavisi</option>
          <option value="Odyoloji (Dil, Konuşma Ve Ses Bozuklukları)">Odyoloji (Dil, Konuşma Ve Ses Bozuklukları)</option>
          <option value="Androloji">Androloji</option>
          <option value="Çocuk İmmünolojisi">Çocuk İmmünolojisi</option>
          <option value="İmmünoloji">İmmünoloji</option>
          <option value="Çocuk Onkolojisi">Çocuk Onkolojisi</option>
          <option value="Tıbbi Genetik">Tıbbi Genetik</option>
          <option value="Çocuk Enfeksiyon Hastalıkları">Çocuk Enfeksiyon Hastalıkları</option>
          <option value="Diş Hastalıkları Ve Tedavisi">Diş Hastalıkları Ve Tedavisi</option>
          <option value="Proloterapi">Proloterapi</option>
          <option value="Fizyoloji">Fizyoloji</option>
          <option value="Çocuk Metabolizma Hastalıkları">Çocuk Metabolizma Hastalıkları</option>
          <option value="Halk Sağlığı">Halk Sağlığı</option>
          <option value="Pedagoji">Pedagoji</option>
          <option value="Tıbbi Farmakoloji">Tıbbi Farmakoloji</option>
          <option value="Ağız Diş Ve Çene Radyolojisi">Ağız Diş Ve Çene Radyolojisi</option>
          <option value="Metabolik Cerrahi">Metabolik Cerrahi</option>
          <option value="Adli Tıp">Adli Tıp</option>
          <option value="Girişimsel Radyoloji">Girişimsel Radyoloji</option>
          <option value="Çocuk Kalp Ve Damar Cerrahisi">Çocuk Kalp Ve Damar Cerrahisi</option>


          </select>
        </div>
        <div>
          <label>Available Days:</label>
          <div className="checkbox-group">
            {days.map((day) => (
              <label key={day}>
                <input
                  type="checkbox"
                  value={day}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAvailableDays([...availableDays, day]);
                    } else {
                      setAvailableDays(
                        availableDays.filter((d) => d !== day)
                      );
                    }
                  }}
                />
                {day}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label>Available Hours:</label>
          <input
            type="time"
            value={availableHours.start}
            onChange={(e) =>
              setAvailableHours({ ...availableHours, start: e.target.value })
            }
          />
          to
          <input
            type="time"
            value={availableHours.end}
            onChange={(e) =>
              setAvailableHours({ ...availableHours, end: e.target.value })
            }
          />
        </div>
        <div>
          <label>Address:</label>
          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Select Location on Map:</label>
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </div>
        <div>
          <label>City:</label>
          <select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
      
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default DoctorRegister;
