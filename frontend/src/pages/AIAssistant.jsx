import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Paperclip, X, BookOpen, CalendarCheck, Brain, FileText, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ─── Markdown Renderer ────────────────────────────────────────────────────────
function MarkdownMessage({ text }) {
  const render = (raw) => {
    const lines = raw.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Empty line
      if (line.trim() === '') { elements.push(<div key={i} style={{ height: '0.4rem' }} />); i++; continue; }

      // H2
      if (line.startsWith('## ')) {
        elements.push(<h3 key={i} style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', margin: '0.75rem 0 0.3rem', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.2rem' }}>{inlineFormat(line.slice(3))}</h3>);
        i++; continue;
      }
      // H3
      if (line.startsWith('### ')) {
        elements.push(<h4 key={i} style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', margin: '0.5rem 0 0.2rem' }}>{inlineFormat(line.slice(4))}</h4>);
        i++; continue;
      }

      // Code block
      if (line.startsWith('```')) {
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={i} style={{ background: '#1E1E2E', color: '#CDD6F4', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', overflowX: 'auto', margin: '0.5rem 0', fontFamily: 'monospace' }}>
            {codeLines.join('\n')}
          </pre>
        );
        i++; continue;
      }

      // Bullet list
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems = [];
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          listItems.push(<li key={i} style={{ marginBottom: '0.2rem', lineHeight: 1.6 }}>{inlineFormat(lines[i].slice(2))}</li>);
          i++;
        }
        elements.push(<ul key={`ul-${i}`} style={{ paddingLeft: '1.4rem', margin: '0.3rem 0' }}>{listItems}</ul>);
        continue;
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        const listItems = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          listItems.push(<li key={i} style={{ marginBottom: '0.25rem', lineHeight: 1.6 }}>{inlineFormat(lines[i].replace(/^\d+\.\s/, ''))}</li>);
          i++;
        }
        elements.push(<ol key={`ol-${i}`} style={{ paddingLeft: '1.4rem', margin: '0.3rem 0' }}>{listItems}</ol>);
        continue;
      }

      // Horizontal rule
      if (line.trim() === '---') {
        elements.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.75rem 0' }} />);
        i++; continue;
      }

      // Key Takeaway callout
      if (line.includes('💡')) {
        elements.push(
          <div key={i} style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)', border: '1px solid var(--primary-light)', borderRadius: '8px', padding: '0.75rem 1rem', margin: '0.5rem 0', fontSize: '0.9rem' }}>
            {inlineFormat(line)}
          </div>
        );
        i++; continue;
      }

      // Regular paragraph
      elements.push(<p key={i} style={{ margin: '0.15rem 0', lineHeight: 1.7 }}>{inlineFormat(line)}</p>);
      i++;
    }
    return elements;
  };

  const inlineFormat = (text) => {
    // Parse **bold**, *italic*, `code`
    const parts = [];
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
    let last = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) parts.push(text.slice(last, match.index));
      if (match[2]) parts.push(<strong key={match.index}>{match[2]}</strong>);
      else if (match[3]) parts.push(<em key={match.index}>{match[3]}</em>);
      else if (match[4]) parts.push(<code key={match.index} style={{ background: '#EEF2FF', color: '#4338CA', padding: '0.1rem 0.35rem', borderRadius: '4px', fontSize: '0.875em', fontFamily: 'monospace' }}>{match[4]}</code>);
      last = match.index + match[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts.length > 0 ? parts : text;
  };

  return <div style={{ fontSize: '0.93rem', color: 'var(--text-main)' }}>{render(text)}</div>;
}

// ─── Main Component ───────────────────────────────────────────────────────────
function AIAssistant() {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : 'Student';

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `## Hello, ${userName}! 👋\n\nI'm your **CampusAI Academic Assistant** — trained on your academic profile.\n\nI can help you with:\n- 📚 Explaining concepts from your subjects\n- 📊 Checking your attendance & performance\n- 📝 Summarizing uploaded notes or PDFs\n- 🎯 Creating personalized study plans\n\nWhat would you like to know today?`,
      isUser: false
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const handleSend = async (text, file = selectedFile) => {
    if (!text.trim() && !file) return;

    const displayText = file ? `${text.trim() || 'Summarize this document'} 📎 ${file.name}` : text;
    setMessages(prev => [...prev, { id: Date.now(), text: displayText, isUser: true }]);
    setInput('');
    setSelectedFile(null);
    setIsTyping(true);

    try {
      const token = localStorage.getItem('campusai_token');
      const formData = new FormData();
      formData.append('question', text.trim() || 'Summarize this document');
      if (file) formData.append('document', file);

      const res = await fetch('http://127.0.0.1:8001/api/ai/ask/', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: data.answer || 'I processed your request but received an empty response.',
          isUser: false
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: `## ⚠️ Error\n\n${data.error || 'Something went wrong. Please try again.'}`,
          isUser: false
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `## 🔌 Connection Error\n\nCouldn't reach the backend. Make sure the **Django server is running** on port 8001.`,
        isUser: false
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const onSubmit = (e) => { e.preventDefault(); handleSend(input); };

  const suggestions = [
    { icon: <CalendarCheck size={14} />, text: 'What is my current attendance?' },
    { icon: <GraduationCap size={14} />, text: 'How can I improve my CGPA?' },
    { icon: <Brain size={14} />, text: 'Explain my weakest subject' },
    { icon: <FileText size={14} />, text: 'Create a study plan for Finals' },
  ];

  return (
    <div className="animate-slide-up" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)', padding: '0.6rem', borderRadius: '0.75rem', color: 'white', boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h1 className="page-title" style={{ margin: 0, fontSize: '1.4rem' }}>AI Academic Assistant</h1>
            <p className="text-muted" style={{ marginTop: '0.1rem', fontSize: '0.83rem' }}>
              Personalized for <strong>{userName}</strong> · Powered by Llama 3.3 70B
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container glass-panel" style={{ flex: 1, border: '1px solid var(--primary-light)', boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Messages */}
        <div className="chat-messages" style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              flexDirection: msg.isUser ? 'row-reverse' : 'row',
              marginBottom: '1.25rem',
              maxWidth: '90%',
              alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
              marginLeft: msg.isUser ? 'auto' : '0',
            }}>
              {/* Avatar */}
              <div style={{
                padding: '0.45rem',
                background: msg.isUser ? 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)' : '#EEF2FF',
                color: msg.isUser ? 'white' : 'var(--primary)',
                borderRadius: '50%',
                flexShrink: 0,
                boxShadow: msg.isUser ? '0 4px 6px rgba(79,70,229,0.25)' : 'none'
              }}>
                {msg.isUser ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Bubble */}
              <div style={{
                background: msg.isUser ? 'var(--primary)' : 'var(--surface-color)',
                color: msg.isUser ? 'white' : 'var(--text-main)',
                border: msg.isUser ? 'none' : '1px solid var(--border-color)',
                borderRadius: msg.isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                padding: '0.85rem 1.2rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                fontSize: '0.93rem',
                lineHeight: 1.65,
                maxWidth: '100%',
              }}>
                {msg.isUser ? (
                  <span style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</span>
                ) : (
                  <MarkdownMessage text={msg.text} />
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.45rem', background: '#EEF2FF', color: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }}>
                <Bot size={18} />
              </div>
              <div style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '4px 18px 18px 18px', padding: '0.85rem 1.2rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                {[0, 0.2, 0.4].map((delay, i) => (
                  <span key={i} style={{ width: '7px', height: '7px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block', animation: `bounce 0.7s infinite alternate`, animationDelay: `${delay}s`, opacity: 0.7 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips */}
        <div style={{ padding: '0 1.25rem 0.75rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', flexWrap: 'nowrap' }}>
          {suggestions.map((sug, i) => (
            <button key={i} onClick={() => handleSend(sug.text)} disabled={isTyping}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#F1F5F9', border: '1px solid var(--border-color)', padding: '0.4rem 0.85rem', borderRadius: '2rem', fontSize: '0.78rem', color: 'var(--text-muted)', cursor: isTyping ? 'not-allowed' : 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0 }}
              onMouseEnter={e => { if (!isTyping) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = '#EEF2FF'; } }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = '#F1F5F9'; }}>
              {sug.icon}{sug.text}
            </button>
          ))}
        </div>

        {/* File preview */}
        {selectedFile && (
          <div style={{ padding: '0 1.25rem 0.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.85rem', background: '#EEF2FF', borderRadius: '8px', fontSize: '0.82rem', border: '1px solid var(--primary-light)', color: 'var(--primary)' }}>
              <Paperclip size={13} />
              <span style={{ fontWeight: 600 }}>{selectedFile.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({(selectedFile.size / 1024).toFixed(0)} KB)</span>
              <button onClick={() => setSelectedFile(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex' }}><X size={14} /></button>
            </div>
          </div>
        )}

        {/* Input form */}
        <form onSubmit={onSubmit} style={{ padding: '0.75rem 1.25rem 1rem', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', display: 'flex', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid var(--border-color)' }}>
          <label title="Attach PDF, DOCX, TXT" style={{ cursor: isTyping ? 'not-allowed' : 'pointer', padding: '0.5rem', color: selectedFile ? 'var(--primary)' : 'var(--text-muted)', transition: 'color 0.2s' }}>
            <Paperclip size={20} />
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }} disabled={isTyping} accept=".pdf,.docx,.doc,.txt,.pptx,.xlsx" />
          </label>
          <input
            type="text"
            className="chat-input"
            placeholder={selectedFile ? `Ask about "${selectedFile.name}"...` : 'Ask CampusAI anything...'}
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isTyping}
            style={{ padding: '0.85rem 1.25rem', fontSize: '0.95rem', flex: 1, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', borderRadius: '12px' }}
          />
          <button type="submit" className="chat-btn" disabled={isTyping || (!input.trim() && !selectedFile)} style={{ minWidth: '48px', height: '48px', borderRadius: '12px', opacity: (isTyping || (!input.trim() && !selectedFile)) ? 0.5 : 1 }}>
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}

export default AIAssistant;
