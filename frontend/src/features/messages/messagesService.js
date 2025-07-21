import axios from "../../lib/axios";

class MessagesService {
  async fetchUserConversations(credentials) {
    const res = await axios.get(`/api/conversations/${credentials}`, {
      withCredentials: true,
    });
    return res.data;
  }

  async createConversationWithUser(credentials) {
    const res = await axios.post(`/api/conversations`,credentials, {
      withCredentials: true,
    });
    return res.data;
  }
 
  
}

export default new MessagesService();
