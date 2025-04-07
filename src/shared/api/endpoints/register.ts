import apiClient from "../base";


export interface RegisterParams {
    login: string, 
    password: string,
}


export const Register = async ({ login, password }: RegisterParams) => {
  try {
    console.log('чек в api/endpoints/register');
    const response = await apiClient.post('/api/auth/register', {
      login, 
      password,
    });
    return response;
  } catch (error) {
    console.error("Ошибка при создании профиля", error);
    throw error;
  }
};
