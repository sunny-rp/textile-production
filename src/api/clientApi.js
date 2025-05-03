import API from "./axiosInstance.js";

const createClient = async(clientData) => API.post("clients/create-client", clientData);
const viewClient = async(clientId) => API.get("clients/view-client", clientId);
const editClient = async(clientId) => API.put("clients/edit-client", clientId);
const deleteClient = async(clientId) => API.delete("clients/delete-client", clientId);
const searchClient = async(query) => API.get("clients/search-client", query);
const totalClient = async()=>API.get("clients/view-total");
// router.route("/view-all").get(authentication, viewAllClients)


export {createClient, viewClient, editClient, deleteClient, searchClient,totalClient};
