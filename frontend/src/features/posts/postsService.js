import axios from "../../lib/axios";

class PostsService {
  async fetchAllPosts() {
    const res = await axios.get(`/api/posts`, {
      withCredentials: true,
    });
    return res.data;
  }

  async createPost(credentials) {
    console.log(credentials);
     console.log("going to hit the create post")
    const res = await axios.post(`/api/posts`,credentials?.formData, {
      headers: {
          "Content-Type": "multipart/form-data",
        },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

  
  async setAndUnsetReaction(credentials) {
    const res = await axios.put(`/api/posts/${credentials?.postId}/react`,{typeOfReaction: credentials?.type}, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

  async updatePost(credentials) {

    let formData = null;

    if(credentials?.formData) {
      formData = credentials?.formData;
    } 

    console.log("going to hit the update post")
    const res = await axios.put(`/api/posts/${credentials?.postId}`,formData, {
      headers: {
          "Content-Type": "multipart/form-data",
        },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

   async deletePost(credentials) {
     console.log("going to hit the delete post")
    const res = await axios.delete(`/api/posts/${credentials?.postId}`,{
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

  
  
}

export default new PostsService();
