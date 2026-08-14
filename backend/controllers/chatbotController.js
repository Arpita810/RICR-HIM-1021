import model from '../services/geminiService.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ChatHistory from '../models/ChatHistory.js';

// System prompt containing platform knowledge
const SYSTEM_PROMPT = `You are e-Samadhan AI Assistant, an official government grievance management platform chatbot.

PLATFORM OVERVIEW:
e-Samadhan AI is a government grievance management platform that allows citizens to submit complaints, officers to resolve them, and admins to manage the system.

KEY FEATURES:
1. Citizen Features:
   - Registration with Aadhaar verification
   - Complaint submission with voice, text, and document upload
   - Real-time complaint tracking
   - AI-generated resolution reports
   - Multi-language support (English, Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Punjabi)

2. Officer Features:
   - Accept complaints from department queue
   - Update complaint status (assigned, in_progress, resolved, rejected)
   - Add investigation notes
   - Generate AI resolution reports using Gemini AI
   - View performance analytics

3. Admin Features:
   - Create and manage departments
   - Assign officers to departments
   - View platform analytics
   - Manage user accounts
   - Monitor complaint resolution rates

REGISTRATION PROCESS:
1. Visit registration page
2. Enter personal details (name, email, phone)
3. Verify Aadhaar (optional for voice complaints)
4. Set password
5. Verify email/phone via OTP
6. Login to dashboard

COMPLAINT SUBMISSION:
1. Login to citizen dashboard
2. Click "Submit Complaint"
3. Select complaint type/category
4. Enter title and description
5. Upload evidence (documents, images, voice recording)
6. Select priority (low, medium, high, emergency)
7. Submit complaint

COMPLAINT TRACKING:
1. Login to citizen dashboard
2. View "My Complaints" section
3. Check status: pending, assigned, in_progress, resolved, rejected
4. View timeline updates
5. Download resolution report (if resolved)

OFFICER WORKFLOW:
1. Login to officer dashboard
2. View department queue
3. Accept complaint from queue
4. Update status to "in_progress"
5. Add investigation notes
6. Generate AI resolution report
7. Mark as resolved and send report to citizen

ADMIN WORKFLOW:
1. Login to admin dashboard
2. Create departments with name, description, color, icon
3. Add officers to departments
4. Assign complaints to officers
5. View analytics dashboard
6. Monitor system performance

VOICE COMPLAINT SYSTEM:
1. Click "Voice Complaint" button
2. Allow microphone access
3. Speak complaint in supported language
4. System transcribes to text
5. Review and submit

AI REPORT GENERATION:
1. Officer enters resolution notes
2. Click "Generate AI Resolution Report"
3. Gemini AI creates structured report
4. Officer reviews and approves
5. PDF generated and sent to citizen

AADHAAR VERIFICATION:
1. Optional for voice complaints
2. Enter 12-digit Aadhaar number
3. System verifies via government API
4. Enhanced trust score for verified users

DOCUMENT UPLOAD:
1. Supported formats: PDF, JPG, PNG, DOC
2. Max size: 10MB per file
3. Upload during complaint submission
4. View in complaint details

RESPONSE GUIDELINES:
1. Always respond in the user's selected language
2. Be helpful, professional, and government-official tone
3. Provide step-by-step instructions when asked
4. If unsure, direct to relevant page or contact support
5. Never share sensitive data or system credentials
6. Keep responses concise but informative
7. Use bullet points for multi-step processes
8. Include emojis for better readability (✅, 📝, 🔒, etc.)

CURRENT USER ROLE: {userRole}
CURRENT LANGUAGE: {language}`;

// @desc    Process chatbot message
// @route   POST /api/chatbot/message
// @access  Public (but rate-limited)
export const processChatMessage = asyncHandler(async (req, res) => {
      const { message, language = 'en', userRole = 'guest', userId, context } = req.body;

      if (!message || message.trim().length === 0) {
            return res.status(400).json({
                  success: false,
                  message: 'Message is required'
            });
      }

      // Rate limiting check (simplified - in production use express-rate-limit)
      const ip = req.ip || req.connection.remoteAddress;
      console.log(`🤖 [chatbot] Processing message from ${ip}, role: ${userRole}, language: ${language}`);

      try {
            // Get or create chat history
            let chatHistory = null;
            if (userId) {
                  chatHistory = await ChatHistory.findOne({ userId }).sort({ updatedAt: -1 });
                  if (!chatHistory) {
                        chatHistory = await ChatHistory.create({
                              userId,
                              messages: []
                        });
                  }
            }

            // Prepare context-aware prompt
            const contextInfo = context ? `\nCURRENT PAGE CONTEXT: ${context}` : '';
            const fullPrompt = SYSTEM_PROMPT
                  .replace('{userRole}', userRole)
                  .replace('{language}', language)
                  + contextInfo
                  + `\n\nUSER MESSAGE (in ${language}): ${message}\n\nASSISTANT RESPONSE (in ${language}):`;

            // Add previous messages for context
            let conversationContext = '';
            if (chatHistory && chatHistory.messages.length > 0) {
                  const recentMessages = chatHistory.messages.slice(-5); // Last 5 messages for context
                  conversationContext = '\n\nPREVIOUS CONVERSATION:\n';
                  recentMessages.forEach(msg => {
                        conversationContext += `${msg.role === 'user' ? 'USER' : 'ASSISTANT'}: ${msg.content}\n`;
                  });
            }

            const finalPrompt = fullPrompt + conversationContext;

            console.log('🤖 [chatbot] Sending to Gemini AI...');
            if (!model) {
                  throw new Error('Gemini model not initialized - check GEMINI_API_KEY in .env');
            }

            const result = await model.generateContent(finalPrompt);
            const response = result.response;
            const aiResponse = response.text().trim();

            console.log('✅ [chatbot] Response generated successfully');

            // Save to chat history
            if (chatHistory) {
                  chatHistory.messages.push({
                        role: 'user',
                        content: message,
                        timestamp: new Date()
                  });
                  chatHistory.messages.push({
                        role: 'assistant',
                        content: aiResponse,
                        timestamp: new Date()
                  });
                  // Keep only last 50 messages
                  if (chatHistory.messages.length > 50) {
                        chatHistory.messages = chatHistory.messages.slice(-50);
                  }
                  chatHistory.updatedAt = new Date();
                  await chatHistory.save();
            }

            res.status(200).json({
                  success: true,
                  response: aiResponse,
                  timestamp: new Date().toISOString()
            });
      } catch (error) {
            console.error('❌ [chatbot] Gemini Generation Error:', error.message);
            
            // Fallback responses based on language
            const fallbackResponses = {
                  en: "I apologize, but I'm having trouble processing your request right now. Please try again or contact support.",
                  hi: 'मुझे खेद है, लेकिन मैं अभी आपके अनुरोध को संसाधित करने में समस्या आ रही है। कृपया पुनः प्रयास करें या सहायता से संपर्क करें।',
                  mr: 'मला माफ करा, पण मला आत्ता तुमची विनंती प्रक्रिया करण्यात अडचण येत आहे. कृपया पुन्हा प्रयत्न करा किंवा समर्थनाशी संपर्क साधा.',
                  bn: 'আমি দুঃখিত, কিন্তু আমি এখনই আপনার অনুরোধ প্রক্রিয়া করতে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন বা সহায়তা যোগাযোগ করুন।',
                  ta: 'மன்னிக்கவும், ஆனால் நான் இப்போது உங்கள் கோரிக்கையை செயல்படுத்துவதில் சிக்கல் அனுபவிக்கிறேன். தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது ஆதரவைத் தொடர்பு கொள்ளவும்.',
                  te: 'క్షమించండి, కానీ నేను ప్రస్తుతం మీ అభ్యర్థనను ప్రాసెస్ చేయడంలో సమస్య ఎదుర్కొంటున్నాను. దయచేసి మళ్లీ ప్రయత్నించండి లేదా మద్దతును సంప్రదించండి.',
                  gu: 'મને દિલગીરી છે, પરંતુ હું હમણાં તમારી વિનંતીને પ્રક્રિયા કરવામાં સમસ્યા અનુભવી રહ્યો છું. કૃપા કરીને ફરી પ્રયાસ કરો અથવા સમર્થનનો સંપર્ક કરો.',
                  pa: 'ਮੈਨੂੰ ਅਫਸੋਸ ਹੈ, ਪਰ ਮੈਨੂੰ ਹੁਣੇ ਤੁਹਾਡੀ ਬੇਨਤੀ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਨ ਵਿੱਚ ਮੁਸ਼ਕਲ ਆ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ ਜਾਂ ਸਹਾਇਤਾ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।'
            };

            const fallbackResponse = fallbackResponses[language] || fallbackResponses.en;

            res.status(500).json({
                  success: false,
                  response: fallbackResponse,
                  error: 'Failed to generate AI response',
                  timestamp: new Date().toISOString()
            });
      }
});

// @desc    Get user chat history
// @route   GET /api/chatbot/history
// @access  Private
export const getChatHistory = asyncHandler(async (req, res) => {
      const { userId } = req.query;

      if (!userId) {
            return res.status(400).json({
                  success: false,
                  message: 'User ID is required'
            });
      }

      const chatHistory = await ChatHistory.findOne({ userId })
            .sort({ updatedAt: -1 });

      if (!chatHistory) {
            return res.status(200).json({
                  success: true,
                  history: [],
                  message: 'No chat history found'
            });
      }

      res.status(200).json({
            success: true,
            history: chatHistory.messages,
          updatedAt: chatHistory.updatedAt
      });
});

// @desc    Clear user chat history
// @route   DELETE /api/chatbot/history
// @access  Private
export const clearChatHistory = asyncHandler(async (req, res) => {
      const { userId } = req.body;

      if (!userId) {
            return res.status(400).json({
                  success: false,
                  message: 'User ID is required'
            });
      }

      await ChatHistory.deleteMany({ userId });

      res.status(200).json({
            success: true,
            message: 'Chat history cleared successfully'
      });
});

// @desc    Get quick questions based on user role
// @route   GET /api/chatbot/quick-questions
// @access  Public
export const getQuickQuestions = asyncHandler(async (req, res) => {
      const { userRole = 'guest', language = 'en' } = req.query;

      // Quick questions based on user role and language
      const questionsByRole = {
            guest: [
                  { text: { en: 'What is e-Samadhan AI?', hi: 'ई-समाधान AI क्या है?', mr: 'ई-समाधान AI म्हणजे काय?', bn: 'e-Samadhan AI কি?', ta: 'e-Samadhan AI என்றால் என்ன?', te: 'e-Samadhan AI అంటే ఏమిటి?', gu: 'e-Samadhan AI શું છે?', pa: 'e-Samadhan AI ਕੀ ਹੈ?' }, value: 'What is e-Samadhan AI?' },
                  { text: { en: 'How do I register?', hi: 'मैं कैसे पंजीकरण करूं?', mr: 'मी कसा नोंदणी करू?', bn: 'আমি কিভাবে নিবন্ধন করব?', ta: 'நான் எப்படி பதிவு செய்வது?', te: 'నేను ఎలా నమోదు చేసుకోవాలి?', gu: 'હું કેવી રીતે નોંધણી કરી શકું?', pa: 'ਮੈਂ ਕਿਵੇਂ ਰਜਿਸਟਰ ਕਰਾਂ?' }, value: 'How do I register?' },
                  { text: { en: 'Submit Complaint', hi: 'शिकायत दर्ज करें', mr: 'तक्रार सबमिट करा', bn: 'অভিযোগ জমা দিন', ta: 'புகாரை சமர்ப்பிக்கவும்', te: 'ఫిర్యాదు సమర్పించండి', gu: 'ફરિયાદ સબમિટ કરો', pa: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ' }, value: 'How do I submit a complaint?' },
                  { text: { en: 'Track Complaint', hi: 'शिकायत ट्रैक करें', mr: 'तक्रार ट्रॅक करा', bn: 'অভিযোগ ট্র্যাক করুন', ta: 'புகாரை கண்காணிக்கவும்', te: 'ఫిర్యాదును ట్రాక్ చేయండి', gu: 'ફરિયાદ ટ્રેક કરો', pa: 'ਸ਼ਿਕਾਇਤ ਟਰੈਕ ਕਰੋ' }, value: 'How do I track my complaint?' }
            ],
            citizen: [
                  { text: { en: 'Submit Complaint', hi: 'शिकायत दर्ज करें', mr: 'तक्रार सबमिट करा', bn: 'অভিযোগ জমা দিন', ta: 'புகாரை சமர்ப்பிக்கவும்', te: 'ఫిర్యాదు సమర్పించండి', gu: 'ફરિયાદ સબમિટ કરો', pa: 'ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰੋ' }, value: 'How do I submit a complaint?' },
                  { text: { en: 'Track Complaint', hi: 'शिकायत ट्रैक करें', mr: 'तक्रार ट्रॅक करा', bn: 'অভিযোগ ট্র্যাক করুন', ta: 'புகாரை கண்காணிக்கவும்', te: 'ఫిర్యాదును ట్రాక్ చేయండి', gu: 'ફરિયાદ ટ્રેક કરો', pa: 'ਸ਼ਿਕਾਇਤ ਟਰੈਕ ਕਰੋ' }, value: 'How do I track my complaint?' },
                  { text: { en: 'Upload Evidence', hi: 'सबूत अपलोड करें', mr: 'पुरावा अपलोड करा', bn: 'প্রমাণ আপলোড করুন', ta: 'சான்றுகளை பதிவேற்றவும்', te: 'రుజువు అప్లోడ్ చేయండి', gu: 'સાબિતી અપલોડ કરો', pa: 'ਸਬੂਤ ਅਪਲੋਡ ਕਰੋ' }, value: 'How do I upload evidence?' },
                  { text: { en: 'Voice Complaint', hi: 'वॉइस शिकायत', mr: 'व्हॉइस तक्रार', bn: 'ভয়েস অভিযোগ', ta: 'குரல் புகார்', te: 'వాయిస్ ఫిర్యాదు', gu: 'વૉઇસ ફરિયાદ', pa: 'ਵੌਇਸ ਸ਼ਿਕਾਇਤ' }, value: 'How does voice complaint work?' }
            ],
            officer: [
                  { text: { en: 'Accept Complaint', hi: 'शिकायत स्वीकार करें', mr: 'तक्रार स्वीकारा', bn: 'অভিযোগ গ্রহণ করুন', ta: 'புகாரை ஏற்கவும்', te: 'ఫిర్యాదును అంగీకరించండి', gu: 'ફરિયાદ સ્વીકારો', pa: 'ਸ਼ਿਕਾਇਤ ਸਵੀਕਾਰ ਕਰੋ' }, value: 'How do I accept a complaint?' },
                  { text: { en: 'Generate AI Report', hi: 'AI रिपोर्ट जनरेट करें', mr: 'AI अहवाल तयार करा', bn: 'AI রিপোর্ট তৈরি করুন', ta: 'AI அறிக்கையை உருவாக்கவும்', te: 'AI రిపోర్ట్ జనరేట్ చేయండి', gu: 'AI રિપોર્ટ જનરેટ કરો', pa: 'AI ਰਿਪੋਰਟ ਤਿਆਰ ਕਰੋ' }, value: 'How do I generate an AI report?' },
                  { text: { en: 'Update Status', hi: 'स्थिति अपडेट करें', mr: 'स्थिती अपडेट करा', bn: 'স্ট্যাটাস আপডেট করুন', ta: 'நிலையை புதுப்பிக்கவும்', te: 'స్థితిని నవీకరించండి', gu: 'સ્થિતિ અપડેટ કરો', pa: 'ਸਥਿਤੀ ਅੱਪਡੇਟ ਕਰੋ' }, value: 'How do I update complaint status?' },
                  { text: { en: 'Add Notes', hi: 'नोट्स जोड़ें', mr: 'नोट्स जोडा', bn: 'নোট যোগ করুন', ta: 'குறிப்புகளைச் சேர்க்கவும்', te: 'నోట్లు జోడించండి', gu: 'નોંધો ઉમેરો', pa: 'ਨੋਟ ਸ਼ਾਮਲ ਕਰੋ' }, value: 'How do I add investigation notes?' }
            ],
            admin: [
                  { text: { en: 'Create Department', hi: 'विभाग बनाएं', mr: 'विभाग तयार करा', bn: 'বিভাগ তৈরি করুন', ta: 'துறையை உருவாக்கவும்', te: 'విభాగాన్ని సృష్టించండి', gu: 'વિભાગ બનાવો', pa: 'ਵਿਭਾਗ ਬਣਾਓ' }, value: 'How do I create departments?' },
                  { text: { en: 'Assign Officers', hi: 'अधिकारी नियुक्त करें', mr: 'अधिकारी नियुक्त करा', bn: 'অফিসার নিয়োগ করুন', ta: 'அதிகாரிகளை நியமிக்கவும்', te: 'అధికారులను కేటాయించండి', gu: 'અધિકારીઓ નિયુક્ત કરો', pa: 'ਅਧਿਕਾਰੀ ਨਿਯੁਕਤ ਕਰੋ' }, value: 'How do I assign officers?' },
                  { text: { en: 'View Analytics', hi: 'एनालिटिक्स देखें', mr: 'विश्लेषण पहा', bn: 'বিশ্লেষণ দেখুন', ta: 'பகுப்பாய்வுகளைக் காண்க', te: 'విశ్లేషణలను వీక్షించండి', gu: 'વિશ્લેષણ જુઓ', pa: 'ਵਿਸ਼ਲੇਸ਼ਣ ਵੇਖੋ' }, value: 'How do I view analytics?' },
                  { text: { en: 'Manage Users', hi: 'उपयोगकर्ता प्रबंधित करें', mr: 'वापरकर्ते व्यवस्थापित करा', bn: 'ব্যবহারকারী পরিচালনা করুন', ta: 'பயனர்களை நிர்வகிக்கவும்', te: 'వినియోగదారులను నిర్వహించండి', gu: 'વપરાશકર્તાઓનું સંચાલન કરો', pa: 'ਉਪਭੋਗਤਾ ਪ੍ਰਬੰਧਿਤ ਕਰੋ' }, value: 'How do I manage user accounts?' }
            ]
      };

      const questions = questionsByRole[userRole] || questionsByRole.guest;
      
      // Get text in current language
      const localizedQuestions = questions.map(q => ({
            text: q.text[language] || q.text.en,
            value: q.value
      }));

      res.status(200).json({
            success: true,
            questions: localizedQuestions,
            userRole,
            language
      });
});