import axios from "../../lib/axios";

class AuthService {
  async fetchCurrentUser() {
    const res = await axios.get(`/api/auth/me`, {
      withCredentials: true,
    });
    return res.data;
  }
  async login(credentials) {
    const res = await axios.post(`/api/auth/login`, credentials, {
      withCredentials: true,
    });

    return res.data;
  }

  async signup(credentials) {
    const res = await axios.post(`/api/auth/signup`, credentials, {
      withCredentials: true,
    });

    return res.data;
  }

  async socialLogin(credentials) {
    const res = await axios.post(`/api/auth/social`, credentials, {
      withCredentials: true,
    });
    console.log(res, "api");

    return res.data;
  }

  async forgotPassword(credentials) {
    const res = await axios.post(`/api/auth/forgot-password`, credentials, {
      withCredentials: true,
    });

    return res.data;
  }

  async resetPassword(credentials) {
    const res = await axios.post(
      `/api/auth/reset-password/${credentials?.token}`,
      credentials?.data,
      {
        withCredentials: true,
      }
    );

    return res.data;
  }
}

export default new AuthService();
