import { useState } from "react";
import PageInfo from "../pageinfo";
import '../MasterCssfile/AddnewUser.css'

export default function AddNewUser() {
    const [fullname, setFullname] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("Activated");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState(5); // Default role is 5
    const [businessNumber, setBusinessNumber] = useState(0); // Default BusinessNumber is 0
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false); // State to track success
    const [messageType, setMessageType] = useState(""); // State to track success or error message type
    const messagehelp = "This Page is for adding new Bussiness owner to our system!, after you adding him he can login into his account using his email and id as password!, then he can create his own campaign and start sharing!";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullname || !id || !email || !phoneNumber) {
            setError("All fields are required.");
            setMessageType("error");
            return;
        }

        // Create user object
        const newUser = {
            fullname,
            id,
            email,
            phoneNumber,
            role,
            businessNumber,
            status,
        };

        // Send data to the backend
        const response = await fetch('http://localhost:4000/share2grow/AddNewBussinessOwner', { // Replace with your backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
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
            setFullname("");
            setId("");
            setEmail("");
            setPhoneNumber("");
            setStatus("");
            setError("");
        } else {
            setError(data.message || "Failed to add user. Please try again.");
            setMessageType("error");
        }
    };

    return (
        <div className="Box">
            <PageInfo msg={messagehelp} />
            <div className="content-box">
                <h2>Add New User</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="fullname"
                        placeholder="Enter your fullname"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        id="id"
                        placeholder="Enter your ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="tel"
                        id="phoneNumber"
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                    <button className="loginbutton" type="submit">
                        Add User
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
                    User successfully added!
                </div>
            )}
        </div>
    );
}
