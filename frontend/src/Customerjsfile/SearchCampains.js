import React, { useEffect, useState } from "react";
import "../CustomerCssfile/SearchCampaigns.css";
import img from '../Image/logo.png';
import { useAuth } from "../context/AuthContext";


export default function SearchCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 8;
  const {currentUserUid } = useAuth();
  console.log(currentUserUid);

  useEffect(() => {
    // Fetch active campaigns from the server
    fetch("http://localhost:4000/share2grow/campaigns")
      .then((response) => response.json())
      .then((data) => {
        setCampaigns(data.campaigns);
        setFilteredCampaigns(data.campaigns);
      })
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    const filtered = campaigns.filter(
      (campaign) =>
        campaign.campaignName.includes(query) ||
        campaign.tags.some((tag) => tag.includes(query))
    );
    setFilteredCampaigns(filtered);
  };

  const handleJoinCampaign = (campaignId) => {
    const confirmed = window.confirm("Do you want to join this campaign?");
    if (confirmed) {
      // Handle joining the campaign
      fetch("http://localhost:4000/share2grow/campaigns/joinCampaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ campaignId, userId:currentUserUid }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("Successfully joined the campaign!");
          } else {
            alert("Failed to join the campaign.");
          }
        })
        .catch((error) => console.error("Error joining campaign:", error));
    }
  };

  // Get current campaigns for the current page
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

  // Pagination handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // CSS Grid for 3 cards per row
  const cardContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  };

  return (
    <div className="campaigns-container">
      {/* Page Title */}
      <h1 style={{color:"white"}} className="page-title">Search campaigns->Select you'rs -> Start share</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search campaigns by name or tag"
        className="search-bar"
        value={searchQuery}
        onChange={handleSearch}
      />

      {/* Campaigns List */}
      <div className="campaigns-list" style={cardContainerStyle}>
        {currentCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="card campaign-card"
            onClick={() => handleJoinCampaign(campaign.id)}
          >
            <div className="campaign-image-container">
              <img
                src={img}
                alt={campaign.campaignName}
                className="campaign-image"
              />
            </div>

            {/* Campaign Info */}
            <div className="campaign-info">
              <h3>{campaign.campaignName}</h3>
              <div className="campaign-details">
                <div className="share-info">
                  <p><strong>Type:</strong> {campaign.campaignType.type}</p>
                  <p><strong>Shares:</strong> {campaign.campaignType.shares}</p>
                  <p><strong>Value:</strong> {campaign.campaignType.value}</p>
                </div>
              </div>
            </div>

            {/* Join Button */}
            <div className="join-button-container">
              <button className="join-button">
                <span>➡️</span> Join Campaign
              </button>
            </div>

            {/* Hover Effects */}
            <div className="hover-info">
              <p><strong>Description:</strong> {campaign.description}</p>
              <p><strong>Business Name:</strong> {campaign.businessName}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredCampaigns.length / campaignsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
