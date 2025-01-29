import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Assuming you use context for user authentication
import { FaPlus } from 'react-icons/fa';
import '../BusinessCssfile/AddNewCampaign.css';  // Adjusted CSS file for business management


export default function AddNewCampaign() {
    const [businesses, setBusinesses] = useState([]);
    const [selectedBusiness, setSelectedBusiness] = useState("");
    const [campaignName, setCampaignName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [campaignType, setCampaignType] = useState("discount"); // Default type
    const [shares, setShares] = useState("");
    const [value, setValue] = useState(""); // Discount % or cash amount
    const { currentUserUid } = useAuth();

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await fetch('http://localhost:4000/share2grow/getAllBusinesses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ currentUserUid }),
                });

                const data = await response.json();

                if (response.ok) {
                    setBusinesses(data);
                } else {
                    console.error("Failed to fetch businesses:", data.message || response.statusText);
                }
            } catch (error) {
                console.error("An error occurred while fetching businesses:", error);
            }
        };

        fetchBusinesses();
    }, [currentUserUid]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedBusiness) {
            alert("Please select a business.");
            return;
        }

        if (!campaignName || !description || !tags || !shares || !value) {
            alert("Please fill in all fields.");
            return;
        }
       console.log(selectedBusiness.businessName)
        const newCampaign = {
            businessId: selectedBusiness.id,
            businessName:selectedBusiness.businessName,
            campaignName,
            description,
            joinedUsers: 0,
            totalShares: 0,
            sourceLink: businesses.find((b) => b.id === selectedBusiness.id)?.linkForBusinessWebsite || "",
            status: "Activated",
            createdAt: new Date().toISOString(),
            tags,
            campaignType: {
                type: campaignType,
                shares: Number(shares),
                value: Number(value),
            },
        };

        try {
            const response = await fetch('http://localhost:4000/share2grow/addNewCampaign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCampaign),
            });

            if (response.ok) {
                alert("Campaign created successfully!");
                setCampaignName("");
                setCampaignType("");
                setDescription("");
                setSelectedBusiness("");
                setValue("");
                setTags("");
                setShares(""); 
            } else {
                const errorData = await response.json();
                console.error("Error adding campaign:", errorData.message);
            }
        } catch (error) {
            console.error("An error occurred while adding the campaign:", error);
        }

    };

    return (
        <div className='Box'>
             
        <div className="content-box">
        <h2  style={{ marginBottom:'5%' }}>Add New Campaign</h2>
            <form onSubmit={handleSubmit} className="add-campaign-form">
                {/* Select Business */}
                <label>
                    Select Business:
             <select
                    onChange={(e) => setSelectedBusiness(JSON.parse(e.target.value))}
                    defaultValue=""
                >
                    <option value="" disabled>
                    Select a business
                    </option>
                    {businesses.map((business) => (
                    <option key={business.id} value={JSON.stringify(business)}>
                        {business.businessName}
                    </option>
                    ))}
                </select>
                </label>

                {/* Campaign Details */}
                <label>
                    Campaign Name:
                    <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </label>
                <label>
                    Tags (comma-separated):
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        required
                    />
                </label>

                {/* Campaign Type */}
                <label>
                    Campaign Type:
                    <div className="campaign-type-options">
                        <label>
                            <input
                                type="radio"
                                value="discount"
                                checked={campaignType === "discount"}
                                onChange={(e) => setCampaignType(e.target.value)}
                            />
                            Discount (%)
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="cash"
                                checked={campaignType === "cash"}
                                onChange={(e) => setCampaignType(e.target.value)}
                            />
                            Cash (amount)
                        </label>
                    </div>
                </label>

                <label>
                    Required Shares:
                    <input
                        type="number"
                        value={shares}
                        onChange={(e) => setShares(e.target.value)}
                        required
                    />
                </label>
                <label>
                    {campaignType === "discount" ? "Discount (%)" : "Cash Reward:"}
                    <input
                        type="number"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                    />
                </label>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary">
                     Add Campaign
                </button>
            </form>
        </div>
        </div>
    );
}
