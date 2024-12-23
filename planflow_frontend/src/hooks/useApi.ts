import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

export const useApi = () => {
  const { token } = useAuth();

  const fetchWithAuth = async (url: string, options: any = {}) => {
    try {
      const response = await axios({
        url,
        method: options.method || "GET",
        headers: {
          ...options.headers,
          Authorization: `Token ${token}`,
        },
        data: options.body,
      });
      return response.data;
    } catch (error) {
      console.error("API call failed", error);
      throw error;
    }
  };

  return { fetchWithAuth };
};
