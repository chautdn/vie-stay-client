import { useState, useEffect } from "react";
import axiosInstance from "../utils/AxiosInstance";

export const useRoomAgreements = (roomId) => {
  const [agreements, setAgreements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAgreements = async () => {
    if (!roomId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/tenancy-agreements/room/${roomId}`
      );
      setAgreements(response.data.data.agreements || []);
    } catch (err) {
      console.error("Error fetching room agreements:", err);
      setError(err.response?.data?.message || "Failed to fetch agreements");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadAgreement = async (agreementId, fileName) => {
    try {
      const response = await axiosInstance.get(
        `/tenancy-agreements/${agreementId}/download`,
        {
          responseType: "blob",
        }
      );

      // Tạo URL và download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName || `hop-dong-${agreementId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      console.error("Error downloading agreement:", err);
      throw new Error(
        err.response?.data?.message || "Failed to download agreement"
      );
    }
  };

  useEffect(() => {
    fetchAgreements();
  }, [roomId]);

  return {
    agreements,
    isLoading,
    error,
    refetch: fetchAgreements,
    downloadAgreement,
  };
};
