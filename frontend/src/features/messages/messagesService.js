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

  async fetchConversationMessages(credentials) {
    console.log(credentials);
    const res = await axios.get(`/api/messages/${credentials}`, {
      withCredentials: true,
    });
    return res.data;
  }

  async deleteConversation(credentials) {
    console.log(credentials);
    const res = await axios.delete(`/api/conversations/${credentials}`, {
      withCredentials: true,
    });
    return res.data;
  }


   async sendAIMessage(credentials) {
    console.log(credentials);
    const res = await axios.post(`/api/messages/aiMessage`,credentials ,{
      withCredentials: true,
    });
    return res.data;
  }

  
 
  
}

export default new MessagesService();
