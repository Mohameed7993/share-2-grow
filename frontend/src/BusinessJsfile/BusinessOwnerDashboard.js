import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "../BusinessCssfile/BusinessOwnerDashboard.css";
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

export default function BusinessOwnerDashboard() {
  // State to hold the fetched data
  const { currentUserUid } = useAuth();
  const [activeBusinesses, setBusinesses] = useState(0);
  const [BusinessesallNumber,setBusinessesallNumber]=useState(0);
  const [activeCampaigns, setCampaigns] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [campaignPerformanceData, setCampaignPerformanceData] = useState({
    labels: [],
    datasets: [
      {
        label: "Clicks",
        data: [],
        backgroundColor: "#4CAF50",
        borderWidth: 1,
      },
      {
        label: "Shares",
        data: [],
        backgroundColor: "#FF9800",
        borderWidth: 1,
      },
    ],
  });

  // Fetch data from the server
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:4000/share2grow/Business-dashboard-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentUserUid }), // Send UID in the request body
        });

        if (response.ok) {
          const data = await response.json(); // Parse JSON response

          // Ensure that Business and campaigns are arrays, if not, set to empty arrays
          // const businesses = Array.isArray(data.Business) ? data.Business : [];
           const campaigns = Array.isArray(data.campaigns) ? data.campaigns : [];
          console.log()
          // Set active businesses and campaigns
          setBusinesses(data.businesses.filter(business => business.status === 'Activated').length); // Set number of businesses
          setBusinessesallNumber(data.businesses.length);
          setCampaigns(data.campaigns.length); // Set number of campaigns

          // Calculate total shares by summing up the shares of all campaigns
          const totalShares = campaigns.reduce((sum, campaign) => sum + (campaign.totalShares || 0), 0);
          setTotalShares(totalShares);
         

          setCampaignPerformanceData({
            labels: campaigns.map(campaign => campaign.campaignName), // Use campaigns instead of campaignPerformance
            datasets: [
              {
                label: "Clicks",
                data: campaigns.map(campaign => campaign.clicks || 0), // Check if clicks exists
                backgroundColor: "#4CAF50",
                borderWidth: 1,
              },
              {
                label: "Shares",
                data: campaigns.map(campaign => campaign.totalShares || 0), // Check if totalShares exists
                backgroundColor: "#FF9800",
                borderWidth: 1,
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
        <div className="card summary-card">
          <h3>Active Businesses</h3>
          <p>{activeBusinesses+"/"+BusinessesallNumber}</p>
        </div>
        <div className="card summary-card">
          <h3>Total Campaigns</h3>
          <p>{activeCampaigns}</p>
        </div>
        <div className="card summary-card">
          <h3>Total Shares</h3>
          <p>{totalShares}</p>
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
              <a href="/BusinessOwner-AddNewCampaign">Create New Campaign</a>
            </li>
            <li>
              <a href="/BusinessOwner-CampainsMangment">View All Campaigns</a>
            </li>
            <li>
              <a href="#" >View Earnings</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
