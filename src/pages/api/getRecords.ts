// src/pages/api/getUserData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getUserDataById } from '../../../prisma/userClient/userFunctions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Настройка CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Обработка OPTIONS-запроса
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Разрешаем только GET-запросы
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            message: 'Метод не поддерживается',
            allowedMethods: ['GET']
        });
    }

    try {
        // Получаем userId из query-параметров
        const { userId } = req.query;
        console.log('user id from get records', userId);

        // Валидация параметра
        if (!userId || typeof userId !== 'string') {
            return res.status(400).json({ 
                message: 'Параметр userId обязателен и должен быть строкой',
                example: '/api/getRecords?userId=ваш-id-пользователя'
            });
        }

        console.log(`[GET] Запрос данных пользователя ${userId}`);
        const userData = await getUserDataById(userId);
        
        return res.status(200).json({
            status: 'success',
            data: userData
        });

    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        
        if (error instanceof Error && error.message.includes('не найден')) {
            return res.status(404).json({
                status: 'error',
                message: error.message
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Внутренняя ошибка сервера'
        });
    }
}