import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";

const DoctorRatings = ({ doctorName }) => {
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const ratingsRef = ref(database, "ratings");
    onValue(ratingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const doctorRatings = Object.values(data).filter(
          (rating) => rating.doctorName === doctorName
        );
        setRatings(doctorRatings);
      }
    });
  }, [doctorName]);

  return (
    <div>
      <h3>{doctorName} için Değerlendirmeler</h3>
      {ratings.length > 0 ? (
        ratings.map((rating, index) => (
          <div key={index}>
            <p>Yıldız: {rating.rating}</p>
            <p>Yorum: {rating.comment}</p>
          </div>
        ))
      ) : (
        <p>Henüz değerlendirme yapılmamış.</p>
      )}
    </div>
  );
};

export default DoctorRatings;
