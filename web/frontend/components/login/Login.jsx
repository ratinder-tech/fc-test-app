// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
import "./style.css";
// import { useState, useEffect } from "react";
// import { Loader } from "../loader";
// import { ErrorModal } from "../errorModal";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";

export function Login(props) {
  const products = useAppQuery({
    url: "/api/products",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });

  console.log("products", products);

  return (
    <h1>Login</h1>
    // <div className="main-container">
    //     {isLoading && <Loader />}
    //     <ErrorModal showModal={openErrorModal} message={errorMessage} onConfirm={() => setOpenErrorModal(false)} />
    //     <div className="logo-image">
    //         <img src="https://portal-staging.fastcourier.com.au/assets/media/logos/fast-courier-dark.png" />
    //     </div>
    //     <div className="inner-container">
    //         <div className="heading1">
    //             Sign In to FastCourier
    //         </div>
    //         <div className="heading2">
    //             <span>New Here? </span>
    //             <Link to="/signup" style={{ textDecoration: "none" }}>
    //                 <span className="text-button"> Create an Account </span>
    //             </Link>
    //         </div>
    //         <div className="input-container">
    //             <div className="input-lebel">
    //                 <span> Email&nbsp;</span><span style={{ color: "red" }}> *</span>
    //             </div>
    //             <div className="input-field">
    //                 <input className="input-field-text" type="text" name="email" onChange={(e) => setEmail(e.target.value)} />
    //             </div>
    //         </div>
    //         <div className="heading-continer">
    //             <div className="heading-text1">
    //                 <span> Password&nbsp;</span><span style={{ color: "red" }}> *</span>
    //             </div>
    //             <div className="heading-text2">
    //                 <Link to="/forgotPassword" style={{ textDecoration: "none" }}>
    //                     <span className="text-button"> Forgot Password ? </span>
    //                 </Link>
    //             </div>
    //         </div>
    //         <div className="input-container">
    //             <div className="input-field">
    //                 <input className="input-field-text" type="password" name="password" onChange={(e) =>
    //                     setPassword(e.target.value)
    //                 } />
    //             </div>
    //         </div>
    //         <div className="input-container">
    //             <button type="submit" className="submit-btn" onClick={() => login()}>
    //                 Continue
    //             </button>
    //         </div>
    //     </div>
    // </div>
  );
}
