import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AIAssistant() {
  const { user } = useAuth();
  const userName = user?.name ? user.name.split(' ')[0] : 'Student';
  
  const [messages, setMessages] = useState([
    { id: 1, text: `Hello ${userName}! I am your CampusAI academic assistant. How can I help you studying today?`, isUser: false }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    const newMsg = { id: Date.now(), text, isUser: true };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      let aiResponseText = `Here is a summary on that: You asked about "${newMsg.text}". AI concepts generally involve mimicking human intelligence using mathematical models. Would you like me to elaborate on a specific area like neural networks or deep learning?`;
      
      if (text.toLowerCase().includes('attendance')) {
        aiResponseText = "Your overall attendance is currently at 82.5%. You need to attend 3 more classes in Database Systems to reach the 75% safe margin.";
      } else if (text.toLowerCase().includes('exam') || text.toLowerCase().includes('schedule')) {
        aiResponseText = "You have 2 exams coming up next week: Machine Learning on Tuesday, and Cloud Computing on Thursday. Would you like me to generate a study plan?";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: aiResponseText,
        isUser: false
      }]);
    }, 1500);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSend(input);
  };

  const suggestions = [
    "Summarize my recent notes",
    "What is my current attendance?",
    "When is my next exam?",
    "Generate a study plan for Finals"
  ];

  return (
    <div className="animate-slide-up" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)', padding: '0.5rem', borderRadius: '0.75rem', color: 'white' }}>
          <Sparkles size={24} />
        </div>
        <div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '1.5rem' }}>AI Academic Assistant</h1>
          <p className="text-muted" style={{ marginTop: '0.15rem', fontSize: '0.9rem' }}>Powered by CampusAI to accelerate your learning.</p>
        </div>
      </div>

      <div className="chat-container glass-panel" style={{ flex: 1, border: '1px solid var(--primary-light)', boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.1)' }}>
        <div className="chat-messages" style={{ padding: '2rem' }}>
          {messages.map((msg) => (
            <div key={msg.id} className="flex-align" style={{ alignItems: 'flex-start', alignSelf: msg.isUser ? 'flex-end' : 'flex-start', maxWidth: '85%', flexDirection: msg.isUser ? 'row-reverse' : 'row', marginBottom: '0.5rem' }}>
              <div style={{ 
                padding: '0.5rem', 
                background: msg.isUser ? 'linear-gradient(135deg, var(--primary) 0%, #818CF8 100%)' : '#EEF2FF', 
                color: msg.isUser ? 'white' : 'var(--primary)', 
                borderRadius: '50%', 
                flexShrink: 0,
                boxShadow: msg.isUser ? '0 4px 6px rgba(79, 70, 229, 0.2)' : 'none'
              }}>
                {msg.isUser ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`message ${msg.isUser ? 'user' : 'ai'}`} style={{ 
                background: msg.isUser ? 'var(--primary)' : 'var(--surface-color)',
                border: msg.isUser ? 'none' : '1px solid var(--border-color)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
                fontSize: '0.95rem',
                lineHeight: 1.6
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex-align" style={{ alignItems: 'flex-start', alignSelf: 'flex-start', maxWidth: '85%', flexDirection: 'row', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.5rem', background: '#EEF2FF', color: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }}>
                <Bot size={20} />
              </div>
              <div className="message ai" style={{ background: 'var(--surface-color)', border: '1px solid var(--border-color)', display: 'flex', gap: '0.3rem', alignItems: 'center', height: '44px' }}>
                <span style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'slideUp 0.6s infinite alternate' }}></span>
                <span style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'slideUp 0.6s infinite alternate 0.2s' }}></span>
                <span style={{ width: '6px', height: '6px', background: 'var(--text-muted)', borderRadius: '50%', animation: 'slideUp 0.6s infinite alternate 0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ padding: '0 1.5rem 1rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', flexWrap: 'wrap' }}>
          {suggestions.map((sug, i) => (
            <button 
              key={i} 
              onClick={() => handleSend(sug)} 
              disabled={isTyping}
              style={{ background: '#F1F5F9', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: isTyping ? 'not-allowed' : 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
              onMouseEnter={e => { if(!isTyping) { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; } }}
              onMouseLeave={e => { if(!isTyping) { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; } }}
            >
              {sug}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="chat-input-wrapper" style={{ padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }}>
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ask CampusAI..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            style={{ padding: '1rem 1.5rem', fontSize: '1rem', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
          />
          <button type="submit" className="chat-btn" disabled={isTyping || !input.trim()} style={{ width: '52px', height: '52px', opacity: (isTyping || !input.trim()) ? 0.6 : 1 }}>
            {isTyping ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIAssistant;
