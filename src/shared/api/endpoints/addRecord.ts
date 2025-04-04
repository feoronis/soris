import apiClient from "../base";

// Типы данных для тела запроса
export interface AddRecordParams {
  userId: string;
  countPuffs?: number;
  totalCount?: number;
}

// Функция для добавления записи
export const addRecord = async ({ userId, countPuffs, totalCount }: AddRecordParams) => {
  try {
    console.log('чек в api/endpoints/addRecord');
    const response = await apiClient.post('/api/addRecord', {
      userId,
      countPuffs,
      totalCount,
    });
    return response.data; // Возвращаем ответ от сервера
  } catch (error) {
    console.error("Ошибка при добавлении записи:", error);
    throw error; // Прокидываем ошибку дальше
  }
};
