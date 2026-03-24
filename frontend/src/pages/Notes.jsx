import React, { useState } from 'react';
import { Download, FileText, Search, UploadCloud, X, PlusCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const initialNotes = [
  { id: 1, title: 'Introduction to Neural Networks', subject: 'Machine Learning', date: '21 Mar 2026', size: '2.4 MB' },
  { id: 2, title: 'SQL Joins Cheat Sheet', subject: 'Database Systems', date: '19 Mar 2026', size: '1.1 MB' },
  { id: 3, title: 'Docker Containers Guide', subject: 'Cloud Computing', date: '15 Mar 2026', size: '3.8 MB' },
  { id: 4, title: 'React Hooks Deep Dive', subject: 'Web Development', date: '10 Mar 2026', size: '1.5 MB' },
];

function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState(initialNotes);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadMsg, setShowUploadMsg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Upload Form State
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', subject: '' });

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.subject) return;
    
    setIsUploading(true);
    
    // Simulate API upload
    setTimeout(() => {
      const newNote = {
        id: Date.now(),
        title: uploadData.title,
        subject: uploadData.subject,
        date: new Date().toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }),
        size: (Math.random() * 5 + 0.5).toFixed(1) + ' MB'
      };
      setNotes([newNote, ...notes]);
      setIsUploading(false);
      setShowUploadForm(false);
      setUploadData({ title: '', subject: '' });
      setShowUploadMsg(true);
      setTimeout(() => setShowUploadMsg(false), 3000);
    }, 1500);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Subject Notes Repository</h1>
        
        {(user?.role === 'teacher' || user?.role === 'hod') && (
          <button 
            className="btn flex-align" 
            style={{ width: 'auto', padding: '0.75rem 1.5rem', display: showUploadForm ? 'none' : 'flex' }}
            onClick={() => setShowUploadForm(true)}
          >
            <UploadCloud size={20} />
            <span>Upload New Material</span>
          </button>
        )}
      </div>

      {showUploadMsg && (
        <div style={{ background: '#DCFCE7', color: '#166534', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} />
          <span>Note uploaded successfully!</span>
        </div>
      )}

      {showUploadForm && (
        <div className="card glass-panel animate-slide-up" style={{ marginBottom: '2rem', border: '1px solid var(--primary-light)' }}>
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <h2 className="card-title" style={{ margin: 0 }}>Upload New Material</h2>
            <button onClick={() => setShowUploadForm(false)} style={{ background: 'transparent', color: 'var(--text-muted)' }}>
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleUploadSubmit} className="grid-2">
            <div className="input-group">
              <label>Document Title</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Chapter 4 Integration" 
                value={uploadData.title}
                onChange={e => setUploadData({...uploadData, title: e.target.value})}
                required
                disabled={isUploading}
              />
            </div>
            <div className="input-group">
              <label>Subject</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Calculus II" 
                value={uploadData.subject}
                onChange={e => setUploadData({...uploadData, subject: e.target.value})}
                required
                disabled={isUploading}
              />
            </div>
            
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Select File</label>
              <div style={{ border: '2px dashed var(--border-color)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius)', background: '#F8FAFC', cursor: 'pointer' }}>
                <PlusCircle size={32} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <p className="text-muted">Click to browse or drag and drop your PDF, DOCX, or PPTX file here</p>
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', width: 'auto', border: '1px solid var(--border-color)' }} onClick={() => setShowUploadForm(false)} disabled={isUploading}>Cancel</button>
              <button type="submit" className="btn flex-align" style={{ width: 'auto', padding: '0.75rem 2rem' }} disabled={isUploading}>
                {isUploading ? <Loader2 className="animate-spin" size={20} /> : <UploadCloud size={20} />}
                {isUploading ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-align glass-panel" style={{ padding: '0.85rem 1.25rem', borderRadius: '1rem', border: '1px solid var(--border-color)', width: '100%', maxWidth: '500px', marginBottom: '2rem' }}>
        <Search size={20} className="text-muted" />
        <input 
          type="text" 
          placeholder="Search notes by title or subject..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '1rem', color: 'var(--text-main)', marginLeft: '0.5rem' }} 
        />
      </div>

      <div className="grid-3">
        {filteredNotes.map(note => (
          <div key={note.id} className="card hoverable glass-panel flex-align" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem', padding: '1.5rem', transition: 'all 0.3s' }}>
            <div className="flex-between" style={{ width: '100%' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
                <FileText size={28} />
              </div>
              <span className="badge" style={{ background: '#F1F5F9', color: 'var(--text-main)', padding: '0.4rem 0.8rem', fontSize: '0.8rem', fontWeight: 600 }}>{note.subject}</span>
            </div>
            
            <div style={{ width: '100%' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{note.title}</h3>
              <div className="flex-between text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                <span>{note.date}</span>
                <span>{note.size}</span>
              </div>
            </div>

            <button className="btn flex-align" style={{ width: '100%', background: 'transparent', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', justifyContent: 'center', transition: 'all 0.2s', fontWeight: 600, marginTop: 'auto', border: '2px solid var(--primary-light)' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; }}>
              <Download size={18} /> Download PDF
            </button>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No notes found</h3>
            <p>We couldn't find any notes matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;
