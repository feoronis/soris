import axios from "axios";

// Получаем CSRF токен из cookie
function getCSRFToken() {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken"))
    ?.split("=")[1];
}

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Базовый URL для API
  timeout: 15000, // Таймаут запроса
  headers: {
    "Content-Type": "application/json", // Заголовок для JSON
  },
  withCredentials: true, // Устанавливаем флаг для работы с куками
  validateStatus: (status) => {
    return status >= 200 && status < 300; // Только успешные статусы
  },
});

// Интерсептор для добавления CSRF токена в заголовки запроса
apiClient.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken; // Добавляем CSRF токен в запрос
  }
  return config;
});

export default apiClient;
