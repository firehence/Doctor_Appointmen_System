import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import HomePage from "./HomePage";
import DoctorRegister from "./DoctorRegister";
import DoctorSearchResult from "./DoctorSearchResults";
import ClientRegister from "./ClientRegister";
import Header from "./Header";
import Login from "./Login";
import RateDoctor from "./RateDoctor";
import DoctorRatings from "./DoctorRatings";
import DoctorReviews from "./DoctorReviews"; 

function App() {
  return (
    <UserProvider>
      <Router>
        {}
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<DoctorRegister />} />
          <Route path="/search" element={<DoctorSearchResult />} />
          <Route path="/client-register" element={<ClientRegister />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rate" element={<RateDoctor />} />
          <Route path="/ratings/:doctorName" element={<DoctorRatings />} />
          <Route path="/reviews" element={<DoctorReviews />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
