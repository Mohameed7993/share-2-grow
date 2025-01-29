import React, { useEffect, useState } from "react";
import '../BusinessCssfile/BusinessManagement.css';  // Adjusted CSS file for business management
import { useAuth } from "../context/AuthContext";
import { FaUserCircle, FaTrash, FaEllipsisH, FaBan, FaCheck } from 'react-icons/fa';
import CustomModal from "../Modal";

export default function BusinessManagement() {
    const [businesses, setBusinesses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");  // For search by business ID
    const { currentUserUid } = useAuth();  // Access current user's UID
    const [showModal, setShowModal] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            if (!currentUserUid) {
                console.error("currentUserUid is not available.");
                return; // Avoid fetching if UID is not available
            }
    
            try {
                const response = await fetch('http://localhost:4000/share2grow/getAllBusinesses', {
                    method: 'POST', // Ensure method is POST
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ currentUserUid }), // Send UID in the request body
                });
    
                if (response.ok) {
                    const data = await response.json(); // Parse JSON response
                    setBusinesses(data); // Update state with fetched businesses
                } else {
                    console.error("Failed to fetch businesses:", response.statusText);
                }
            } catch (error) {
                console.error("An error occurred while fetching businesses:", error);
            }
        };
    
        fetchBusinesses();
    }, [currentUserUid]); // Refetch businesses when currentUserUid changes
    
    const toggleBusinessStatus = async (businessName, currentStatus) => {
        const newStatus = currentStatus === 'suspended' ? 'Activated' : 'suspended';
    
        // Optimistic UI update
        setBusinesses(businesses.map(business =>
            business.businessName === businessName ? { ...business, status: newStatus } : business
        ));
    
        try {
            const response = await fetch(`http://localhost:4000/share2grow/updateBusinessStatus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ businessName, status: newStatus }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update business status on server');
            }
    
            console.log(`Business ${businessName} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating business status:', error);
    
            // Revert UI update if the API call fails
            setBusinesses(businesses.map(business =>
                business.businessName === businessName ? { ...business, status: currentStatus } : business
            ));
        }
    };
    

    // Filter businesses by ID or name
    const filteredBusinesses = businesses.filter((business) =>
        business.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteBusiness = async (businessId) => {
        try {
            const response = await fetch(`http://localhost:4000/share2grow/deleteBusiness/${businessId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBusinesses(prevBusinesses =>
                    prevBusinesses.filter(business => business.id !== businessId)
                );
                alert("Business deleted successfully!");
            } else {
                console.error("Failed to delete business:", response.statusText);
                alert("Failed to delete business.");
            }
        } catch (error) {
            console.error("Error deleting business:", error);
            alert("An error occurred while deleting the business.");
        }
    };

    const handleViewDetails = (business) => {
        
        setSelectedBusiness(business)
        setShowModal(true);
    };

    return (
        <div className="container1">
            <div className="business-management-container">
                <h2>Business Management</h2>

                {/* Search Bar */}
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search by ID or Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="business-table">
                    <div className="table-header">
                        <div className="col business-name">Business Name</div>
                        <div className="col business-location">Location</div>
                        <div className="col business-status">Status</div>
                        <div className="col actions-header">Actions</div>
                    </div>

                    {/* Table Rows */}
                    {filteredBusinesses.map((business) => (
                        <div className="table-row" key={business.id}>
                            <div className="col business-name">{business.businessName}</div>
                            <div className="col business-location">{business.location}</div>
                            <div className={`col business-status ${business.status}`}>
                                {business.status}
                            </div>
                            <div className="col user-actions">
                                <button
                                    className={`action-btn ${business.status}`}
                                    title={business.status === 'suspended' ? "Activated" : "suspended"}
                                    onClick={() => toggleBusinessStatus(business.businessName, business.status)}
                                >
                                    {business.status === 'suspended' ? <FaCheck /> : <FaBan />}
                                </button>
                                <button className="action-btn delete" title="Delete"
                                 onClick={() => handleDeleteBusiness(business.id)}>
                                    <FaTrash />
                                </button>
                                <button className="action-btn more" title="More"
                                onClick={() => handleViewDetails(business)}>
                                    <FaEllipsisH />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            <CustomModal 
  show={showModal}
  onClose={() => setShowModal(false)}
  title="Business Details"
>
  <>
    {selectedBusiness ? (
      <>
        <p><strong>Business Name:</strong> {selectedBusiness.businessName || "Unknown"}</p>
        <p><strong>Contact Email:</strong> {selectedBusiness.email || "No email provided"}</p>
        <p><strong>Phone Number:</strong> {selectedBusiness.phonenumber || "No phone number provided"}</p>
        <p><strong>Address:</strong> {selectedBusiness.location || "No address provided"}</p>
        <p><strong>Website:</strong> 
          {selectedBusiness.linkForBusinessWebsite ? (
            <a href={selectedBusiness.linkForBusinessWebsite} target="_blank" rel="noopener noreferrer">
              {selectedBusiness.linkForBusinessWebsite}
            </a>
          ) : "No website provided"}
        </p>
      </>
    ) : (
      <p>Loading...</p>
    )}
  </>
</CustomModal>



        </div>
    );
}
