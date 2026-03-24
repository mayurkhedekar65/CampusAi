import React, { useState } from 'react';
import { Download, FileText, Search, UploadCloud } from 'lucide-react';

const notesData = [
  { id: 1, title: 'Introduction to Neural Networks', subject: 'Machine Learning', date: '21 Mar 2026', size: '2.4 MB' },
  { id: 2, title: 'SQL Joins Cheat Sheet', subject: 'Database Systems', date: '19 Mar 2026', size: '1.1 MB' },
  { id: 3, title: 'Docker Containers Guide', subject: 'Cloud Computing', date: '15 Mar 2026', size: '3.8 MB' },
  { id: 4, title: 'React Hooks Deep Dive', subject: 'Web Development', date: '10 Mar 2026', size: '1.5 MB' },
];

function Notes() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notesData.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-slide-up">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Study Notes</h1>
        <button className="btn flex-align" style={{ width: 'auto', padding: '0.65rem 1.25rem' }}>
          <UploadCloud size={18} />
          Upload Notes
        </button>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="flex-align" style={{ background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px' }}>
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search notes by title or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }} 
          />
        </div>
      </div>

      <div className="grid-3">
        {filteredNotes.map(note => (
          <div key={note.id} className="card hoverable flex-align" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <div className="flex-align">
              <div style={{ background: '#EEF2FF', color: 'var(--primary)', padding: '0.75rem', borderRadius: '8px' }}>
                <FileText size={24} />
              </div>
              <div>
                <span className="badge success" style={{ background: '#F1F5F9', color: 'var(--text-muted)' }}>{note.subject}</span>
              </div>
            </div>
            
            <div style={{ width: '100%' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{note.title}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>{note.date} • {note.size}</p>
            </div>

            <button className="flex-align" style={{ width: '100%', background: 'var(--primary)', color: 'white', padding: '0.65rem', borderRadius: '6px', justifyContent: 'center', transition: 'background 0.2s', fontWeight: 500, marginTop: 'auto' }}>
              <Download size={16} /> Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
