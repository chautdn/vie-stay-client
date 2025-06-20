import axiosInstance from "../utils/AxiosInstance";

const API_URL = "/tenants";

export const tenantService = {
  // Lấy danh sách tenant theo roomId - SỬA LẠI
  getMyTenantsByRoomId: async (roomId) => {
    try {
      const response = await axiosInstance.get(`${API_URL}/room/${roomId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // // Lấy danh sách tenant của landlord
  // getMyTenants: async (params = {}) => {
  //   try {
  //     const response = await axiosInstance.get(API_URL, { params });
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // // Lấy danh sách tenant theo accommodationId
  // getTenantsByAccommodationId: async (accommodationId) => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `${API_URL}/accommodation/${accommodationId}`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // // Lấy chi tiết tenant từ TenancyAgreement
  // getTenantDetailsFromAgreement: async (roomId) => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `/tenancy-agreements/room/${roomId}/current`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // // Tìm kiếm tenant theo email
  // searchTenantByEmail: async (email) => {
  //   try {
  //     const response = await axiosInstance.get(`${API_URL}/search`, {
  //       params: { email },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // // Lấy chi tiết tenant
  // getTenantDetails: async (tenantId) => {
  //   try {
  //     const response = await axiosInstance.get(`${API_URL}/${tenantId}`);
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // // Lấy lịch sử thuê nhà của tenant
  // getTenantRentalHistory: async (tenantId) => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `${API_URL}/${tenantId}/rental-history`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },

  // // Lấy đánh giá của tenant
  // getTenantReviews: async (tenantId) => {
  //   try {
  //     const response = await axiosInstance.get(
  //       `${API_URL}/${tenantId}/reviews`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw error;
  //   }
  // },
};
