import { useState, useEffect } from 'react';

export default function AskVelvet() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [displayedAnswer, setDisplayedAnswer] = useState('');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length) setVoices(availableVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    speechSynthesis.cancel();
    const velvetVoice = voices.find(v => v.name.includes("Google UK English Female")) || voices[0];
    const chunks = text.match(/[^.!?]+[.!?]+/g) || [text];

    let index = 0;
    const speakNext = () => {
      if (index >= chunks.length) return;
      const utterance = new SpeechSynthesisUtterance(chunks[index].trim());
      utterance.voice = velvetVoice;
      utterance.lang = 'en-GB';
      utterance.rate = 1;
      utterance.pitch = 1.1;
      utterance.onend = () => {
        index++;
        speakNext();
      };
      speechSynthesis.speak(utterance);
    };

    setTimeout(() => speakNext(), 100);
  };

  const typeOut = (text, callback) => {
    setDisplayedAnswer('');
    let index = 0;
    const typing = () => {
      if (index <= text.length) {
        setDisplayedAnswer(text.slice(0, index));
        index++;
        setTimeout(typing, 15);
      } else {
        callback();
      }
    };
    typing();
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;
    const newMessages = [...messages, { role: 'user', content: question }];
    setMessages(newMessages);
    setQuestion('');
    setLoading(true);

    try {
      const res = await fetch('/api/askvelvet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await res.json();
      const aiMessage = { role: 'assistant', content: data.answer };

      typeOut(data.answer, () => {
        speak(data.answer);
        setMessages((prev) => [...prev, aiMessage]);
      });
    } catch (err) {
      const errorMsg = { role: 'assistant', content: "Sorry, I wasn’t able to respond just now." };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-[#222] px-4 py-8 font-[Outfit] antialiased tracking-tight max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-[#3c3c3c] mb-2">Meet Velvet</h1>
      <p className="text-center text-[#7a7a7a] mb-6">Your elegant AI curtain advisor</p>

      <div className="border border-[#e6e2dd] rounded-xl bg-white shadow-sm h-[420px] p-5 overflow-y-auto space-y-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-400 to-purple-600 animate-pulse shadow-inner relative">
                  <div className="absolute inset-0 bg-white/20 blur-md rounded-full" />
                  <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">V</span>
                </div>
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-[85%] whitespace-pre-wrap text-[15px] leading-relaxed shadow-md transition ${
                msg.role === 'user'
                  ? 'bg-[#eae7e0] ml-auto text-right'
                  : 'bg-[#faf9f6] text-left border border-[#e5dfd2] backdrop-blur-sm shadow-[0_0_15px_rgba(255,192,203,0.15)]'
              }`}
            >
              <strong className="block mb-1 text-sm text-gray-500">
                {msg.role === 'user' ? 'You' : 'Velvet'}:
              </strong>
              {msg.role === 'assistant' && i === messages.length - 1 && loading
                ? displayedAnswer
                : msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-sm text-gray-400 mt-2 ml-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
            <span className="ml-2">Velvet is thinking…</span>
          </div>
        )}
      </div>

      <div className="mt-6">
        <textarea
          rows="2"
          className="w-full border border-[#ddd8d2] rounded-xl p-3 focus:outline-none focus:ring focus:border-[#c7bfae]"
          placeholder="Ask something like: 'What’s the best blackout curtain for a bedroom window?'"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        ></textarea>
        <button
          onClick={handleSubmit}
          className="w-full mt-3 bg-[#222] text-white py-2.5 rounded-xl hover:bg-[#444] transition-all font-medium tracking-wide shadow-md hover:shadow-lg"
          disabled={loading}
        >
          {loading ? 'Thinking…' : 'Ask Velvet'}
        </button>
      </div>
    </div>
  );
}
