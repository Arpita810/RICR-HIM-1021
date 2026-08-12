import api from './axios';

// Helper to get user role from localStorage
const getUserRole = () => {
      if (localStorage.getItem('adminToken')) return 'admin';
      if (localStorage.getItem('officerToken')) return 'officer';
      if (localStorage.getItem('citizenToken') || localStorage.getItem('token')) return 'citizen';
      return 'guest';
};

// Helper to get user ID from localStorage
const getUserId = () => {
      const adminData = localStorage.getItem('adminData');
      const officerData = localStorage.getItem('officerData');
      const citizenData = localStorage.getItem('citizenData') || localStorage.getItem('user');

      if (adminData) {
            const admin = JSON.parse(adminData);
            return admin._id;
      }
      if (officerData) {
            const officer = JSON.parse(officerData);
            return officer._id;
      }
      if (citizenData) {
            const citizen = JSON.parse(citizenData);
            return citizen._id;
      }
      return null;
};

// Helper to get current language from i18n
const getCurrentLanguage = () => {
      return localStorage.getItem('i18nextLng') || 'en';
};

/** Send message to chatbot */
export const sendChatMessage = (message, context = null) => {
      const userRole = getUserRole();
      const userId = getUserId();
      const language = getCurrentLanguage();

      return api.post('/chatbot/message', {
            message,
            language,
            userRole,
            userId,
            context
      });
};

/** Get quick questions based on user role */
export const getQuickQuestions = () => {
      const userRole = getUserRole();
      const language = getCurrentLanguage();

      return api.get('/chatbot/quick-questions', {
            params: { userRole, language }
      });
};

/** Get chat history for authenticated user */
export const getChatHistory = () => {
      const userId = getUserId();
      if (!userId) {
            return Promise.reject(new Error('User not authenticated'));
      }

      return api.get('/chatbot/history', {
            params: { userId }
      });
};

/** Clear chat history for authenticated user */
export const clearChatHistory = () => {
      const userId = getUserId();
      if (!userId) {
            return Promise.reject(new Error('User not authenticated'));
      }

      return api.delete('/chatbot/history', {
            data: { userId }
      });
};