import { useState } from "react";
import PageInfo from "../pageinfo";
import { useAuth } from "../context/AuthContext";

export default function AddNewBusiness() {
    const [businessName, setBusinessName] = useState("");
    const [location, setLocation] = useState("Online"); // Default to "Online"
    const [customLocation, setCustomLocation] = useState(""); // To handle custom location input
    const [linkForBusinessWebsite, setLinkForBusinessWebsite] = useState("");
    const [email, setEmail] = useState("");
    const [phonenumber, setphonenumber] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false); // State to track success
    const [messageType, setMessageType] = useState(""); // State to track success or error message type
    const { currentUserUid } = useAuth(); // Get the current user from AuthContext
    const messagehelp = "This Page is for adding new businesses to our system! Ensure the manager ID corresponds to an existing user. Businesses start with zero campaigns and total joined users.";

    const handleLocationChange = (e) => {
        if (e.target.value === "Online") {
            setCustomLocation(""); // Clear custom location if "Online" is selected
        }
        setLocation(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!businessName || !location || !linkForBusinessWebsite) {
            setError("All fields are required.");
            setMessageType("error");
            return;
        }

        

        // Determine final location value
        const finalLocation = location === "Custom" ? customLocation : location;

        // Create business object
        const newBusiness = {
            businessName,
            email,
            phonenumber,
            location: finalLocation,
            linkForBusinessWebsite,
            managerId: currentUserUid, // Use the UID from the logged-in user
            campaignsNumber: 0,
            totalJoinedUsers: 0,
        };

        // Send data to the backend
        try {
            const response = await fetch('http://localhost:4000/share2grow/AddNewBusiness', { // Replace with your backend URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBusiness),
            });

            const data = await response.json();
            if (response.ok) {
                // On success, set success state to true and set message type to success
                setSuccess(true);
                setMessageType("success");
                setTimeout(() => {
                    setSuccess(false);
                    setMessageType(""); // Reset message type after 5 seconds
                }, 5000);

                // Clear the form after successful submission
                setBusinessName("");
                setLocation("Online");
                setCustomLocation("");
                setEmail("");
                setphonenumber("")
                setLinkForBusinessWebsite("");
                setError("");
            } else {
                setError(data.message || "Failed to add business. Please try again.");
                setMessageType("error");
            }
        } catch (error) {
            setError("An error occurred while adding the business. Please try again.");
            setMessageType("error");
        }
    };

    return (
        <div className="Box">
            <PageInfo msg={messagehelp} />
            <div className="content-box">
                <h2>Add New Business</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="businessName"
                        placeholder="Enter Business Name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        required
                    />
                    <div className="location-field">
                        <label>
                            <input
                                type="radio"
                                value="Online"
                                checked={location === "Online"}
                                onChange={handleLocationChange}
                            />
                            Online
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="Custom"
                                checked={location === "Custom"}
                                onChange={handleLocationChange}
                            />
                            Enter Location
                        </label>
                        {location === "Custom" && (
                            <input
                                type="text"
                                id="customLocation"
                                placeholder="Enter Custom Location"
                                value={customLocation}
                                onChange={(e) => setCustomLocation(e.target.value)}
                                required
                            />
                        )}
                    </div>
                    <input
                        type="url"
                        id="linkForBusinessWebsite"
                        placeholder="Enter Business Website Link"
                        value={linkForBusinessWebsite}
                        onChange={(e) => setLinkForBusinessWebsite(e.target.value)}
                        required
                    />
                     <input
                        type="email"
                        id="email"
                        placeholder="Enter Business support email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                     <input
                        type="number"
                        id="phonenumber"
                        placeholder="Enter Business support phonenumber"
                        value={phonenumber}
                        onChange={(e) => setphonenumber(e.target.value)}
                        required
                    />
                    <button className="loginbutton" type="submit">
                        Add Business
                    </button>
                </form>
            </div>

            {error && (
                <div className={`alert ${messageType}`}>
                    {error}
                </div>
            )}

            {success && (
                <div className={`alert ${messageType}`}>
                    Business successfully added!
                </div>
            )}
        </div>
    );
}
