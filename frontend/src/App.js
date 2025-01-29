import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';



import Header from './MainCodes_Jsfiles/header';
import Main from './MainCodes_Jsfiles/Main';
import SignUp from './HeaderAction/Signup';
import Login from './HeaderAction/Login';
import About from './HeaderAction/About';

import MasterDashboard from './MasterJsfile/MasterDashboard';
import AddNewUser from './MasterJsfile/AddnewUser';
import UserManagement from './MasterJsfile/UserMangment';
import MasterStatistics from './MasterJsfile/Statistics';

import BusinessOwnerDashboard from './BusinessJsfile/BusinessOwnerDashboard';
import AddNewBusiness from './BusinessJsfile/AddNewBusiness';
import BusinessManagement from './BusinessJsfile/BuinessMangment';
import AddNewCampaign from './BusinessJsfile/AddnewCampain';
import CampaignManagement from './BusinessJsfile/CampainsMangment';

import CustomerDashboard from './Customerjsfile/CustomerDashboard';
import SearchCampaigns from './Customerjsfile/SearchCampains';
import JoinedCampaigns from './Customerjsfile/JoinedCampains';
import Wallet from './Customerjsfile/Wallet';



function App() {
  return (
    <Router>
      <AuthProvider>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />

          <Route path="/master-dashboard" element={<MasterDashboard />} />
          <Route path="/master-AddNewUser" element={<AddNewUser/>} />
          <Route path="/master-UsersMangment" element={<UserManagement/>} />
          <Route path="/master-statistics" element={<MasterStatistics/>} />

          <Route path="/BusinessOwner-dashboard" element={<BusinessOwnerDashboard/>} />
          <Route path="/BusinessOwner-AddnewBusiness" element={<AddNewBusiness/>} />
          <Route path="/BusinessOwner-BusinessManagement" element={<BusinessManagement/>} />
          <Route path="/BusinessOwner-AddNewCampaign" element={<AddNewCampaign/>} />
          <Route path="/BusinessOwner-CampainsMangment" element={<CampaignManagement/>} />

          <Route path="/Customer-dashboard" element={<CustomerDashboard/>} />
          <Route path="/Customer-SearchCampaigns" element={<SearchCampaigns/>} />
          <Route path="/Customer-JoinedCampaigns" element={<JoinedCampaigns/>} />
          <Route path="/Customer-Wallet" element={<Wallet/>} />
        </Routes>
      </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
