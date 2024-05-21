import axios from "axios";

export default async function getImages(query, page) {
  const BASE_URL = "https://api.unsplash.com/";
  const endpoint = "/search/photos";
  const params = new URLSearchParams({
    query,
    client_id: "I3cyp7xXq-3udVez1FZJeYM4Mjjw4Xf1wbfZ1Z_CEGQ",
    page,
  });
  const response = await axios.get(`${BASE_URL}${endpoint}?${params}`);
  return response.data;
}