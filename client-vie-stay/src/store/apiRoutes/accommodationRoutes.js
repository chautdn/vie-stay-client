// API Routes Store - Updated to match your backend exactly
const API_CONFIG = {
    // Change this to your actual backend URL
    BASE_URL: "http://localhost:8080/api",
  
    // API endpoints - matching your backend routes
    ACCOMMODATION: {
      BASE: "/accommodations",
      LIST: "/accommodations", // GET with query params
      CREATE: "/accommodations", // POST
      UPDATE_STATUS: (id) => `/accommodations/${id}/status`, // PUT
    },
  }
  
  // Export for easy import
  export const API_ROUTES = API_CONFIG
  
  // Helper function to build full URL
  export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`
  }
  
  // Export individual routes for convenience
  export const ACCOMMODATION_ROUTES = {
    LIST: buildApiUrl(API_CONFIG.ACCOMMODATION.LIST),
    CREATE: buildApiUrl(API_CONFIG.ACCOMMODATION.CREATE),
    UPDATE_STATUS: (id) => buildApiUrl(API_CONFIG.ACCOMMODATION.UPDATE_STATUS(id)),
  }
  
  // API utility functions with better error handling
  export const apiClient = {
    get: async (url, config = {}) => {
      try {
        console.log("API GET:", url)
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
          ...config,
        })
  
        const data = await response.json()
        console.log("API GET Response:", data)
  
        if (!response.ok) {
          throw new Error(data.error || `HTTP error! status: ${response.status}`)
        }
  
        return data
      } catch (error) {
        console.error("API GET Error:", error)
        throw error
      }
    },
  
    post: async (url, data, config = {}) => {
      try {
        console.log("API POST:", url, data)
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
          body: JSON.stringify(data),
          ...config,
        })
  
        const responseData = await response.json()
        console.log("API POST Response:", responseData)
  
        if (!response.ok) {
          throw new Error(responseData.error || `HTTP error! status: ${response.status}`)
        }
  
        return responseData
      } catch (error) {
        console.error("API POST Error:", error)
        throw error
      }
    },
  
    put: async (url, data, config = {}) => {
      try {
        console.log("API PUT:", url, data)
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
          body: JSON.stringify(data),
          ...config,
        })
  
        const responseData = await response.json()
        console.log("API PUT Response:", responseData)
  
        if (!response.ok) {
          throw new Error(responseData.error || `HTTP error! status: ${response.status}`)
        }
  
        return responseData
      } catch (error) {
        console.error("API PUT Error:", error)
        throw error
      }
    },
  
    delete: async (url, config = {}) => {
      try {
        console.log("API DELETE:", url)
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
          ...config,
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }
  
        return response.status === 204 ? {} : await response.json()
      } catch (error) {
        console.error("API DELETE Error:", error)
        throw error
      }
    },
  }
  