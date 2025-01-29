import React, { useState, useEffect } from "react";
import "../CustomerCssfile/Wallet.css"; // Import the CSS file for styles
import { useAuth } from "../context/AuthContext";

export default function Wallet() {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState([]);
  const { currentUserUid } = useAuth();

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch("http://localhost:4000/share2grow/getWalletDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: currentUserUid }),
        });

        const result = await response.json();
        if (result.success) {
          setWalletData(result.wallet);
        } else {
          console.error("Error fetching wallet details:", result.message);
        }
      } catch (error) {
        console.error("Server error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, [currentUserUid]);

  const handleWalletClick = async (credits) => {
    const fetchedCredits = await Promise.all(
      credits.map(async (credit) => {
        try {
          const response = await fetch("http://localhost:4000/share2grow/campaign/details", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ campaignId: credit.campainId }),
          });
          console.log(credit)
          console.log(credits)

          const result = await response.json();
          console.log(result)
          if (result.success) {
            return {
              businessName: result.campaign.businessName,
              campaignName: result.campaign.campaignName,
              value: credit.value,
            };
          }
          console.error(`Failed to fetch details for campaignId ${credit.campaignId}`);
          return null;
        } catch (error) {
          console.error("Error fetching campaign details:", error);
          return null;
        }
      })
    );

    setSelectedCredits(fetchedCredits.filter((credit) => credit !== null));
    setShowModal(true);
  };

  if (loading) {
    return <div className="wallet-loading">Loading wallet details...</div>;
  }

  if (!walletData) {
    return <div className="Box wallet-error">No wallet data available.</div>;
  }

  return (
    <div className="Box">
      <div className="wallet-container">
        <h1>Wallet Details</h1>
        <p>
          Welcome to your wallet page! Here you can manage and view your Cash and
          Discount Wallets. Hover over the wallets to see their details.
        </p>
        <div className="wallets">
          {/* Cash Wallet */}
          <div
            className="wallet cash-wallet"
            onClick={() => handleWalletClick(walletData.cash)}
            title="Click to see your credits"
          >
            <h2>Cash Wallet</h2>
            <p>Total Credits: {walletData.cash.length}</p>
          </div>

          {/* Discount Wallet */}
          <div
            className="wallet discount-wallet"
            onClick={() => handleWalletClick(walletData.dsicount)}
            title="Click to see your credits"
          >
            <h2>Discount Wallet</h2>
            <p>Total Discounts: {walletData.dsicount.length}</p>
          </div>
        </div>

        {/* Modal for Credit Details */}
        {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button className="close-modal" onClick={() => setShowModal(false)}>
        &times;
      </button>
      <h3>Your Credits:</h3>
      <div className="credits-container">
        {selectedCredits.map((credit, index) => {
          // Generate random 16-digit number
          const cardNumber = Array.from({ length: 16 }, () =>
            Math.floor(Math.random() * 9) + 1
          )
            .join("")
            .match(/.{1,4}/g) // Split into groups of 4
            .join(" ");

          // Generate random expiration date
          const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
          const year = String(Math.floor(Math.random() * (40 - 25 + 1)) + 25);

          return (
            <div key={index} className="card credit-card">
              <h3>{credit.businessName}</h3>
              <p>Campaign: {credit.campaignName}</p>
              <p>Value: {credit.value}</p>
              <p>Card Number: {cardNumber}</p>
              <p>Expiry Date: {month}/{year}</p>
              <h3>Visa</h3>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}
