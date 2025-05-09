import API from "./axiosInstance.js";

const createClient = async(clientData) => API.post("clients/create-client", clientData);
const viewClient = async(clientId) => API.get("clients/view-client", clientId);
const editClient = async (clientId, updatedData) => API.put(`clients/edit-client/${clientId}`, updatedData);
const deleteClient = async(clientId) => API.delete(`clients/delete-client/${clientId}`);
const searchClient = async (query) => API.get("clients/search-client", { params: { query } })
const totalClient = async()=>API.get("clients/view-total");
const viewAll = async() => API.get("clients/view-all")


export {createClient, viewClient, editClient, deleteClient, searchClient,totalClient,viewAll};
