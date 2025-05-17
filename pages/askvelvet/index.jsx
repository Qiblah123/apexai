import { useState } from 'react';

export default function AskVelvet() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    const userMessage = { role: 'user', content: question };
    setMessages([...messages, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/askvelvet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      const aiMessage = { role: 'velvet', content: data.answer };
      setMessages((prev) => [...prev, aiMessage]);
      speak(data.answer);
    } catch (err) {
      const errorMsg = { role: 'velvet', content: "Sorry, I wasn’t able to respond just now." };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black p-4 max-w-2xl mx-auto font-sans">
      <h1 className="text-3xl font-bold text-center mb-1">Meet Velvet</h1>
      <p className="text-center text-gray-600 mb-6">Your luxury AI curtain advisor — here to guide you 24/7.</p>

      <div className="border rounded-md p-4 h-[400px] overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[85%] whitespace-pre-wrap ${
              msg.role === 'user' ? 'bg-indigo-100 ml-auto text-right' : 'bg-white border text-left'
            }`}
          >
            <strong>{msg.role === 'user' ? 'You' : 'Velvet'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">Velvet is thinking...</div>}
      </div>

      <div className="mt-6">
        <textarea
          rows="2"
          className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-indigo-400"
          placeholder="Ask something like: 'What’s the best blackout fabric for a loft bedroom?'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="w-full mt-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Ask Velvet'}
        </button>
      </div>
    </div>
  );
}
