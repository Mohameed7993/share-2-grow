
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../CustomerCssfile/joinedCampaigns.css";
import CustomModal from "../Modal";

export default function JoinedCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const campaignsPerPage = 6;
  const { currentUserUid } = useAuth();

  useEffect(() => {
    // Fetch joined campaigns for the user
    fetch("http://localhost:4000/share2grow/user/joinedCampaigns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: currentUserUid }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCampaigns(data.campaigns);
        } else {
          alert(data.message || "Failed to fetch joined campaigns");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching joined campaigns:", error);
        setLoading(false);
      });
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Link copied to clipboard!");
  };

  const handleViewDetails = (campaignId) => {
    // Fetch campaign details from the server
    fetch(`http://localhost:4000/share2grow/campaign/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ campaignId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            console.log()
          setSelectedCampaign(data.campaign);
          setShowModal(true);
        } else {
          alert(data.message || "Failed to fetch campaign details");
        }
      })
      .catch((error) => {
        console.error("Error fetching campaign details:", error);
      });
  };

  const handleLeaveCampaign = (campaignId) => {
    if (window.confirm("Are you sure you want to leave this campaign?")) {
      alert(`You have left the campaign with ID: ${campaignId}`);
    }
  };

  // Pagination details
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div className="loading">Loading campaigns...</div>;
  }

  return (
    <div className="Box">
      <div className="joined-campaigns">
        <h2>Your Joined Campaigns</h2>
        {campaigns.length === 0 ? (
          <p>You haven't joined any campaigns yet.</p>
        ) : (
          <>
            <table className="campaign-table">
              <thead>
                <tr>
                  <th>Campaign Name</th>
                  <th>Joined Date</th>
                  <th>Collected Shares</th>
                  <th>Required Shares</th>
                  <th>Sublink</th>
                  
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCampaigns.map((campaign, index) => (
                  <tr key={index}>
                    <td><strong>{campaign.campaignName}</strong></td>
                    <td>{new Date(campaign.joinedDate).toLocaleDateString()}</td>
                    <td>{campaign.collectedShares}</td>
                    <td>{campaign.allShares}</td>
                    <td>
                      <a href={campaign.sublinks} target="_blank" rel="noopener noreferrer">
                        Sublink
                      </a>
                      <button
                        className="copy-button"
                        onClick={() => copyToClipboard(campaign.sublinks)}
                      >
                        Copy
                      </button>
                    </td>
                    
                    <td>
                      <button
                        className="action-button"
                        onClick={() => handleViewDetails(campaign.campaignId)}
                      >
                        View Details
                      </button>
                      <button
                        className="action-button leave"
                        onClick={() => handleLeaveCampaign(campaign.campaignId)}
                      >
                        Leave Campaign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`pagination-button ${currentPage === index + 1 ? "active" : ""}`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <CustomModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Campaign Details"
      >
        {selectedCampaign ? (
          <>
            <p><strong>Business Name:</strong> {selectedCampaign.businessName || "Unknown"}</p>
            <p><strong>Campain Status:</strong> {selectedCampaign.status || "Unknown"}</p>
            <p><strong>Description:</strong> {selectedCampaign.description || "No description provided"}</p>
            <p><strong>Details:</strong></p>
            {selectedCampaign.campaignType?.type === "discount" ? (
              <p>
                This campaign offers a discount! After 
                <strong> {selectedCampaign.campaignType.shares} </strong>
                shares, participants get a 
                <strong> {selectedCampaign.campaignType.value}% </strong> discount.
              </p>
            ) : selectedCampaign.campaignType?.type === "cash" ? (
              <p>
                This campaign offers a cash reward! After 
                <strong> {selectedCampaign.campaignType.shares} </strong>
                shares, participants earn 
                <strong> ${selectedCampaign.campaignType.value} </strong>.
              </p>
            ) : (
              <p>No additional details available for this campaign type.</p>
            )}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </CustomModal>
    </div>
  );
}
