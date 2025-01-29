import React, { useEffect, useState } from "react";
import '../MasterCssfile/UserMangment.css';
import { FaUserCircle, FaTrash, FaEllipsisH, FaBan, FaCheck } from 'react-icons/fa';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [sortedBy, setSortedBy] = useState("date");  // Track sorting criteria
    const [searchTerm, setSearchTerm] = useState("");  // For search by ID

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/share2grow/getAllBusinessOwners');
                const data = await response.json();

                if (response.ok) {
                    setUsers(data); // Assuming `data` is an array of users from the backend
                } else {
                    console.error("Failed to fetch users:", data.message || response.statusText);
                }
            } catch (error) {
                console.error("An error occurred while fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Sort users by date or status
    const handleSort = (criteria) => {
        setSortedBy(criteria);
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (sortedBy === "date") {
            return new Date(b.createdAt) - new Date(a.createdAt);  // Sort by date (newest first)
        } else if (sortedBy === "status") {
            return a.status.localeCompare(b.status);  // Sort by status (alphabetical)
        }
        return 0;
    });

    // Filter users by ID
    const filteredUsers = sortedUsers.filter(user =>
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle suspend/activate user
    const toggleUserStatus = async (email, currentStatus) => {
        const newStatus = currentStatus === 'suspended' ? 'Activated' : 'suspended';


        // Optimistic UI update
        setUsers(users.map(user =>
            user.email === email ? { ...user, status: newStatus } : user
        ));

        try {
            const response = await fetch(`http://localhost:4000/share2grow/updateUserStatus`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user status on server');
            }

            console.log(`User ${email} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating user status:', error);

            // Revert UI update if the API call fails
            setUsers(users.map(user =>
                user.email === email ? { ...user, status: currentStatus } : user
            ));
        }
    };

    return (
        <div className="container1">
            <div className="user-management-container">
                <h2>User Management</h2>

                {/* Search Bar */}
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search by ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Sort Options */}
                <div className="sort-options">
                    <button onClick={() => handleSort("date")}>Sort by Date</button>
                    <button onClick={() => handleSort("status")}>Sort by Status</button>
                </div>

                <div className="user-table">
                    <div className="table-header">
                        <div className="col user-icon-header">#</div>
                        <div className="col">Name</div>
                        <div className="col">ID</div>
                        <div className="col">Status</div>
                        <div className="col">Businesses</div>
                        <div className="col">Join Date</div>
                        <div className="col actions-header">Actions</div>
                    </div>

                    {/* Table Rows */}
                    {filteredUsers.map((user) => (
                        <div className="table-row" key={user.id}>
                            <div className="col user-icon">
                                <FaUserCircle size={40} />
                            </div>
                            <div className="col user-name">
                                {user.fullname}
                            </div>
                            <div className="col user-id">
                                {user.id}
                            </div>
                            <div className={`col user-status ${user.status}`}>
                                {user.status}
                            </div>
                            <div className="col user-businesses">
                                {user.businessNumber}
                            </div>
                            <div className="col user-join-date">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            <div className="col user-actions">
                                <button
                                    className={`action-btn ${user.status}`}
                                    title={user.status === 'suspended' ? "Activated" : "suspended"}
                                    onClick={() => toggleUserStatus(user.email, user.status)}
                                >
                                    {user.status === 'suspended' ? <FaCheck /> : <FaBan />}
                                </button>
                                <button className="action-btn delete" title="Delete">
                                    <FaTrash />
                                </button>
                                <button className="action-btn more" title="More">
                                    <FaEllipsisH />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
