import React, { useEffect, useState } from "react";
import "../BusinessCssfile/CampaignsMangement.css"; // CSS file for campaign management
import { FaTrash, FaEllipsisH } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import CustomModal from "../Modal";

export default function CampaignManagement() {
    const [campaigns, setCampaigns] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortByShares, setSortByShares] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 6; // Show 6 rows per page
    const { currentUserUid } = useAuth();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await fetch("http://localhost:4000/share2grow/getAllCampaigns");
                if (response.ok) {
                    const data = await response.json();
                    setCampaigns(data);
                } else {
                    console.error("Failed to fetch campaigns:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        };

        const fetchBusinesses = async () => {
            try {
                const response = await fetch('http://localhost:4000/share2grow/getAllBusinesses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ currentUserUid }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setBusinesses(data);
                } else {
                    console.error("Failed to fetch businesses:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching businesses:", error);
            }
        };

        fetchCampaigns();
        fetchBusinesses();
    }, [currentUserUid]);

    const handleDeleteCampaign = async (campaignId) => {
        try {
            const response = await fetch(`http://localhost:4000/share2grow/deleteCampaign/${campaignId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setCampaigns((prevCampaigns) =>
                    prevCampaigns.filter((campaign) => campaign.id !== campaignId)
                );
                alert("Campaign deleted successfully!");
            } else {
                console.error("Failed to delete campaign:", response.statusText);
                alert("Failed to delete campaign.");
            }
        } catch (error) {
            console.error("Error deleting campaign:", error);
            alert("An error occurred while deleting the campaign.");
        }
    };

    const handleViewDetails = (campaign) => {
        setSelectedCampaign(campaign);
        setShowModal(true);
    };

    const filteredCampaigns = campaigns
        .filter((campaign) =>
            (selectedBusiness === "" || campaign.businessId === selectedBusiness) &&
            campaign.campaignName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => sortByShares ? b.totalShares - a.totalShares : 0);

    // Pagination Logic
    const totalPages = Math.ceil(filteredCampaigns.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + rowsPerPage);

    return (
        <div className="container2">
            <div className="campaign-management-container">
                <h2>Campaign Management</h2>

                {/* Filter by Business */}
                <div className="filter-container">
                    <label htmlFor="businessFilter">Filter by Business:</label>
                    <select
                        id="businessFilter"
                        value={selectedBusiness}
                        onChange={(e) => setSelectedBusiness(e.target.value)}
                    >
                        <option value="">All Businesses</option>
                        {businesses.map((business) => (
                            <option key={business.id} value={business.id}>
                                {business.businessName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort by Total Shares */}
                <div className="sort-container">
                    <label>
                        <input
                            type="checkbox"
                            checked={sortByShares}
                            onChange={() => setSortByShares(!sortByShares)}
                        />
                        Sort by Total Shares
                    </label>
                </div>

                {/* Search Bar */}
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search by Campaign Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="campaign-table">
                    <div className="table-header">
                        <div className="col campaign-name">Campaign Name</div>
                        <div className="col campaign-business">Business</div>
                        <div className="col campaign-shares">Total Shares</div>
                        <div className="col actions-header">Actions</div>
                    </div>

                    {/* Table Rows */}
                    {paginatedCampaigns.map((campaign) => (
                        <div className="table-row" key={campaign.id}>
                            <div className="col campaign-name">{campaign.campaignName}</div>
                            <div className="col campaign-business">
                                {businesses.find((b) => b.id === campaign.businessId)?.businessName || "Unknown"}
                            </div>
                            <div className="col campaign-shares">
                                {campaign.totalShares}
                            </div>
                            <div className="col campaign-actions">
                                <button
                                    className="action-btn delete"
                                    title="Delete"
                                    onClick={() => handleDeleteCampaign(campaign.id)}
                                >
                                    <FaTrash />
                                </button>
                                <button
                                    className="action-btn more"
                                    title="View Details"
                                    onClick={() => handleViewDetails(campaign)}
                                >
                                    <FaEllipsisH />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="pagination-controls">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            </div>

            <CustomModal
                show={showModal}
                onClose={() => setShowModal(false)}
                title="Campaign Details"
            >
                <>
                    {selectedCampaign ? (
                        <>
                            <p><strong>Name:</strong> {selectedCampaign.campaignName}</p>
                            <p><strong>Business:</strong> {businesses.find((b) => b.id === selectedCampaign.businessId)?.businessName || "Unknown"}</p>
                            <p><strong>Total Shares:</strong> {selectedCampaign.totalShares}</p>
                            <p><strong>Joined Users:</strong> {selectedCampaign.joinedUsers}</p>
                            <p><strong>Description:</strong> {selectedCampaign.description || "No description provided"}</p>
                            <p><strong>Details:</strong></p>
                            {selectedCampaign.campaignType.type === "discount" ? (
                                <p>
                                    This campaign offers a discount! After 
                                    <strong> {selectedCampaign.campaignType.shares} </strong> 
                                    shares, participants get a 
                                    <strong> {selectedCampaign.campaignType.value}% </strong> discount.
                                </p>
                            ) : selectedCampaign.campaignType.type === "cash" ? (
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
                </>
            </CustomModal>
        </div>
    );
}
