import React, { useState } from "react";
import banner from "../assets/icons/pdf.svg";
import Foot from "./Foot";
import logo from "../assets/cube.svg";
import pdf1 from "./2.pdf";
import pdf2 from "./1.pdf";
import pdf3 from "./3.pdf";

// Patent data
const patentsData = [
  {
    id: 1,
    title: "CLAIM",
    author: "NEXBIT",
    description: "BLOCKCHAIN BACKED PROOF OF CONCEPT",
    dt: "2023-10-01 22:00:00",
    pdf: pdf1,
  },
  {
    id: 2,
    title: "AI+BLOCKCHAIN BASED INVENTORY MANAGEMENT",
    author: "HYPER",
    description:
      "Blockchain ledger to store inventory data, AI to analyze and predict inventory needs, and a user-friendly interface for real-time updates.",
    dt: "2023-10-01 10:00:00",
    pdf: pdf2,
  },
  {
    id: 3,
    title: "AGENTIC AI",
    author: "NEXBIT",
    description:
      "Make a hyperlocal Digital Twin of the Farm that uses AI to turn weekly smartphone photos into a living timeline of how healthy the crops are.",
    dt: "2023-10-01 5:00:00",
    pdf: pdf3,
  },
];

function Patent() {
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [filteredPatents, setFilteredPatents] = useState(patentsData);

  const handleCardClick = (patent) => {
    setSelectedPatent(patent);
  };

  const closePopup = () => {
    setSelectedPatent(null);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredResults = patentsData.filter(
      (patent) =>
        patent.title.toLowerCase().includes(query) ||
        patent.author.toLowerCase().includes(query) ||
        patent.description.toLowerCase().includes(query)
    );
    setFilteredPatents(filteredResults);
  };

  return (
    <>
      <div className="patents">
        <div className="p-head">
          <center>
            <img src={banner} id="banner" alt="Banner" />
          </center>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search patents..."
            onChange={handleSearch}
          />
        </div>

        {/* Dynamic Grid */}
        <div className="patent-grid">
          {filteredPatents.length > 0 ? (
            filteredPatents.map((patent) => (
              <div
                key={patent.id}
                className="patent-card"
                onClick={() => handleCardClick(patent)}
              >
                <img src={logo} id="log-pat" alt="Banner" />
                <h3>{patent.title}</h3>
                <p>
                  <strong>Author:</strong> {patent.author}
                </p>
                <em>{patent.dt}</em>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No patents found.
            </p>
          )}
        </div>

        {/* Popup Modal */}
        {selectedPatent && (
          <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closePopup}>
                close
              </button>
              <h2>{selectedPatent.title}</h2>
              <p>
                <strong>Author:</strong> {selectedPatent.author}
              </p>
              <p>{selectedPatent.description}</p>
              <iframe
                src={selectedPatent.pdf}
                width="100%"
                height="400px"
                title={selectedPatent.title}
              ></iframe>
            </div>
          </div>
        )}
      </div>
      <Foot />
    </>
  );
}

export default Patent;
