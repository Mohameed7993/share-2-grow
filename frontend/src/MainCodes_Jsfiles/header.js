import "../MainCodes_Cssfiles/Header.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faThumbsUp,faSearch,faWallet, faBriefcaseMedical, faChartSimple, faContactCard, faGauge, faHome, faList, faRectangleAd, faSignIn, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { useState,useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons/faAddressBook";
import logoImage from "../Image/logo.png";  // Adjust the path accordingly


export default function Header() {
    const nav = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { logout, currentUser,currentUserUid } = useAuth();

console.log(currentUserUid);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        logout();
        console.log("User logged out");
        setDropdownOpen(false);
        nav('/');
    };

    return (
        <div className="container">
            <div className="logo">
            
               <img src={logoImage} alt="Shared2Grow Logo" className="logo-img" />
            </div>

            <nav className="nav">
                <ul className="nav-links">
                    {!currentUser && (
                        <>
                            <li><a href="/"><FontAwesomeIcon icon={faHome} size="xs" style={{ marginRight: '8px' }} />Home</a></li>
                            <li><a href="/signup"><FontAwesomeIcon icon={faUserPlus} size="xs" style={{ marginRight: '8px' }} />Sign Up</a></li>
                            <li><a href="/login"><FontAwesomeIcon icon={faSignIn} size="xs" style={{ marginRight: '8px' }} />Login</a></li>
                            <li><a href="/about"><FontAwesomeIcon icon={faAddressBook} size="xs" style={{ marginRight: '8px' }} />About</a></li>
                            <li><a href="#contact"><FontAwesomeIcon icon={faContactCard} size="xs" style={{ marginRight: '8px' }} />Contact</a></li>
                        </>
                    )}
                    {currentUser && currentUser.role === 10 && (
                        <>
                            <li><a href="/master-dashboard"><FontAwesomeIcon icon={faGauge} size="xs" style={{ marginRight: '8px' }} />Dashboard</a></li>
                            <li><a href="/master-AddNewUser"><FontAwesomeIcon icon={faUserPlus} size="xs" style={{ marginRight: '8px' }} />Add New User</a></li>
                            <li><a href="/master-UsersMangment"><FontAwesomeIcon icon={faList} size="xs" style={{ marginRight: '8px' }} />User Mangment</a></li>
                            <li><a href="/master-statistics"><FontAwesomeIcon icon={faChartSimple} size="xs" style={{ marginRight: '8px' }} />Statistics</a></li>
                        </>
                    )}
                      {currentUser && currentUser.role === 5 && (
                        <>
                            <li><a href="/BusinessOwner-dashboard"><FontAwesomeIcon icon={faGauge} size="xs" style={{ marginRight: '8px' }} />Dashboard</a></li>
                            <li><a href="/BusinessOwner-AddnewBusiness"><FontAwesomeIcon icon={faBriefcaseMedical} size="xs" style={{ marginRight: '8px' }} />Add New Business</a></li>
                            <li><a href="/BusinessOwner-AddNewCampaign"><FontAwesomeIcon icon={faRectangleAd} size="xs" style={{ marginRight: '8px' }} />Add New Campaign</a></li>
                            <li><a href="/BusinessOwner-BusinessManagement"><FontAwesomeIcon icon={faList} size="xs" style={{ marginRight: '8px' }} />Businesses Mangment</a></li>
                            <li><a href="/BusinessOwner-CampainsMangment"><FontAwesomeIcon icon={faList} size="xs" style={{ marginRight: '8px' }} />Campains Mangment</a></li>
                            
                        </>
                    )}
                        {currentUser && currentUser.role === 1 && (
                        <>
                            <li><a href="/Customer-dashboard"><FontAwesomeIcon icon={faGauge} size="xs" style={{ marginRight: '8px' }} />Dashboard</a></li>
                            <li><a href="/Customer-JoinedCampaigns"><FontAwesomeIcon icon={faThumbsUp} size="xs" style={{ marginRight: '8px' }} />Joined Campaigns</a></li>
                            <li><a href="/Customer-SearchCampaigns"><FontAwesomeIcon icon={faSearch} size="xs" style={{ marginRight: '8px' }} />Search Campaigns</a></li>
                            <li><a href="/Customer-Wallet"><FontAwesomeIcon icon={faWallet} size="xs" style={{ marginRight: '8px' }} />Wallet</a></li>
                            
                        </>
                    )}
                </ul>
            </nav>

            <div className="icons">
                <button className="icon-button">
                    <FontAwesomeIcon icon={faFacebook} size="2x" style={{ color: 'white' }} />
                </button>

                <button className="icon-button">
                    <FontAwesomeIcon icon={faInstagram} size="2x" style={{ color: 'white' }} />
                </button>

                <button className="icon-button">
                    <FontAwesomeIcon icon={faGithub} size="2x" style={{ color: 'white' }} />
                </button>
                {currentUser && (
                    <button className="icon-button" onClick={toggleDropdown}>
                        <FontAwesomeIcon icon={faUser} size="2x" style={{ color: 'white' }} />
                    </button>
                )}

                {dropdownOpen && (
                    <div className="dropdown-menu">
                        <ul>
                            <li onClick={handleLogout}>Log Out</li>
                            <li>Profile</li>
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
}
