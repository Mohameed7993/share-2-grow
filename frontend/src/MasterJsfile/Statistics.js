import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo from "../Image/logo.png"; // Replace with your actual logo path
import "../MasterCssfile/MasterStatistics.css";

export default function MasterStatistics() {
  const [users, setUsers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  // Fetch Users
  useEffect(() => {
    fetch("http://localhost:4000/share2grow/getAllUsers")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Fetch Campaigns
  useEffect(() => {
    fetch("http://localhost:4000/share2grow/getAllCampaigns")
      .then((response) => response.json())
      .then((data) => setCampaigns(data))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  // Fetch Businesses
  useEffect(() => {
    fetch("http://localhost:4000/share2grow/getAllBusiness")
      .then((response) => response.json())
      .then((data) => setBusinesses(data))
      .catch((error) => console.error("Error fetching businesses:", error));
  }, []);

  // Function to generate a PDF report
  const generatePDF = (reportType, data, columns) => {
    const doc = new jsPDF();

    // Add logo to the top-left
    const imgWidth = 30;
    const imgHeight = 15;
    doc.addImage(logo, "PNG", 10, 10, imgWidth, imgHeight);

    // Add date to the top-right
    const currentDate = new Date().toLocaleDateString();
    doc.text(currentDate, 180, 20, { align: "right" });

    // Add report title
    doc.setFontSize(14);
    doc.text(`Report: ${reportType}`, 105, 40, { align: "center" });

    // Generate table with data
    doc.autoTable({
      startY: 50,
      head: [columns],
      body: data.map((item) => Object.values(item)),
    });

    // Add footer
    doc.setFontSize(10);
    doc.text(
      "All copies are saved for the Show2Grow system.",
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`${reportType}_Report.pdf`);
  };

  return (
    <div className="Box">
      <div className="container_mas">
        <h1>Master Statistics</h1>
        <p>
          Welcome to the Master Statistics page. Here, you can download detailed
          reports on Users, Businesses, and Campaigns in the system. Click on the
          respective buttons below to download the reports.
        </p>

        <div className="d-flex1 justify-content-around my-4">
          <button
            className="btn btn-primary"
            onClick={() =>
                generatePDF(
                  "Users",
                  users.map((user) => ({
                    userId: user.userId || "N/A",
                    name: user.name || "N/A",
                    joinedCampaigns: Array.isArray(user.joinedCampaigns)
                      ? user.joinedCampaigns.map((campaign) => campaign.campaignName || "N/A").join(", ")
                      : "No campaigns",
                    wallet: user.wallet
                      ? `Cash: ${Array.isArray(user.wallet.cash) ? user.wallet.cash.length : 0}, ` +
                        `Discount: ${Array.isArray(user.wallet.dsicount) ? user.wallet.dsicount.length : 0}`
                      : "No wallet details", // Handle missing or undefined wallet
                  })),
                  ["User ID", "Name", "Joined Campaigns", "Wallet"]
                )
              }
              
              
          >
            Download Users Report
          </button>

          <button
            className="btn btn-success"
            onClick={() =>
              generatePDF(
                "Businesses",
                businesses.map((business) => ({
                  businessName: business.businessName,
                  campaignsNumber: business.campaignsNumber,
                  linkForBusinessWebsite: business.linkForBusinessWebsite,
                  email: business.email,
                })),
                ["Business Name", "Number of Campaigns", "Website Link", "Email"]
              )
            }
          >
            Download Businesses Report
          </button>

          <button
            className="btn btn-warning"
            onClick={() =>
              generatePDF(
                "Campaigns",
                campaigns.map((campaign) => ({
                  campaignName: campaign.campaignName,
                  businessName: campaign.businessName,
                  campaignType: campaign.campaignType.type,
                  description: campaign.description,
                })),
                [
                  "Campaign Name",
                  "Business Name",
                  "Campaign Type",
                  "Description",
                ]
              )
            }
          >
            Download Campaigns Report
          </button>
        </div>
      </div>
    </div>
  );
}
