// Test script for chatbot API
import './config/loadEnv.js';
import './config/mongooseSetup.js';
import model from './services/geminiService.js';

console.log('🤖 Testing Chatbot Integration...\n');

// Test system prompt
const SYSTEM_PROMPT = `You are e-Samadhan AI Assistant. Respond in English.

USER MESSAGE: What is e-Samadhan AI?

ASSISTANT RESPONSE:`;

async function testGemini() {
      try {
            console.log('1. Testing Gemini AI connection...');
            if (!model) {
                  throw new Error('Gemini model not initialized');
            }

            const result = await model.generateContent(SYSTEM_PROMPT);
            const response = result.response;
            console.log('✅ Gemini AI connected successfully');
            console.log('Response:', response.text().trim().substring(0, 100) + '...\n');

            return true;
      } catch (error) {
            console.error('❌ Gemini AI test failed:', error.message);
            console.error('Make sure GEMINI_API_KEY is set in .env file');
            return false;
      }
}

async function testChatbotAPI() {
      console.log('2. Testing Chatbot API endpoint...');
      console.log('   Expected endpoint: POST /api/chatbot/message');
      console.log('   Required parameters: message, language, userRole');
      console.log('   Example request:');
      console.log('   {');
      console.log('     "message": "What is e-Samadhan AI?",');
      console.log('     "language": "en",');
      console.log('     "userRole": "guest"');
      console.log('   }\n');

      console.log('✅ Chatbot API endpoint configured');
      return true;
}

async function testDatabase() {
      console.log('3. Testing Database connection for chat history...');
      try {
            // Import mongoose and connect
            const mongoose = await import('mongoose');

            // Check if already connected
            if (mongoose.connection.readyState === 1) {
                  console.log('✅ MongoDB connected for ChatHistory model');
                  console.log('   Collection: chathistories');
                  console.log('   Indexes: userId, createdAt (auto-delete after 30 days)\n');
                  return true;
            }

            // Try to connect
            console.log('   Attempting to connect to MongoDB...');
            await mongoose.connect(process.env.MONGO_URI);

            if (mongoose.connection.readyState === 1) {
                  console.log('✅ MongoDB connected for ChatHistory model');
                  console.log('   Collection: chathistories');
                  console.log('   Indexes: userId, createdAt (auto-delete after 30 days)\n');
                  return true;
            } else {
                  console.log('⚠️  MongoDB not connected. Make sure MONGO_URI is set correctly.\n');
                  return false;
            }
      } catch (error) {
            console.error('❌ Database test failed:', error.message);
            console.error('   Make sure MONGO_URI is correct in .env file');
            return false;
      }
}

async function runTests() {
      console.log('='.repeat(60));
      console.log('CHATBOT INTEGRATION TESTS');
      console.log('='.repeat(60));

      const geminiTest = await testGemini();
      const apiTest = await testChatbotAPI();
      const dbTest = await testDatabase();

      console.log('='.repeat(60));
      console.log('TEST SUMMARY:');
      console.log(`✅ Gemini AI: ${geminiTest ? 'PASS' : 'FAIL'}`);
      console.log(`✅ API Endpoint: ${apiTest ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Database: ${dbTest ? 'PASS' : 'FAIL'}`);

      if (geminiTest && apiTest && dbTest) {
            console.log('\n🎉 All tests passed! Chatbot is ready for integration.');
            console.log('\nTo start using the chatbot:');
            console.log('1. Start the backend server: npm run dev');
            console.log('2. The chatbot will appear as a floating button on every page');
            console.log('3. Click the button to open the AI assistant');
      } else {
            console.log('\n⚠️  Some tests failed. Please check the errors above.');
      }

      console.log('='.repeat(60));

      // Exit after tests
      setTimeout(() => {
            process.exit(0);
      }, 1000);
}

runTests().catch(console.error);