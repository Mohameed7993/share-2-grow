import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import "./signUp.css";
import { useNavigate } from "react-router-dom";
import CustomModal from "../Modal";
import LoadingModal from "../LodadingModal";
import { useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function SignUp() {
  const [isFbSdkLoaded, setIsFbSdkLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [FUID, setFUID] = useState("");
  const nav = useNavigate();
  const { login } = useAuth();
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);

  useEffect(() => {
    const initializeFacebookSdk = () => {
      if (window.FB) {
        window.FB.init({
          appId: "1117167900005587",
          cookie: true,
          xfbml: true,
          version: "v13.0",
        });
        setIsFbSdkLoaded(true);
      } else {
        console.error("Facebook SDK is not available");
      }
    };

    if (window.FB === undefined) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeFacebookSdk();
      };
      document.body.appendChild(script);
    } else {
      initializeFacebookSdk();
    }

    return () => {
      const fbSdkScript = document.querySelector(
        'script[src="https://connect.facebook.net/en_US/sdk.js"]'
      );
      if (fbSdkScript) {
        fbSdkScript.remove();
      }
    };
  }, []);


  const handleFacebookLogin = () => {
    if (!isFbSdkLoaded) {
      console.error("Facebook SDK is not loaded yet");
      return;
    }

    window.FB.login(
      (response) => {
        if (response.authResponse) {
          const { accessToken, userID } = response.authResponse;

          fetch("http://localhost:4000/share2grow/facebook-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ accessToken, userID }),
          })
            .then((res) => res.json())
            .then((data) => {
              setFUID(data.user.id);
              alert("Logged in successfully!");
              if (data.user.created === 1) {
                setShowModal(true);
              } else {
                login(data.user.email, data.user.user_id);
                nav("/Customer-dashboard");
              }
            })
            .catch((err) => {
              console.error("Login failed:", err);
              alert("Login failed due to a network error");
            });
        } else {
          alert("Facebook login failed");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const handleModalSubmit = () => {
    setIsLoading(true);
    fetch("http://localhost:4000/share2grow/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, userId, FUID }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setIsLoading(false);
          console.log(data.email+"11"+ data.userId)
          login(email,userId);
          nav("/master-dashboard");
        } else {
          setIsLoading(false);
          alert("Failed to create user.");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.error("Error creating user:", err);
        alert("Error creating user.");
      });
    setShowModal(false);
  };

  // // Google login handler
  const handlemailLogin = async () => {
      alert("Coming Soon!");
      return;
    }
  
  return (
    <div className="Box">
      <div className="content-box">
        <h2>Sign Up</h2>
        <div className="signup-buttons">
          <button onClick={handleFacebookLogin} className="signup-btn facebook-btn">
            <FontAwesomeIcon icon={faFacebookF} className="icon" /> Sign up with Facebook
          </button>
          <button onClick={handlemailLogin} className="signup-btn google-btn">
            <FontAwesomeIcon icon={faGoogle} className="icon" /> Sign up with Google
          </button>
          <button onClick={handlemailLogin} className="signup-btn email-btn">
            Sign up with Email
          </button>
        </div>

        <CustomModal show={showModal} onClose={() => setShowModal(false)} title="Complete details for your account.">
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="userId">User ID:</label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your user ID"
            />
          </div>
          <button className="btn-close" onClick={handleModalSubmit}>
            Submit
          </button>
        </CustomModal>

        <LoadingModal show={isLoading} />
      </div>
    </div>
  );
}
