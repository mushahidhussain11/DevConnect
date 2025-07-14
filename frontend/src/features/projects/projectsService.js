import axios from "../../lib/axios";

class ProjectsService {
  async fetchAllProjects() {
    const res = await axios.get(`/api/projects`, {
      withCredentials: true,
    });
    return res.data;
  }

  async createProject(credentials) {
    const res = await axios.post(`/api/projects`,credentials?.formData, {
      headers: {
          "Content-Type": "multipart/form-data",
        },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

  
  async setAndUnsetReaction(credentials) {
    const res = await axios.put(`/api/projects/${credentials?.projectId}/react`,{typeOfReaction: credentials?.type}, {
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

  async updateProject(credentials) {
    

    console.log(credentials)

    const res = await axios.put(`/api/projects/${credentials?.projectId}`,credentials?.formData, {
      headers: {
          "Content-Type": "multipart/form-data",
        },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

   async deleteProject(credentials) {
     console.log("going to hit the delete post")
    const res = await axios.delete(`/api/projects/${credentials?.projectId}`,{
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  }

  async fetchUserProjects(credentials) {
    const res = await axios.get(`/api/projects/${credentials?.id}`, {
      withCredentials: true,
    });
    return res.data;
  }

  
  
}

export default new ProjectsService();
