import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import profileIcon from "../assets/icons/profile.svg";
import Foot from './Foot';

function Dash() {
  const [profile, setProfile] = useState({
    name: localStorage.getItem("profileName") || "GUEST",
    profilePic: "",
  });
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(profile.name);
  const [patents, setPatents] = useState([]);
  const [newPatent, setNewPatent] = useState({
    title: "",
    year: "",
    description: "",
    ppt: "",
    psource: "",
  });
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [account, setAccount] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchAccount = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    };
    fetchAccount();
  }, []);

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
        profilePic: "https://placehold.co/150x150/E0E0E0?text=Profile",
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
    <>
      <div className="dash">
        <main>
          <section>
            <div>
              <img
                src={profile.profilePic ? profile.profilePic : profileIcon}
                alt="Profile"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
              />
            </div>
            {editingName ? (
              <div>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
                <button onClick={handleNameSave}>Save</button>
                <button onClick={() => setEditingName(false)}>Cancel</button>
              </div>
            ) : (
              <h2>
                {profile.name}
                <button onClick={() => setEditingName(true)}>Edit</button>
              </h2>
            )}
          </section>
          {account && (
            <div style={{ marginTop: "16px", color: "#6e8efb", textAlign: "center" }}>
              Connected: {account}
            </div>
          )}
          <section>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPatent();
              }}
            >
              <input
                type="text"
                placeholder="Title"
                value={newPatent.title}
                onChange={(e) => setNewPatent({ ...newPatent, title: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Year"
                value={newPatent.year}
                onChange={(e) => setNewPatent({ ...newPatent, year: e.target.value })}
                required
              />
              <textarea
                placeholder="Description"
                value={newPatent.description}
                onChange={(e) => setNewPatent({ ...newPatent, description: e.target.value })}
              />
              <input
                type="url"
                placeholder="PPT Link (optional)"
                value={newPatent.ppt || ""}
                onChange={(e) => setNewPatent({ ...newPatent, ppt: e.target.value })}
              />
              <input
                type="url"
                placeholder="Source Link (optional)"
                value={newPatent.psource || ""}
                onChange={(e) => setNewPatent({ ...newPatent, psource: e.target.value })}
              />
              <button type="submit">Add</button>
              <button type="button" onClick={() => setNewPatent({ title: "", year: "", description: "", ppt: "", psource: "" })}>
                Clear
              </button>
            </form>
            <ul>
              {patents.map((patent) => (
                <li key={patent.id} onClick={() => setSelectedPatent(patent)}>
                  <div>
                    <div>
                      {patent.title} ({patent.year})
                    </div>
                    <div>{patent.description}</div>
                  </div>
                  <div>
                    <a href={patent.ppt || "#"} target="_blank" rel="noopener noreferrer">PPT</a>
                    <a href={patent.psource || "#"} target="_blank" rel="noopener noreferrer">Source</a>
                  </div>
                </li>
              ))}
            </ul>
            {selectedPatent && (
              <div onClick={() => setSelectedPatent(null)}>
                <div onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setSelectedPatent(null)}>&times;</button>
                  <h2>
                    {selectedPatent.title} ({selectedPatent.year})
                  </h2>
                  <p>{selectedPatent.description}</p>
                  <div>
                    <a href={selectedPatent.ppt || "#"} target="_blank" rel="noopener noreferrer">View PPT</a>
                    <a href={selectedPatent.psource || "#"} target="_blank" rel="noopener noreferrer">View Source</a>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
      <Foot />
    </>
  );
}
export default Dash;
