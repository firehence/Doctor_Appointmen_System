import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ref, update, get, push } from "firebase/database";
import { database } from "./firebase";
import "./RateDoctor.css"; 

const RateDoctor = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  useEffect(() => {
    if (appointmentId) {
      const appointmentRef = ref(database, `appointments/${appointmentId}`);
      get(appointmentRef).then((snapshot) => {
        const data = snapshot.val();
        if (data) {
          setDoctorName(data.doctorName);
          setDoctorId(data.doctorId || "unknown");
        }
      });
    }
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating < 1 || rating > 5) {
      alert("Lütfen 1 ile 5 arasında bir yıldız seçin.");
      return;
    }

    const reviewRef = ref(database, `reviews/${doctorId}`);
    const newReview = {
      doctorName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    try {
      await push(reviewRef, newReview);
      alert("Değerlendirmeniz kaydedildi!");
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Değerlendirme kaydedilemedi:", error);
    }
  };

  return (
    <div className="rate-doctor">
      <h2>{doctorName} için değerlendirme yapın</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Yıldız: </label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= rating ? "selected" : ""}`}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div>
          <label>Yorum: </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Doktor hakkında yorumunuzu yazın..."
          />
        </div>
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default RateDoctor;
