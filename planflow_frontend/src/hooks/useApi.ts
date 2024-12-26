import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

export const useApi = () => {
  const { token } = useAuth();
  const baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api`;
  const fetchWithAuth = async (url: string, options: any = {}, raw = false) => {
    try {
      const response = await axios({
        url: `${baseUrl}${url}`,
        method: options.method || "GET",
        headers: {
          ...options.headers,
          Authorization: `Token ${token}`,
        },
        data: options.body,
        responseType: raw ? "blob" : "json", // Set response type based on `raw`
      });
      // return response.data;
      return raw ? response.data : response.data;
    } catch (error) {
      console.error("API call failed", error);
      throw error;
    }
  };

  return { fetchWithAuth };
};
