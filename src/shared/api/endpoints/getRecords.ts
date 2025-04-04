import apiClient from "../base";

// Тип для параметров запроса
export interface GetUserDataParams {
  userId: string;
}

// Тип ответа от сервера
export interface UserDataResponse {
  status: 'success' | 'error';
  data?: {
    id: string;
    totalCount: number;
    records: Array<{
      id: string;
      date: string;
      countPuffs: number;
    }>;
  };
  message?: string;
}

// Функция для получения данных пользователя
export const getUserData = async ({ userId }: GetUserDataParams): Promise<UserDataResponse> => {
  try {
    console.log('Запрос данных пользователя в api/endpoints/getUserData');
    
    const response = await apiClient.get('/api/getRecords', {
      params: { userId }
    });
    
    return response.data;
    
  } catch (error) {
    console.error("Ошибка при получении данных пользователя:", error);
    throw error;
  }
};