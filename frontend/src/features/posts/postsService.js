import axios from "../../lib/axios";

class PostsService {
  async fetchAllPosts() {
    const res = await axios.get(`/api/posts`, {
      withCredentials: true,
    });
    return res.data;
  }

  
  async setAndUnsetReaction(credentials) {
    const res = await axios.put(`/api/posts/${credentials?.postId}/react`,{typeOfReaction: credentials?.type}, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

  
  
}

export default new PostsService();
