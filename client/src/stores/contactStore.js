import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as contactAPI from '../services/api/contact';

const useContactStore = create(
  devtools(
    (set, get) => ({
      // State
      messages: [],
      currentMessage: null,
      loading: false,
      error: null,
      success: false,

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      setSuccess: (success) => set({ success }),

      /**
       * Send contact message
       */
      sendMessage: async (messageData) => {
        set({ loading: true, error: null, success: false });
        try {
          const response = await contactAPI.sendMessage(messageData);
          set({ 
            loading: false,
            success: true 
          });
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de l\'envoi du message';
          set({ error: errorMessage, loading: false, success: false });
          throw error;
        }
      },

      /**
       * Fetch all messages (ADMIN)
       */
      fetchMessages: async (params = {}) => {
        set({ loading: true, error: null });
        try {
          const response = await contactAPI.getAllMessages(params);
          set({ 
            messages: response.data || response,
            loading: false 
          });
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors du chargement des messages';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Fetch message by ID (ADMIN)
       */
      fetchMessageById: async (id) => {
        set({ loading: true, error: null });
        try {
          const response = await contactAPI.getMessageById(id);
          set({ 
            currentMessage: response.data || response,
            loading: false 
          });
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors du chargement du message';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Update message status (ADMIN)
       */
      updateMessageStatus: async (id, status) => {
        set({ loading: true, error: null });
        try {
          const response = await contactAPI.updateMessageStatus(id, status);
          const updatedMessage = response.data || response;
          
          set((state) => ({
            messages: state.messages.map(msg => 
              msg.id === id ? { ...msg, status } : msg
            ),
            currentMessage: state.currentMessage?.id === id ? updatedMessage : state.currentMessage,
            loading: false
          }));
          
          return response;
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la mise à jour du statut';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Delete message (ADMIN)
       */
      deleteMessage: async (id) => {
        set({ loading: true, error: null });
        try {
          await contactAPI.deleteMessage(id);
          
          set((state) => ({
            messages: state.messages.filter(msg => msg.id !== id),
            currentMessage: state.currentMessage?.id === id ? null : state.currentMessage,
            loading: false
          }));
        } catch (error) {
          const errorMessage = error.response?.data?.error || error.message || 'Erreur lors de la suppression du message';
          set({ error: errorMessage, loading: false });
          throw error;
        }
      },

      /**
       * Clear current message
       */
      clearCurrentMessage: () => set({ currentMessage: null }),

      /**
       * Reset success state
       */
      resetSuccess: () => set({ success: false }),
    }),
    { name: 'ContactStore' }
  )
);

export { useContactStore };
