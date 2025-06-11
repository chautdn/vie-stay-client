import { create } from 'zustand';

// Create a store for managing error state globally
const useErrorStore = create((set) => ({
  // Error message to display
  error: null,
  
  // Set an error message
  setError: (message) => set({ error: message }),
  
  // Clear the error message
  clearError: () => set({ error: null }),
}));

export default useErrorStore;