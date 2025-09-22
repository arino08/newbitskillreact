import React from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage, LoginPage, SignupPage } from "../components/Pages";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/login" element={<SignupPage/>} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
