import axiosInstance from "../utils/AxiosInstance";

const API_URL = "cotenant/co-tenant-requests";

export const coTenantRequestService = {
  // Lấy danh sách yêu cầu của landlord
  getRequestsByLandlord: async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  requestCoTenant: async ({ roomId, name, phoneNumber, imageCCCD }) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("imageCCCD", imageCCCD);

    try {
      const response = await axiosInstance.post(
        `${API_URL}/room/${roomId}/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Phê duyệt yêu cầu
  approveRequest: async (requestId) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/${requestId}/approve`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Từ chối yêu cầu
  rejectRequest: async (requestId) => {
    try {
      const response = await axiosInstance.post(
        `${API_URL}/${requestId}/reject`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả yêu cầu
  getAllRequests: async () => {
    try {
      const response = await axiosInstance.get(API_URL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default coTenantRequestService;
