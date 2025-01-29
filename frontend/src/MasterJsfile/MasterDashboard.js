import React, { useEffect, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import '../MasterCssfile/MasterDashboard.css'
import { useAuth } from "../context/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale, // Register the Category scale
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale, // Register scales explicitly
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export default function MasterDashboard() {
  const {currentUser,currentUserUid } = useAuth();
  const [campaigns, setCampaigns] = useState([]); // All campaigns
  const [activatedCampaigns, setActivatedCampaigns] = useState([]); // Active campaigns
  const [suspendedCampaigns, setSuspendedCampaigns] = useState([]); // Suspended campaigns
  const [Business, setBusiness] = useState([]); // All campaigns
  const [activatedBusiness, setActivatedBusiness] = useState([]); // Active Business
  const [suspendedBusiness, setSuspendedBusiness] = useState([]); // Suspended Business




  const gaugeOptions = {
    rotation: -90, // Start angle for the "gauge"
    circumference: 180, // Half-circle
    cutout: "90%", // Makes the gauge appear hollow
    plugins: {
      legend: { display: true },
    },
  };

  // Data for the line chart
  const lineData = {
    labels: ["Sun","Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Weekly Activity",
        data: [10, 20, 30, 40, 50, 60, 70],
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Days of the Week",
        },
      },
      y: {
        title: {
          display: true,
          text: "Activity Level",
        },
      },
    },
  };

  useEffect(() => {
    // Fetch campaigns from the server
    fetch("http://localhost:4000/share2grow/getAllCampaigns")
      .then((response) => response.json())
      .then((data) => {
        setCampaigns(data);

        // Filter campaigns by status
        const active = data.filter((campaign) => campaign.status === "Activated");
        const suspended = data.filter((campaign) => campaign.status === "suspended");

        // Update states
        setActivatedCampaigns(active);
        setSuspendedCampaigns(suspended);
      })
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  useEffect(() => {
    // Fetch campaigns from the server
    fetch("http://localhost:4000/share2grow/getAllBusiness")
      .then((response) => response.json())
      .then((data) => {
        setBusiness(data);

        // Filter campaigns by status
        const active = data.filter((campaign) => campaign.status === "Activated");
        const suspended = data.filter((campaign) => campaign.status === "suspended");

        // Update states
        setActivatedBusiness(active);
        setSuspendedBusiness(suspended);
      })
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);
  

  return (
    <div className="dashboard">
      {/* Row 1 */}
      <div className="row">
        <div className="card welcome-card">
          <h3>Hi,{`${currentUser.name}`}</h3>
          <p>Welcome back to Share2Grow. Here's your dashboard overview.</p>
        </div>
        <div className="card gauge-card">
          <h4>Activity Campaigns in System </h4>
          <Doughnut data={{
              labels: ["activated Campaigns", "suspended Campaigns"],
              datasets: [
                {
                  data: [activatedCampaigns.length,suspendedCampaigns.length], // Example: 70% progress
                  backgroundColor: ["#84CC16", "red"],
                  borderWidth: 0,
                },
              ],
            
          }} options={gaugeOptions} />
          <h4>Other Information</h4>
          <p>Total Campaigns: {`${campaigns.length}`}</p>
        </div>
        <div className="card info-card">
        <h4>Business</h4>
        <Doughnut  data={{
              labels: ["activated Business", "suspended Business"],
              datasets: [
                {
                  data: [activatedBusiness.length,suspendedBusiness.length], // Example: 70% progress
                  backgroundColor: ["#84CC16", "red"],
                  borderWidth: 0,
                },
              ],
            
          }}options={gaugeOptions} />
          <h4>Other Information</h4>
          <p>Total Business: {`${Business.length}`}</p>
         
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        <div className="card  info-card chart-card">
          <h4>Business details</h4>
          <Bar data={{    labels: Business.map((business) => business.businessName), // Business names as labels
    datasets: [
      {
        label: "Number of Campaigns",
        data: Business.map((business) => business.campaignsNumber), // Campaign counts
        borderColor: "#3B82F6",
        backgroundColor: "rgba(59, 130, 26, 0.5)",
      },
    ],}} options={lineOptions} />
        </div>
      </div>
    </div>
  ); 
}
