import { useState } from 'react';
import reactLogo from "../assets/react.svg";
import "../ash.css";

function Dash() {
  const [patents, setPatents] = useState([
    { id: 1, title: 'Smart Widget', year: 2022, description: 'A device that automates home tasks.', ppt: 'https://example.com/smart_widget.ppt', psource: 'https://github.com/example/smart_widget' },
    { id: 2, title: 'Eco Car Engine', year: 2023, description: 'A fuel-efficient engine for electric cars.', ppt: 'https://example.com/eco_car_engine.ppt', psource: 'https://github.com/example/eco_car_engine' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newPatent, setNewPatent] = useState({ title: '', year: '', description: '', ppt: '', psource: '' });
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [profile, setProfile] = useState({
    name: 'Aswanth B',
    description: 'Second Year B.Tech IT student with a passion for innovation and technology. Eager to learn and contribute to cutting-edge projects.',
    profilePic: 'https://placehold.co/150x150/E0E0E0/333333?text=Profile' // Placeholder image
  });

  const handleAddPatent = () => {
    if (!newPatent.title || !newPatent.year) return;
    setPatents([
      ...patents,
      { id: patents.length + 1, ...newPatent }
    ]);
    setNewPatent({ title: '', year: '', description: '', ppt: '', psource: '' });
    setShowAdd(false);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile({ ...profile, profilePic: ev.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-container" style={{ fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header className="dashboard-header" style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '20px 30px', marginBottom: '20px', width: '100%', maxWidth: '1000px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Placeholder for reactLogo */}
        <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#61dafb', marginRight: '15px' }}>D</div>
        <h1 style={{ fontSize: '2.5rem', color: '#333', margin: 0 }}>Dashboard</h1>
      </header>
      <main className="dashboard-main" style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', padding: '30px', width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Profile Section */}
        <section className="profile-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
          <img src={profile.profilePic} alt="Profile" style={{ borderRadius: '50%', width: '150px', height: '150px', objectFit: 'cover', marginBottom: '15px', border: '3px solid #61dafb' }} />
          <label htmlFor="profile-pic-upload" style={{ cursor: 'pointer', color: '#007bff', marginBottom: '10px', fontWeight: 500 }}>
            Edit Photo
            <input id="profile-pic-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} />
          </label>
          <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '10px' }}>{profile.name}</h2>
          <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.5', maxWidth: '600px' }}>{profile.description}</p>
        </section>

        {/* Patents and other sections will be in a flex container now */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
          <section className="patents-section">
            <div className="patents-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>My Patents</h2>
              <button className="add-btn" onClick={() => setShowAdd(true)} title="Add Patent" style={{ background: '#007bff', color: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,123,255,0.3)' }}>+</button>
            </div>
            <ul className="patents-list" style={{ listStyle: 'none', padding: 0 }}>
              {patents.map((patent) => (
                <li key={patent.id} className="patent-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f7f7f7', borderRadius: '8px', margin: '10px 0', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => setSelectedPatent(patent)}>
                  <div style={{ flex: 1 }}>
                    <div className="patent-title" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#333' }}>{patent.title} <span className="patent-year" style={{ color: '#888' }}>({patent.year})</span></div>
                    <div className="patent-desc" style={{ color: '#555', marginTop: '4px' }}>{patent.description}</div>
                  </div>
                  <div style={{ marginLeft: '20px', display: 'flex', gap: '10px' }}>
                    <a href={patent.ppt || '#'} target="_blank" rel="noopener noreferrer" className="patent-link" style={{ color: '#007bff', textDecoration: 'underline' }}>PPT</a>
                    <a href={patent.psource || '#'} target="_blank" rel="noopener noreferrer" className="patent-link" style={{ color: '#28a745', textDecoration: 'underline' }}>Source</a>
                  </div>
                </li>
              ))}
            </ul>
            {showAdd && (
              <div className="add-patent-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div className="add-patent-content" style={{ background: '#fff', borderRadius: '10px', padding: '30px', minWidth: '300px', maxWidth: '90vw', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', position: 'relative' }}>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>Add New Patent</h3>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newPatent.title}
                    onChange={e => setNewPatent({ ...newPatent, title: e.target.value })}
                    style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={newPatent.year}
                    onChange={e => setNewPatent({ ...newPatent, year: e.target.value })}
                    style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
                  />
                  <textarea
                    placeholder="Description"
                    value={newPatent.description}
                    onChange={e => setNewPatent({ ...newPatent, description: e.target.value })}
                    style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', minHeight: '80px', boxSizing: 'border-box' }}
                  />
                  <input
                    type="url"
                    placeholder="PPT Link (optional)"
                    value={newPatent.ppt || ''}
                    onChange={e => setNewPatent({ ...newPatent, ppt: e.target.value })}
                    style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
                  />
                  <input
                    type="url"
                    placeholder="Source Link (optional)"
                    value={newPatent.psource || ''}
                    onChange={e => setNewPatent({ ...newPatent, psource: e.target.value })}
                    style={{ width: '100%', padding: '10px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
                  />
                  <div className="add-patent-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={handleAddPatent} style={{ background: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(40,167,69,0.3)' }}>Add</button>
                    <button onClick={() => setShowAdd(false)} style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(220,53,69,0.3)' }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
            {selectedPatent && (
              <div className="patent-modal" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setSelectedPatent(null)}>
                <div className="patent-modal-content" style={{ background: '#fff', borderRadius: '10px', padding: '32px', minWidth: '320px', maxWidth: '90vw', boxShadow: '0 4px 24px rgba(0,0,0,0.2)', position: 'relative' }} onClick={e => e.stopPropagation()}>
                  <button style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }} onClick={() => setSelectedPatent(null)}>&times;</button>
                  <h2 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '10px' }}>{selectedPatent.title} <span style={{ color: '#888', fontSize: '1rem' }}>({selectedPatent.year})</span></h2>
                  <p style={{ margin: '16px 0', color: '#555' }}>{selectedPatent.description}</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    <a href={selectedPatent.ppt || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>View PPT</a>
                    <a href={selectedPatent.psource || '#'} target="_blank" rel="noopener noreferrer" style={{ color: '#28a745', textDecoration: 'underline' }}>View Source</a>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
export default Dash;