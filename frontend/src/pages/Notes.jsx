import React, { useState, useEffect } from 'react';
import { Download, FileText, Search, UploadCloud, X, PlusCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadMsg, setShowUploadMsg] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);
  
  // Upload Form State
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', subject: '', file: null });

  useEffect(() => {
    const token = localStorage.getItem('campusai_token');
    
    // Fetch Notes
    fetch('http://127.0.0.1:8001/api/notes/', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(r => r.json())
    .then(data => { setNotes(data); setLoadingNotes(false); })
    .catch(e => { console.error('Error fetching notes', e); setLoadingNotes(false); });

    // Fetch Subjects for Dropdown
    if (user?.role === 'TEACHER' || user?.role === 'HOD') {
        const endpoint = user?.role === 'TEACHER' ? 'http://127.0.0.1:8001/api/academics/subjects/my_subjects/' : 'http://127.0.0.1:8001/api/academics/subjects/';
        fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` }})
        .then(r => r.json())
        .then(data => setSubjects(data))
        .catch(e => console.error('Error fetching subjects', e));
    }
  }, [user]);

  const filteredNotes = notes.filter(note => 
    (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (note.subject_name && note.subject_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadData.title || !uploadData.subject || !uploadData.file) {
      setShowUploadMsg('Please fill out all fields and attach a file.');
      setTimeout(() => setShowUploadMsg(''), 3000);
      return;
    }
    
    setIsUploading(true);
    const token = localStorage.getItem('campusai_token');
    
    const formData = new FormData();
    formData.append('title', uploadData.title);
    formData.append('subject', uploadData.subject);
    formData.append('file', uploadData.file);

    try {
      const res = await fetch('http://127.0.0.1:8001/api/notes/upload/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      
      if (res.ok) {
        const newNote = await res.json();
        setNotes([newNote, ...notes]);
        setShowUploadForm(false);
        setUploadData({ title: '', subject: '', file: null });
        setShowUploadMsg('Note uploaded successfully!');
      } else {
        const errData = await res.json();
        setShowUploadMsg('Failed to upload: ' + JSON.stringify(errData));
      }
    } catch (e) {
      setShowUploadMsg('Network error while uploading.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setShowUploadMsg(''), 3000);
    }
  };

  return (
    <div className="animate-slide-up">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Subject Notes Repository</h1>
        
        {(user?.role?.toLowerCase() === 'teacher' || user?.role?.toLowerCase() === 'hod') && (
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
        <div style={{ background: showUploadMsg.includes('success') ? '#DCFCE7' : '#FEE2E2', color: showUploadMsg.includes('success') ? '#166534' : '#991B1B', padding: '1rem', borderRadius: '0.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} />
          <span>{showUploadMsg}</span>
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
              <select 
                className="input" 
                value={uploadData.subject} 
                onChange={e => setUploadData({...uploadData, subject: e.target.value})}
                required
                disabled={isUploading}
              >
                <option value="">Select a Subject...</option>
                {subjects.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group" style={{ gridColumn: '1 / -1' }}>
              <label>Select File</label>
              <label htmlFor="note-file-upload" style={{ border: '2px dashed var(--border-color)', padding: '2rem', textAlign: 'center', borderRadius: 'var(--radius)', background: '#F8FAFC', cursor: 'pointer', display: 'block' }}>
                <PlusCircle size={32} color={uploadData.file ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 1rem auto' }} />
                <p className={uploadData.file ? 'text-primary' : 'text-muted'} style={{ fontWeight: uploadData.file ? 600 : 400 }}>
                  {uploadData.file ? `Selected: ${uploadData.file.name}` : 'Click to browse your PDF, DOCX, or PPTX file here'}
                </p>
                <input 
                  id="note-file-upload" 
                  type="file" 
                  style={{ display: 'none' }} 
                  onChange={e => setUploadData({...uploadData, file: e.target.files[0]})}
                />
              </label>
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
        {loadingNotes ? (
           <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '4rem 0' }}><Loader2 className="animate-spin" size={32} style={{ margin: '0 auto' }} /></div>
        ) : filteredNotes.map(note => (
          <div key={note.id} className="card hoverable glass-panel flex-align" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1.25rem', padding: '1.5rem', transition: 'all 0.3s' }}>
            <div className="flex-between" style={{ width: '100%' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
                <FileText size={28} />
              </div>
              <span className="badge" style={{ background: '#F1F5F9', color: 'var(--text-main)', padding: '0.4rem 0.8rem', fontSize: '0.8rem', fontWeight: 600 }}>{note.subject_name || note.subject}</span>
            </div>
            
            <div style={{ width: '100%' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem', lineHeight: 1.3 }}>{note.title}</h3>
              <div className="flex-between text-muted" style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                <span>{new Date(note.created_at || note.date).toLocaleDateString()}</span>
                <span>File</span>
              </div>
            </div>

            <a href={`http://127.0.0.1:8001${note.file}`} target="_blank" rel="noopener noreferrer" className="btn flex-align" style={{ width: '100%', background: 'transparent', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px', justifyContent: 'center', transition: 'all 0.2s', fontWeight: 600, marginTop: 'auto', border: '2px solid var(--primary-light)', textDecoration: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary-light)'; }}>
              <Download size={18} /> Download
            </a>
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
