import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ref, onValue, push } from "firebase/database";
import "leaflet/dist/leaflet.css";
import { database } from "./firebase";
import "./DoctorSearchResult.css"; 

const DoctorSearchResult = () => {
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [ratings, setRatings] = useState({});
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  const query = new URLSearchParams(location.search).get("query")?.toLowerCase() || "";
  const selectedCity = new URLSearchParams(location.search).get("city") || "";

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedUser) setCurrentUser(storedUser);
    if (!storedEmail) {
      alert("Oturum süresi dolmuş olabilir. Lütfen tekrar giriş yapınız.");
    }
  }, []);

  useEffect(() => {
    const doctorsRef = ref(database, "doctors");
    onValue(doctorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const doctorsArray = Object.entries(data).map(([id, doc]) => ({ id, ...doc }));
        setDoctors(doctorsArray);
      }
    });
  }, []);

  useEffect(() => {
    doctors.forEach((doctor) => {
      const reviewsRef = ref(database, `reviews/${doctor.id}`);
      onValue(reviewsRef, (snapshot) => {
        const reviews = snapshot.val();
        if (reviews) {
          const ratingsArray = Object.values(reviews).map((r) => r.rating);
          const averageRating = ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length;
          setRatings((prev) => ({ ...prev, [doctor.id]: averageRating.toFixed(1) }));
        }
      });
    });
  }, [doctors]);

  useEffect(() => {
    const appointmentsRef = ref(database, "appointments");
    onValue(appointmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const appointmentsArray = Object.values(data).map((app) => ({
          doctorId: app.doctorId,
          day: app.day,
          time: app.time,
        }));
        setConfirmedAppointments(appointmentsArray);
      }
    });
  }, []);

  useEffect(() => {
    const results = doctors.filter(
      (doctor) =>
        (doctor.fullName?.toLowerCase().includes(query) ||
          doctor.areaOfInterest?.toLowerCase().includes(query)) &&
        (selectedCity === "" || doctor.city === selectedCity)
    );
    setFilteredDoctors(results);
  }, [query, selectedCity, doctors]);

  const handleAppointment = async (doctorId, doctorName, day, time) => {
    const clientEmail = localStorage.getItem("userEmail");

    if (!clientEmail) {
      alert("Kullanıcı e-posta bilgisi bulunamadı. Lütfen tekrar giriş yapınız.");
      return;
    }

    const confirmAppointment = window.confirm(
      `${day}, ${time} saatine randevu almak istediğinize emin misiniz?`
    );

    if (confirmAppointment) {
      const appointmentRef = ref(database, "appointments");

      const newAppointment = {
        clientEmail,
        clientName: localStorage.getItem("userName"),
        doctorId,
        doctorName,
        day,
        time,
      };

      try {
        const appointmentSnapshot = await push(appointmentRef, newAppointment);
        const appointmentId = appointmentSnapshot.key;

        alert("Randevu başarıyla oluşturuldu!");

       
        setConfirmedAppointments((prev) => [...prev, { doctorId, day, time }]);

        const response = await fetch("http://localhost:5000/api/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientEmail,
            clientName: localStorage.getItem("userName"),
            appointmentId,
            doctorId,
            doctorName,
            day,
            time,
          }),
        });

        if (!response.ok) {
          console.error("Randevu gönderilirken hata oluştu:", response.statusText);
        } else {
          const data = await response.json();
          console.log("Randevu API'ye başarıyla gönderildi:", data);
        }
      } catch (error) {
        console.error("Randevu oluşturulamadı:", error);
      }
    }
  };

  const generateTimeButtons = (doctorId, doctorName, day, start, end) => {
    const buttons = [];
    const startHour = parseInt(start.split(":")[0], 10);
    const endHour = parseInt(end.split(":")[0], 10);

    for (let i = startHour; i <= endHour; i++) {
      const time = `${i}:00`;
      const isConfirmed = confirmedAppointments.some(
        (appointment) =>
          appointment.doctorId === doctorId &&
          appointment.day === day &&
          appointment.time === time
      );

      buttons.push(
        <button
          key={`${day}-${i}`}
          className={`time-button ${isConfirmed ? "disabled" : ""}`}
          onClick={() => {
            if (!isConfirmed) handleAppointment(doctorId, doctorName, day, time);
          }}
          disabled={isConfirmed}
        >
          {time}
        </button>
      );
    }
    return <div className="time-buttons">{buttons}</div>;
  };

  return (
    <div className="doctor-search-result">
      <div className="search-results">
        <h1 className="title">Arama Sonuçları</h1>
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <h2 className="doctor-name">{doctor.fullName}</h2>
              <p><strong>Uzmanlık Alanı:</strong> {doctor.areaOfInterest}</p>
              <p><strong>Şehir:</strong> {doctor.city}</p>
              <p><strong>Adres:</strong> {doctor.address}</p>
              <p><strong>Ortalama Puan:</strong> {ratings[doctor.id] || "Henüz değerlendirme yok"}</p>

              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`star ${star <= (ratings[doctor.id] || 0) ? "selected" : ""}`}>
                    ★
                  </span>
                ))}
              </div>

              <Link to={`/reviews?doctorId=${doctor.id}`} className="reviews-link">
                Yorumlar
              </Link>

              <div className="availability">
                {doctor.availableDays.map((day) => (
                  <div key={day} className="day-schedule">
                    <p className="day-label">{day}:</p>
                    {generateTimeButtons(
                      doctor.id,
                      doctor.fullName,
                      day,
                      doctor.availableHours.start,
                      doctor.availableHours.end
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">Aramanızla eşleşen doktor bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorSearchResult;


