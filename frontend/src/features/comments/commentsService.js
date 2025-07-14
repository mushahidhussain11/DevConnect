import axios from "../../lib/axios";

class CommentsService {
  async fetchComments(credentials) {
    console.log(credentials);
    const res = await axios.get(`/api/comments/${credentials}`, {
      withCredentials: true,
    });
    console.log(res.data)
    return res.data;
  }

  async addComment(credentials) {
    const res = await axios.post(`/api/comments/${credentials?.id}`,{text: credentials?.text}, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

   async deleteComment(credentials) {
    const res = await axios.delete(`/api/comments/${credentials?.commentId}`, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }
  
}

export default new CommentsService();
