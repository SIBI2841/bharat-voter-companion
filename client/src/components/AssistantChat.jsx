import React, { useState, useRef } from 'react';
import { Send, Bot, User, CheckCircle2, XCircle, Lightbulb, Zap, LayoutList, History, ShieldAlert } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

function AssistantChat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      isJson: true,
      data: {
        type: 'explanation',
        content: 'Namaste! I am your Bharat Voter Companion 🇮🇳. I can help you understand the Indian election system, check your voter eligibility, or test your knowledge.',
        engagement: {
          next_action: 'What would you like to do?',
          suggestion: 'quiz'
        }
      }
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef();

  // State for Quizzes and Flashcards
  const [activeQuizAnswers, setActiveQuizAnswers] = useState({});
  const [flippedCards, setFlippedCards] = useState({});

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('bharatUserProfile');
    return saved ? JSON.parse(saved) : { level: 'Beginner', score: 0, quizzesTaken: 0 };
  });

  const saveProfile = (newProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem('bharatUserProfile', JSON.stringify(newProfile));
  };

  const handleSend = async (textOverride = null) => {
    const messageText = textOverride || input;
    if (!messageText.trim()) return;

    if (!captchaToken && !textOverride) {
      alert("Please complete the reCAPTCHA verification to send a message.");
      return;
    }

    if (!textOverride) {
      setInput('');
      // Reset captcha after successful submission
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptchaToken(null);
    }
    
    const userMessage = { id: Date.now(), sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // 1. Google Web Risk API Check (Check for malicious URLs in user input)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = messageText.match(urlRegex);
    if (urls && urls.length > 0) {
      try {
        const securityCheck = await fetch('/api/security/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urls[0] }) // check first URL
        });
        const secData = await securityCheck.json();
        if (secData.safe === false) {
          setMessages((prev) => [
            ...prev,
            { id: Date.now(), sender: 'bot', isJson: false, text: "🛡️ Security Alert: The link you provided has been flagged as unsafe by Google Web Risk API. I cannot process this request." }
          ]);
          setIsLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Security check failed, proceeding cautiously.");
      }
    }

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText, userProfile }),
      });
      
      const data = await response.json();
      
      let parsedData;
      let isJson = false;
      
      try {
        // Strip markdown code blocks if present
        const cleanJson = data.answer.replace(/```json\n?|```/g, '').trim();
        parsedData = JSON.parse(cleanJson);
        isJson = true;
      } catch (e) {
        parsedData = data.answer;
      }
      
      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now(), 
          sender: 'bot', 
          isJson: isJson,
          data: isJson ? parsedData : null,
          text: !isJson ? (parsedData || "Sorry, I couldn't process that.") : null 
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: 'bot', text: 'Error: Could not connect to the assistant API. Please ensure the server is running.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (messageId, qIndex, selectedOption, correctOption) => {
    const isCorrect = selectedOption === correctOption;
    setActiveQuizAnswers(prev => ({
      ...prev,
      [`${messageId}-${qIndex}`]: { selected: selectedOption, isCorrect }
    }));

    if (isCorrect) {
      const newScore = userProfile.score + 10;
      let newLevel = userProfile.level;
      if (newScore > 50) newLevel = 'Intermediate';
      if (newScore > 150) newLevel = 'Advanced';
      
      saveProfile({
        ...userProfile,
        score: newScore,
        level: newLevel,
        quizzesTaken: userProfile.quizzesTaken + 1
      });
    }
  };

  const toggleFlashcard = (messageId, cIndex) => {
    setFlippedCards(prev => ({
      ...prev,
      [`${messageId}-${cIndex}`]: !prev[`${messageId}-${cIndex}`]
    }));
  };

  const handleTTS = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find an Indian English voice for localization, fallback to default
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(voice => voice.lang.includes('en-IN'));
      if (indianVoice) {
        utterance.voice = indianVoice;
      }
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-speech is not supported in your browser.");
    }
  };

  const renderExplanation = (data) => (
    <div className="bot-explanation">
      <p>{data.content}</p>
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <button 
          className="suggestion-btn" 
          onClick={() => handleTTS(data.content)}
          title="Listen via Google Cloud TTS"
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)' }}
        >
          🔊 Listen
        </button>
      </div>
      {data.engagement && (
        <div className="engagement-box">
          <p className="engagement-prompt"><Zap size={16}/> {data.engagement.next_action}</p>
          <button 
            className="suggestion-btn"
            onClick={() => handleSend(data.engagement.suggestion === 'quiz' ? 'Give me a quiz' : 
                                      data.engagement.suggestion === 'flashcards' ? 'Show me flashcards' : 
                                      data.engagement.suggestion === 'timeline' ? 'Show timeline' : 
                                      'Tell me more')}
          >
            {data.engagement.suggestion === 'quiz' && <LayoutList size={16} />}
            {data.engagement.suggestion === 'flashcards' && <Lightbulb size={16} />}
            {data.engagement.suggestion === 'timeline' && <History size={16} />}
            {data.engagement.suggestion.replace('_', ' ').toUpperCase()}
          </button>
        </div>
      )}
    </div>
  );

  const renderQuiz = (data, messageId) => (
    <div className="quiz-container">
      <div className="quiz-header">
        <h4><LayoutList size={18}/> Quick Quiz</h4>
      </div>
      {data.questions.map((q, qIndex) => {
        const answerKey = `${messageId}-${qIndex}`;
        const answerState = activeQuizAnswers[answerKey];
        const isAnswered = !!answerState;

        return (
          <div key={qIndex} className="quiz-question-block">
            <p className="quiz-question">{qIndex + 1}. {q.question}</p>
            <div className="quiz-options">
              {q.options.map((opt, oIndex) => {
                let btnClass = "quiz-btn";
                if (isAnswered) {
                  if (opt === q.correct_answer) btnClass += " correct";
                  else if (opt === answerState.selected) btnClass += " incorrect";
                  else btnClass += " disabled";
                }
                
                return (
                  <button 
                    key={oIndex} 
                    className={btnClass}
                    onClick={() => !isAnswered && handleQuizAnswer(messageId, qIndex, opt, q.correct_answer)}
                    disabled={isAnswered}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className={`quiz-explanation ${answerState.isCorrect ? 'success' : 'error'}`}>
                <p>
                  {answerState.isCorrect ? <CheckCircle2 size={16}/> : <XCircle size={16}/>}
                  <strong>{answerState.isCorrect ? ' Correct!' : ' Incorrect.'}</strong> {q.explanation}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderFlashcards = (data, messageId) => (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <h4><Lightbulb size={18}/> Flashcards</h4>
        <span className="swipe-hint">Click to flip</span>
      </div>
      <div className="flashcards-scroll">
        {data.cards.map((card, cIndex) => {
          const isFlipped = flippedCards[`${messageId}-${cIndex}`];
          return (
            <div 
              key={cIndex} 
              className={`flashcard ${isFlipped ? 'flipped' : ''}`}
              onClick={() => toggleFlashcard(messageId, cIndex)}
            >
              <div className="flashcard-inner">
                <div className="flashcard-front">
                  <span className="card-badge">{card.category || 'Fact'}</span>
                  <p>{card.question}</p>
                  <span className="flip-icon">🔄</span>
                </div>
                <div className="flashcard-back">
                  <p>{card.answer}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTimeline = (data) => (
    <div className="chat-timeline-container">
      <div className="chat-timeline-header">
        <h4><History size={18}/> Election Flow</h4>
      </div>
      <div className="chat-timeline">
        {data.steps.map((step, sIndex) => (
          <div key={sIndex} className="chat-timeline-step">
            <div className="chat-timeline-marker">{step.step}</div>
            <div className="chat-timeline-content">
              <h5>{step.title}</h5>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBotMessage = (msg) => {
    if (!msg.isJson || !msg.data) {
      return <div className="bot-explanation"><p>{msg.text}</p></div>;
    }

    switch (msg.data.type) {
      case 'explanation': return renderExplanation(msg.data);
      case 'quiz': return renderQuiz(msg.data, msg.id);
      case 'flashcards': return renderFlashcards(msg.data, msg.id);
      case 'timeline': return renderTimeline(msg.data);
      default: return <div className="bot-explanation"><p>Unsupported format received.</p></div>;
    }
  };

  return (
    <div className="fade-in">
      <div className="section-header">
        <h2>Bharat Voter Companion</h2>
        <p>Your intelligent civic assistant. Ask about voting, or request a quiz or flashcards!</p>
      </div>

      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-header-icon">
            <Bot size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>BharatBot 🇮🇳</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--green)', fontSize: '0.85rem', fontWeight: 600 }}>Active</span>
              <button 
                className="suggestion-btn" 
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                onClick={() => handleSend('Translate the last response to Hindi')}
                title="Translate to Hindi using Google Cloud Translation"
              >
                Translate 🇮🇳
              </button>
            </div>
          </div>
        </div>

        <div className="chat-messages" role="log" aria-live="polite">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.sender} ${msg.isJson ? 'json-message' : ''}`}
              role="article"
              aria-label={`${msg.sender === 'user' ? 'You' : 'Assistant'}: ${msg.sender === 'user' ? msg.text : 'Response'}`}
            >
              {msg.sender === 'user' ? msg.text : renderBotMessage(msg)}
            </div>
          ))}
          {isLoading && (
            <div className="message bot" style={{ display: 'flex', gap: '8px', alignItems: 'center' }} aria-busy="true">
              <span className="dot-typing" aria-hidden="true">...</span> Thinking...
            </div>
          )}
        </div>

        <form 
          className="chat-input-container" 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          aria-label="Chat input form"
          style={{ flexDirection: 'column', gap: '0.5rem' }}
        >
          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <input
              type="text"
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="E.g., 'I am 18', 'Quiz me', or 'Explain Lok Sabha'..."
              disabled={isLoading}
              aria-label="Message to assistant"
            />
            <button 
              type="submit" 
              className="send-btn" 
              disabled={isLoading || !input.trim() || !captchaToken}
              aria-label="Send message"
            >
              <Send size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="recaptcha-wrapper" style={{ alignSelf: 'flex-start', transform: 'scale(0.85)', transformOrigin: 'left center', marginTop: '-5px' }}>
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              onChange={(token) => setCaptchaToken(token)}
              theme="dark"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default AssistantChat;
