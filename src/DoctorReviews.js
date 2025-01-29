import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import "./DoctorReviews.css";

const DoctorReviews = () => {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const [reviews, setReviews] = useState([]);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    if (doctorId) {
      const doctorRef = ref(database, `doctors/${doctorId}`);
      onValue(doctorRef, (snapshot) => {
        const doctorData = snapshot.val();
        if (doctorData) {
          setDoctorName(doctorData.fullName);
        }
      });

      const reviewsRef = ref(database, `reviews/${doctorId}`);
      onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setReviews(Object.values(data)); 
        } else {
          setReviews([]); 
        }
      });
    }
  }, [doctorId]);

  return (
    <div className="reviews-container">
      <h2>{doctorName} için Yorumlar</h2>
      {reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>
              <p className="review-text">"{review.comment}"</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-reviews">Henüz yorum yapılmamış.</p>
      )}
    </div>
  );
};

export default DoctorReviews;
