import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Adjust based on your actual API URL

const apiService = {
  register: async (userData: { email: string; password: string; name: string; phoneNumber: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  createProduct: async (token: string, productData: { name: string; description: string; startPrice: number; minSellingPrice: number; minIncrementBid: number; image: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/protected/product`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  getProduct: async (productId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/product/${productId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  getProducts: async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/protected/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  updateProduct: async (token: string, productId: string, productData: { name: string; description: string; startPrice: number; minSellingPrice: number; image: string }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/protected/product/${productId}`, productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  deleteProduct: async (token: string, productId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/protected/product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  createAuction: async (token: string, auctionData: { name: string; description: string; productId: string }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/protected/auction`, auctionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  getAuction: async (token: string, auctionId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/protected/auction/${auctionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  getAuctions: async (token: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/protected/auction`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  updateAuction: async (token: string, auctionId: string, auctionData: { name: string; description: string }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/protected/auction/${auctionId}`, auctionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },

  deleteAuction: async (token: string, auctionId: string) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/protected/auction/${auctionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },
};

export default apiService;
