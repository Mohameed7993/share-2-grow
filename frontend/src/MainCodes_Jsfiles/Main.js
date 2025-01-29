import "../MainCodes_Cssfiles/Main.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import logoImage from "../Image/logo.png";  // Adjust the path accordingly

import Footer from "./footer";
export default function Main(){
///////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////
    const navigate = useNavigate();
    return(
        <div className = "box-main">
            
            <div className="main-Explain">
            <img src={logoImage} alt="Shared2Grow Logo" className="logo-img-main" />
            <p className="LogoText">Share2Grow </p>
                <p className="title-main">Empower Your Business with Share2Grow</p>

                <p className="grow-business">Grow your business organically with Share2Grow.
                Platform that enables you to engage customers and drive sales without the costs of traditional advertising.</p>
            </div>

            <div className="btn"> 
        <div className="LogIn-Btn">
          <button onClick={() => navigate("/login")}>
            <FontAwesomeIcon icon={faSignInAlt} /> Login
          </button> 
        </div>
        <div className="SignUp-Btn">
          <button onClick={() => navigate("/signup")}>
            <FontAwesomeIcon icon={faUserPlus} /> Sign Up
          </button> 
        </div>
      </div>
                <Footer/>
        </div>
    )
}