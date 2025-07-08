import axios from "../../lib/axios";

class UserService {
  async getProfileUser(credentials) {
    const res = await axios.get(`/api/users/${credentials?.id}`, {
      withCredentials: true,
    });
    return res.data;
  }

  async updateUserInfo(credentials) {
    const id = credentials?.formData?.get("id")
  
    const res = await axios.put(`/api/users/${id}`, credentials?.formData, {
      headers: {
          "Content-Type": "multipart/form-data",
        },
      withCredentials: true,
    });
    return res.data;
  }
  

}

export default new UserService();
