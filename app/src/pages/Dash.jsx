import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../ash.css";

function Dash() {
  const [profile, setProfile] = useState({
    name: localStorage.getItem("profileName") || "Aswanth B",
    description:
      "Second Year B.Tech IT student with a passion for innovation and technology. Eager to learn and contribute to cutting-edge projects.",
    profilePic: "https://placehold.co/150x150/E0E0E0/333333?text=Profile",
  });
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.name);

  const [patents, setPatents] = useState([
    {
      id: 1,
      title: "Smart Widget",
      year: 2022,
      description: "A device that automates home tasks.",
      ppt: "https://example.com/smart_widget.ppt",
      psource: "https://github.com/example/smart_widget",
    },
    {
      id: 2,
      title: "Eco Car Engine",
      year: 2023,
      description: "A fuel-efficient engine for electric cars.",
      ppt: "https://example.com/eco_car_engine.ppt",
      psource: "https://github.com/example/eco_car_engine",
    },
  ]);
  const [newPatent, setNewPatent] = useState({
    title: "",
    year: "",
    description: "",
    ppt: "",
    psource: "",
  });
  const [selectedPatent, setSelectedPatent] = useState(null);
  const fileInputRef = useRef();

  const handleNameSave = () => {
    setProfile({ ...profile, name: newName });
    localStorage.setItem("profileName", newName);
    setEditingName(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile({ ...profile, profilePic: ev.target.result });
      };
      reader.readAsDataURL(file);
    } else {
      setProfile({
        ...profile,
        profilePic: "https://placehold.co/150x150/E0E0E0/333333?text=Profile",
      });
    }
  };

  const handleAddPatent = () => {
    if (!newPatent.title || !newPatent.year) return;
    setPatents([...patents, { id: patents.length + 1, ...newPatent }]);
    setNewPatent({
      title: "",
      year: "",
      description: "",
      ppt: "",
      psource: "",
    });
  };

  return (
    <div
      className="dashboard-container"
      style={{
        marginTop: "90px",
        minHeight: "calc(100vh - 90px)",
        animation: "fadeInDash 1s cubic-bezier(.68,-0.55,.27,1.55)",
        transition: "margin-top 0.6s cubic-bezier(.68,-0.55,.27,1.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#181A20", // dark background
      }}
    >
      <main
        className="dashboard-main"
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "24px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          padding: "32px 0 24px 0",
          background: "#23272F", // dark card
        }}
      >
        <section
          className="profile-section"
          style={{
            marginBottom: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "18px",
            padding: "24px 32px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.20)",
            background: "#23272F", // dark card
          }}
        >
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={profile.profilePic}
              alt="Profile"
              style={{
                borderRadius: "50%",
                width: 140,
                height: 140,
                objectFit: "cover",
                border: "4px solid #6e8efb",
                boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                transition: "box-shadow 0.3s",
                background: "#23272F",
              }}
            />
            <button
              className="profile-pic-edit"
              style={{
                position: "absolute",
                bottom: 8,
                right: 8,
                border: "none",
                borderRadius: "50%",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                fontSize: "1.2rem",
                zIndex: 2,
                background: "#6e8efb",
                color: "#fff"
              }}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              title="Change profile photo"
            >
              <span role="img" aria-label="edit">✏️</span>
            </button>
            <input
              ref={fileInputRef}
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleProfilePicChange}
            />
          </div>
          {editingName ? (
            <div style={{ marginTop: 18, textAlign: "center" }}>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                style={{
                  fontSize: "1.2rem",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  border: "1px solid #6e8efb",
                  background: "#181A20",
                  color: "#fff"
                }}
              />
              <button onClick={handleNameSave} style={{ marginLeft: 8, borderRadius: "6px", border: "none", padding: "4px 12px", background: "#6e8efb", color: "#fff" }}>Save</button>
              <button onClick={() => setEditingName(false)} style={{ marginLeft: 4, borderRadius: "6px", border: "none", padding: "4px 12px", background: "#23272F", color: "#6e8efb" }}>Cancel</button>
            </div>
          ) : (
            <h2 style={{ marginTop: 18, textAlign: "center", color: "#fff" }}>
              {profile.name}
              <button
                style={{
                  marginLeft: 8,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                  color: "#6e8efb"
                }}
                onClick={() => setEditingName(true)}
                title="Edit name"
              >
                ✏️
              </button>
            </h2>
          )}
          <p style={{ marginTop: 8, textAlign: "center", color: "#bdbdbd" }}>{profile.description}</p>
        </section>
        <section className="patents-section"
          style={{
            borderRadius: "18px",
            padding: "24px 32px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.20)",
            width: "100%",
            maxWidth: "600px",
            background: "#23272F"
          }}>
          <div className="patents-header" style={{ marginBottom: "18px" }}>
            <h2 style={{ color: "#fff" }}>My Patents</h2>
          </div>
          <form
            className="add-patent-content"
            style={{ marginBottom: "32px", width: "100%", maxWidth: "500px" }}
            onSubmit={e => {
              e.preventDefault();
              handleAddPatent();
            }}
          >
            <h3 style={{ color: "#6e8efb" }}>Add New Patent</h3>
            <input
              type="text"
              placeholder="Title"
              value={newPatent.title}
              onChange={e => setNewPatent({ ...newPatent, title: e.target.value })}
              required
              style={{ marginBottom: "10px", borderRadius: "8px", border: "1px solid #6e8efb", padding: "8px", background: "#181A20", color: "#fff" }}
            />
            <input
              type="number"
              placeholder="Year"
              value={newPatent.year}
              onChange={e => setNewPatent({ ...newPatent, year: e.target.value })}
              required
              style={{ marginBottom: "10px", borderRadius: "8px", border: "1px solid #6e8efb", padding: "8px", background: "#181A20", color: "#fff" }}
            />
            <textarea
              placeholder="Description"
              value={newPatent.description}
              onChange={e => setNewPatent({ ...newPatent, description: e.target.value })}
              style={{ marginBottom: "10px", borderRadius: "8px", border: "1px solid #6e8efb", padding: "8px", background: "#181A20", color: "#fff" }}
            />
            <input
              type="url"
              placeholder="PPT Link (optional)"
              value={newPatent.ppt || ""}
              onChange={e => setNewPatent({ ...newPatent, ppt: e.target.value })}
              style={{ marginBottom: "10px", borderRadius: "8px", border: "1px solid #6e8efb", padding: "8px", background: "#181A20", color: "#fff" }}
            />
            <input
              type="url"
              placeholder="Source Link (optional)"
              value={newPatent.psource || ""}
              onChange={e => setNewPatent({ ...newPatent, psource: e.target.value })}
              style={{ marginBottom: "10px", borderRadius: "8px", border: "1px solid #6e8efb", padding: "8px", background: "#181A20", color: "#fff" }}
            />
            <div className="add-patent-actions" style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              <button type="submit" style={{ borderRadius: "6px", border: "none", padding: "8px 18px", background: "#6e8efb", color: "#fff" }}>
                Add
              </button>
              <button
                type="button"
                style={{ borderRadius: "6px", border: "none", padding: "8px 18px", background: "#23272F", color: "#6e8efb" }}
                onClick={() =>
                  setNewPatent({
                    title: "",
                    year: "",
                    description: "",
                    ppt: "",
                    psource: "",
                  })
                }
              >
                Clear
              </button>
            </div>
          </form>
          <ul className="patents-list" style={{ padding: 0 }}>
            {patents.map((patent) => (
              <li
                key={patent.id}
                className="patent-item"
                onClick={() => setSelectedPatent(patent)}
                style={{
                  transition: "background 0.2s",
                  borderRadius: "10px",
                  marginBottom: "14px",
                  padding: "18px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#181A20",
                  color: "#fff"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="patent-title" style={{ fontWeight: 600, fontSize: "1.1rem", color: "#6e8efb" }}>
                    {patent.title}{" "}
                    <span className="patent-year" style={{ fontWeight: 400, color: "#bdbdbd" }}>
                      ({patent.year})
                    </span>
                  </div>
                  <div className="patent-desc" style={{ marginTop: "6px", color: "#bdbdbd" }}>
                    {patent.description}
                  </div>
                </div>
                <div style={{
                  marginLeft: "20px",
                  display: "flex",
                  gap: "10px",
                }}>
                  <a
                    href={patent.ppt || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="patent-link"
                    style={{ color: "#6e8efb", fontWeight: 500 }}
                  >
                    PPT
                  </a>
                  <a
                    href={patent.psource || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="patent-link"
                    style={{ color: "#6e8efb", fontWeight: 500 }}
                  >
                    Source
                  </a>
                </div>
              </li>
            ))}
          </ul>
          {selectedPatent && (
            <div
              className="patent-modal"
              onClick={() => setSelectedPatent(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
                background: "rgba(24,26,32,0.95)"
              }}
            >
              <div
                className="patent-modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                  borderRadius: "18px",
                  padding: "32px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
                  position: "relative",
                  minWidth: "320px",
                  maxWidth: "90vw",
                  background: "#23272F",
                  color: "#fff"
                }}
              >
                <button
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    cursor: "pointer",
                    color: "#bdbdbd"
                  }}
                  onClick={() => setSelectedPatent(null)}
                >
                  &times;
                </button>
                <h2>
                  {selectedPatent.title}{" "}
                  <span style={{ fontSize: "1rem", color: "#6e8efb" }}>
                    ({selectedPatent.year})
                  </span>
                </h2>
                <p style={{ margin: "16px 0", color: "#bdbdbd" }}>
                  {selectedPatent.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "12px"
                  }}
                >
                  <a
                    href={selectedPatent.ppt || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#6e8efb", fontWeight: 500 }}
                  >
                    View PPT
                  </a>
                  <a
                    href={selectedPatent.psource || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#6e8efb", fontWeight: 500 }}
                  >
                    View Source
                  </a>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      <Link to="/" className="home-btn" style={{
        marginBottom: "32px",
        marginTop: "16px",
        display: "inline-block",
        background: "#6e8efb",
        color: "#fff",
        borderRadius: "8px",
        padding: "10px 28px",
        fontWeight: 600,
        letterSpacing: "1px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.10)"
      }}>
        Home
      </Link>
      <style>
        {`
          @keyframes fadeInDash {
            0% { opacity: 0; transform: translateY(40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}
export default Dash;


