import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

function AIAssistant() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your CampusAI academic assistant. How can I help you studying today?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { id: Date.now(), text: input, isUser: true };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Here is a summary on that: You asked about "${newMsg.text}". AI concepts generally involve mimicking human intelligence using mathematical models. Would you like me to elaborate on a specific area like neural networks or deep learning?`,
        isUser: false
      }]);
    }, 1000);
  };

  return (
    <div className="animate-slide-up" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>AI Academic Assistant</h1>
        <p className="text-muted" style={{ marginTop: '0.25rem' }}>Ask questions, generate summaries, or get roadmaps.</p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className="flex-align" style={{ alignItems: 'flex-start', alignSelf: msg.isUser ? 'flex-end' : 'flex-start', maxWidth: '80%', flexDirection: msg.isUser ? 'row-reverse' : 'row' }}>
              <div style={{ padding: '0.5rem', background: msg.isUser ? '#C7D2FE' : '#EEF2FF', color: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }}>
                {msg.isUser ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`message ${msg.isUser ? 'user' : 'ai'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSend} className="chat-input-wrapper">
          <input 
            type="text" 
            className="chat-input" 
            placeholder="Ask a question about your subject..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" className="chat-btn">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIAssistant;
