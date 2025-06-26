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

  async socialLogin(credentials) {
    const res = await axios.post(`/api/auth/social`, credentials, {
      withCredentials: true,
    });
   
    return res.data;
  }

 
}

export default new AuthService();
