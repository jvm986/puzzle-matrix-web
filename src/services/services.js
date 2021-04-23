import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export async function convertToken(token) {
  const data = {
    grant_type: "convert_token",
    client_id: "Yy34IaWZz7fRBTbIPOvUhqNhBhE8lA7hk60GPAzC",
    client_secret:
      "epMNJ36BhXBiJuPQ3CrAUYuj3ALDqHAB113wJ3UeroLOTTi2KOwsIKiAV5Q2WXUpnrXoaFQFUEPB43WnqGxuEPYYQsA5SOc191ImUv6qboZGaj6m30LTainwPf94B3jI",
    backend: "google-oauth2",
    token: token,
  };
  const response = await axios.post(`${API_URL}/auth/convert-token`, data);
  localStorage.setItem(
    "access_expiry",
    Date.now() + (response.data.expires_in - 10) * 100
  );
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token);
  return response;
}

export async function validateToken() {
  if (Date.now() > localStorage.getItem("access_expiry")) {
    const data = {
      grant_type: "refresh_token",
      client_id: "Yy34IaWZz7fRBTbIPOvUhqNhBhE8lA7hk60GPAzC",
      client_secret:
        "epMNJ36BhXBiJuPQ3CrAUYuj3ALDqHAB113wJ3UeroLOTTi2KOwsIKiAV5Q2WXUpnrXoaFQFUEPB43WnqGxuEPYYQsA5SOc191ImUv6qboZGaj6m30LTainwPf94B3jI",
      refresh_token: localStorage.getItem("refresh_token"),
    };
    const response = await axios.post(`${API_URL}/auth/token`, data);
    localStorage.setItem(
      "access_expiry",
      Date.now() + (response.data.expires_in - 10) * 100
    );
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    return response.data.access_token;
  }
  return localStorage.getItem("access_token");
}

export async function getPuzzleList(page) {
  const response = await axios.get(`${API_URL}/puzzle/puzzles/?page=${page}`);
  return response.data;
}

export async function getPuzzle(id) {
  const response = await axios.get(`${API_URL}/puzzle/puzzles/${id}/`);
  return response.data;
}

export async function searchWords(term) {
  const response = await axios.get(`${API_URL}/puzzle/words/?search=${term}`);
  return response.data;
}

export async function addWord(word) {
  const response = await axios.post(`${API_URL}/puzzle/words/`, word);
  return response.data;
}

export async function searchCategories(term) {
  const response = await axios.get(
    `${API_URL}/puzzle/categories/?search=${term}`
  );
  return response.data;
}

export async function addCategory(category) {
  const response = await axios.post(`${API_URL}/puzzle/categories/`, category);
  return response.data;
}

export async function submitPuzzle(puzzle) {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  };

  puzzle.groups = await Promise.all(
    puzzle.groups.map(async (group) => {
      const response = await axios.post(`${API_URL}/puzzle/groups/`, group, {
        headers: headers,
      });
      return response.data.id;
    })
  );

  const response = await axios.post(`${API_URL}/puzzle/puzzles/`, puzzle, {
    headers: headers,
  });
  return response.data;
}
