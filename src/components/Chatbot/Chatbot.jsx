import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
      MessageCircle, X, Send, Mic, MicOff, Bot, User,
      Sparkles, Trash2, ChevronRight, Loader2, Volume2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { sendChatMessage, getQuickQuestions, getChatHistory, clearChatHistory } from '../../api/chatbot';
import './Chatbot.css';

const Chatbot = () => {
      const { t, i18n } = useTranslation();
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState([]);
      const [inputMessage, setInputMessage] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const [isListening, setIsListening] = useState(false);
      const [showQuickQuestions, setShowQuickQuestions] = useState(true);
      const [quickQuestions, setQuickQuestions] = useState([]);
      const messagesEndRef = useRef(null);
      const inputRef = useRef(null);

      // Initialize messages with welcome message
      useEffect(() => {
            const welcomeMessage = {
                  id: 'welcome',
                  text: t('chatbot.welcome', 'Hello! I\'m e-Samadhan AI Assistant. How can I help you today?'),
                  sender: 'bot',
                  timestamp: new Date()
            };

            setMessages([welcomeMessage]);
            loadQuickQuestions();
            loadChatHistory();
      }, [t]);

      // Load quick questions
      const loadQuickQuestions = async () => {
            try {
                  const response = await getQuickQuestions();
                  if (response.data?.success) {
                        setQuickQuestions(response.data.questions);
                  }
            } catch (error) {
                  console.error('Failed to load quick questions:', error);
            }
      };

      // Load chat history
      const loadChatHistory = async () => {
            try {
                  const response = await getChatHistory();
                  if (response.data?.success && response.data.history.length > 0) {
                        const historyMessages = response.data.history.map(msg => ({
                              id: msg._id || Date.now() + Math.random(),
                              text: msg.content,
                              sender: msg.role === 'user' ? 'user' : 'bot',
                              timestamp: new Date(msg.timestamp)
                        }));
                        setMessages(prev => [prev[0], ...historyMessages]);
                  }
            } catch (error) {
                  // Silently fail if not authenticated
                  console.log('No chat history available');
            }
      };

      // Scroll to bottom of messages
      const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      useEffect(() => {
            scrollToBottom();
      }, [messages]);

      // Handle voice input
      const handleVoiceInput = () => {
            if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
                  toast.error(t('chatbot.voiceNotSupported', 'Voice input is not supported in your browser'));
                  return;
            }

            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = i18n.language;
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onstart = () => {
                  setIsListening(true);
                  toast.success(t('chatbot.listening', 'Listening...'));
            };

            recognition.onresult = (event) => {
                  const transcript = event.results[0][0].transcript;
                  setInputMessage(transcript);
                  setIsListening(false);
            };

            recognition.onerror = (event) => {
                  console.error('Speech recognition error:', event.error);
                  setIsListening(false);
                  toast.error(t('chatbot.voiceError', 'Voice recognition failed'));
            };

            recognition.onend = () => {
                  setIsListening(false);
            };

            recognition.start();
      };

      // Handle sending message
      const handleSendMessage = async () => {
            if (!inputMessage.trim() || isLoading) return;

            const userMessage = {
                  id: Date.now(),
                  text: inputMessage,
                  sender: 'user',
                  timestamp: new Date()
            };

            setMessages(prev => [...prev, userMessage]);
            setInputMessage('');
            setShowQuickQuestions(false);
            setIsLoading(true);

            try {
                  // Get current page context
                  const context = window.location.pathname;

                  const response = await sendChatMessage(inputMessage, context);

                  if (response.data?.success) {
                        const botMessage = {
                              id: Date.now() + 1,
                              text: response.data.response,
                              sender: 'bot',
                              timestamp: new Date()
                        };
                        setMessages(prev => [...prev, botMessage]);
                  } else {
                        throw new Error('Failed to get response');
                  }
            } catch (error) {
                  console.error('Chatbot error:', error);
                  const errorMessage = {
                        id: Date.now() + 1,
                        text: t('chatbot.error', 'Sorry, I encountered an error. Please try again.'),
                        sender: 'bot',
                        timestamp: new Date()
                  };
                  setMessages(prev => [...prev, errorMessage]);
            } finally {
                  setIsLoading(false);
            }
      };

      // Handle quick question click
      const handleQuickQuestionClick = (question) => {
            setInputMessage(question);
            if (isOpen) {
                  inputRef.current?.focus();
            }
      };

      // Handle clear chat
      const handleClearChat = async () => {
            try {
                  await clearChatHistory();
                  const welcomeMessage = {
                        id: 'welcome',
                        text: t('chatbot.welcome', 'Hello! I\'m e-Samadhan AI Assistant. How can I help you today?'),
                        sender: 'bot',
                        timestamp: new Date()
                  };
                  setMessages([welcomeMessage]);
                  setShowQuickQuestions(true);
                  toast.success(t('chatbot.cleared', 'Chat history cleared'));
            } catch (error) {
                  toast.error(t('chatbot.clearError', 'Failed to clear chat history'));
            }
      };

      // Handle key press
      const handleKeyPress = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
            }
      };

      return (
            <>
                  {/* Floating Chatbot Button */}
                  <motion.button
                        className="chatbot-button"
                        onClick={() => setIsOpen(!isOpen)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                  >
                        <MessageCircle className="w-6 h-6" />
                        {!isOpen && (
                              <motion.div
                                    className="chatbot-pulse"
                                    initial={{ scale: 0.8, opacity: 0.7 }}
                                    animate={{ scale: 1.2, opacity: 0 }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                              />
                        )}
                  </motion.button>

                  {/* Chatbot Window */}
                  <AnimatePresence>
                        {isOpen && (
                              <motion.div
                                    className="chatbot-window"
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    transition={{ type: 'spring', damping: 25 }}
                              >
                                    {/* Header */}
                                    <div className="chatbot-header">
                                          <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                                                      <Bot className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                      <h3 className="font-bold text-slate-800">e-Samadhan AI Assistant</h3>
                                                      <p className="text-xs text-slate-500">Powered by Gemini AI</p>
                                                </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                                <button
                                                      onClick={handleClearChat}
                                                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                      title={t('chatbot.clear', 'Clear chat')}
                                                >
                                                      <Trash2 className="w-4 h-4 text-slate-500" />
                                                </button>
                                                <button
                                                      onClick={() => setIsOpen(false)}
                                                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                >
                                                      <X className="w-4 h-4 text-slate-500" />
                                                </button>
                                          </div>
                                    </div>

                                    {/* Messages Container */}
                                    <div className="chatbot-messages">
                                          <AnimatePresence>
                                                {messages.map((message) => (
                                                      <motion.div
                                                            key={message.id}
                                                            className={`message ${message.sender}`}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                      >
                                                            <div className="message-avatar">
                                                                  {message.sender === 'bot' ? (
                                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                                                                              <Bot className="w-4 h-4 text-white" />
                                                                        </div>
                                                                  ) : (
                                                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                                                              <User className="w-4 h-4 text-slate-600" />
                                                                        </div>
                                                                  )}
                                                            </div>
                                                            <div className="message-content">
                                                                  <div className="message-text">{message.text}</div>
                                                                  <div className="message-time">
                                                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                  </div>
                                                            </div>
                                                      </motion.div>
                                                ))}

                                                {isLoading && (
                                                      <motion.div
                                                            className="message bot"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                      >
                                                            <div className="message-avatar">
                                                                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                                                                        <Bot className="w-4 h-4 text-white" />
                                                                  </div>
                                                            </div>
                                                            <div className="message-content">
                                                                  <div className="flex items-center gap-2">
                                                                        <div className="typing-dots">
                                                                              <div className="dot"></div>
                                                                              <div className="dot"></div>
                                                                              <div className="dot"></div>
                                                                        </div>
                                                                        <span className="text-sm text-slate-500">
                                                                              {t('chatbot.thinking', 'Thinking...')}
                                                                        </span>
                                                                  </div>
                                                            </div>
                                                      </motion.div>
                                                )}
                                          </AnimatePresence>
                                          <div ref={messagesEndRef} />
                                    </div>

                                    {/* Quick Questions */}
                                    {showQuickQuestions && quickQuestions.length > 0 && (
                                          <motion.div
                                                className="quick-questions"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                          >
                                                <div className="quick-questions-header">
                                                      <Sparkles className="w-4 h-4 text-blue-500" />
                                                      <span className="text-sm font-medium text-slate-700">
                                                            {t('chatbot.quickQuestions', 'Quick Questions')}
                                                      </span>
                                                </div>
                                                <div className="quick-questions-grid">
                                                      {quickQuestions.map((question, index) => (
                                                            <button
                                                                  key={index}
                                                                  onClick={() => handleQuickQuestionClick(question.value)}
                                                                  className="quick-question-button"
                                                            >
                                                                  <span>{question.text}</span>
                                                                  <ChevronRight className="w-3 h-3" />
                                                            </button>
                                                      ))}
                                                </div>
                                          </motion.div>
                                    )}

                                    {/* Input Area */}
                                    <div className="chatbot-input">
                                          <div className="input-wrapper">
                                                <textarea
                                                      ref={inputRef}
                                                      value={inputMessage}
                                                      onChange={(e) => setInputMessage(e.target.value)}
                                                      onKeyPress={handleKeyPress}
                                                      placeholder={t('chatbot.placeholder', 'Type your message here...')}
                                                      className="chatbot-textarea"
                                                      rows="1"
                                                />
                                                <div className="input-actions">
                                                      <button
                                                            onClick={handleVoiceInput}
                                                            disabled={isListening}
                                                            className={`voice-button ${isListening ? 'listening' : ''}`}
                                                            title={t('chatbot.voiceInput', 'Voice input')}
                                                      >
                                                            {isListening ? (
                                                                  <MicOff className="w-4 h-4" />
                                                            ) : (
                                                                  <Mic className="w-4 h-4" />
                                                            )}
                                                      </button>
                                                      <button
                                                            onClick={handleSendMessage}
                                                            disabled={!inputMessage.trim() || isLoading}
                                                            className="send-button"
                                                      >
                                                            {isLoading ? (
                                                                  <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                  <Send className="w-4 h-4" />
                                                            )}
                                                      </button>
                                                </div>
                                          </div>
                                          <p className="input-hint">
                                                {t('chatbot.hint', 'Press Enter to send • Shift+Enter for new line')}
                                          </p>
                                    </div>
                              </motion.div>
                        )}
                  </AnimatePresence>
            </>
      );
};

export default Chatbot;