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

  async getSuggestedUsers() {
  
  
    const res = await axios.get(`/api/users/suggestions`, {
      withCredentials: true,
    });
    
    return res.data;
  }

   async followUser(credentials) {
  
  
    const res = await axios.put(`/api/users/follow/${credentials}`,{}, {
      withCredentials: true,
    });
    
    return res.data;
  }

  async unfollowUser(credentials) {
  
  
    const res = await axios.put(`/api/users/unfollow/${credentials}`,{}, {
      withCredentials: true,
    });
    
    return res.data;
  }

  async getSearchedUsers(credentials) {
  
  
    const res = await axios.get(`/api/users/search?name=${credentials}`, {
      withCredentials: true,
    });
    
    return res.data;
  }

  

  
  

}

export default new UserService();
