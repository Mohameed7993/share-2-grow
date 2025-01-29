import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
//import "../CustomerCssfile/CustomerDashboard.css";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";
import { useAuth } from "../context/AuthContext";

ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  Title
);

export default function CustomerDashboard() {
  // State to hold the fetched data
  const { currentUserUid } = useAuth();
  const [UserDetails,Setuserdetails] = useState("")
  const [activeCampaigns, setActiveCampaigns] = useState(0);
  const [WalletCards, setWalletCards] = useState(0);
  const [campaignPerformanceData, setCampaignPerformanceData] = useState({
    labels: [],
    datasets: [
      {
        label: "Points Earned",
        data: [],
        backgroundColor: "#4CAF50",
        borderWidth: 1,
      },
      {
        label: "Shares",
        data: [],
        backgroundColor: "#FF9800",
        borderWidth: 2,
      },
    ],
  });

  // Fetch data from the server
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:4000/share2grow/Customer-dashboard-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentUserUid }), // Send UID in the request body
        });

        if (response.ok) {
          const data = await response.json(); // Parse JSON response
          Setuserdetails(data);
          const campaigns = Array.isArray(data.joinedCampaigns) ? data.joinedCampaigns : [];
          console.log(data)

          // Set active campaigns for the customer
          setActiveCampaigns(data.joinedCampaigns.length); // Set active campaigns count
          
          // Set number cards in wallet accumulated by the customer
          setWalletCards(data.wallet.dsicount.length+data.wallet.cash.length);

          // Set campaign performance data
          setCampaignPerformanceData({
            labels: campaigns.map(campaign => campaign.campaignName +":"), // Use campaigns
           
            datasets: [
          
              {
                label: "Colected Shares",
                data: campaigns.map(campaign => campaign.collectedShares || 0 ), // Shares on the campaign
                backgroundColor: "#4CAF50",
                borderWidth: 10,
              },
            ],
          });
        } else {
          console.error("Error: Server responded with status", response.status);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchDashboardData();
  }, [currentUserUid]);

  const campaignPerformanceOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Campaign Performance",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Campaigns",
        },
      },
      y: {
        title: {
          display: true,
          text: "Engagement Metrics",
        },
      },
    },
  };

  return (
    <div className="business-owner-dashboard">
      {/* Row 1 */}
      <div className="row">
        <div className="card welcome-card">
          <h3>Hi,{`${UserDetails.name}`}!</h3>
          <p>Welcome back to Share2Grow. Here's your dashboard overview.</p>
        </div>
        </div>
      <div className="row">
        <div className="card summary-card">
          <h3>Joined Campaigns</h3>
          <p>{activeCampaigns}</p>
        </div>
        <div className="card summary-card">
          <h3>Cridts in Wallet</h3>
          <p>{WalletCards}</p>
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        <div className="card chart-card">
          <h4>Campaign Performance</h4>
          <Bar data={campaignPerformanceData} options={campaignPerformanceOptions} />
        </div>
        <div className="card info-card">
          <h4>Quick Links</h4>
          <ul>
            <li>
              <a href="/Customer-SearchCampaigns">View Active Campaigns</a>
            </li>
            <li>
              <a href="/Customer-JoinedCampaigns">View Joined Campaigns</a>
            </li>
            <li>
              <a href="/Customer-Wallet" >Wallet</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
