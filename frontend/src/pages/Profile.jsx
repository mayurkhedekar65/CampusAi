import React, { useState } from 'react';
import { Mail, GraduationCap, MapPin, Edit3, Settings, Shield } from 'lucide-react';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Mayur Khedekar',
    email: 'mayur.k@university.edu',
    course: 'B.Tech in Computer Science',
    year: '3rd Year',
    location: 'Mumbai, India'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="animate-slide-up">
      <h1 className="page-title">Student Profile</h1>

      <div className="grid-2">
        <div className="card">
          <div className="flex-between">
            <h2 className="card-title">Personal Details</h2>
            <button onClick={() => setIsEditing(!isEditing)} className="flex-align text-muted" style={{ background: 'transparent', color: 'var(--primary)' }}>
              <Edit3 size={18} /> {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '2rem 0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)' }}>
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{profile.name}</h2>
              <span className="badge success" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Active Student</span>
            </div>
          </div>

          {!isEditing ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div className="flex-align">
                <Mail size={18} className="text-muted" />
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{profile.email}</span>
              </div>
              <div className="flex-align">
                <GraduationCap size={18} className="text-muted" />
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{profile.course} — {profile.year}</span>
              </div>
              <div className="flex-align">
                <MapPin size={18} className="text-muted" />
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{profile.location}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input className="input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
              <input className="input" value={profile.course} onChange={e => setProfile({...profile, course: e.target.value})} />
              <button type="submit" className="btn">Save Changes</button>
            </form>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)', color: 'white', border: 'none' }}>
            <h2 className="card-title" style={{ color: 'white' }}>Academic Snapshot</h2>
            <div className="flex-between" style={{ marginTop: '1.5rem' }}>
              <div>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Current CGPA</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>8.9</h3>
              </div>
              <div>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Avg Attendance</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>82.5%</h3>
              </div>
              <div>
                <p style={{ opacity: 0.8, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Credits</p>
                <h3 style={{ fontSize: '2rem', fontWeight: 700 }}>120</h3>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Preferences</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              <div className="flex-between text-muted" style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                <span className="flex-align"><Settings size={18} /> Account Settings</span>
                <span style={{ cursor: 'pointer' }}>➔</span>
              </div>
              <div className="flex-between text-muted" style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '8px' }}>
                <span className="flex-align"><Shield size={18} /> Privacy & Security</span>
                <span style={{ cursor: 'pointer' }}>➔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
