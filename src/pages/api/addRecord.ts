import { NextApiRequest, NextApiResponse } from 'next';
import { addRecordToUser } from '../../../prisma/userClient/userFunctions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // Разрешаем CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Обработка предварительного OPTIONS-запроса
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Метод не поддерживается' });
    }

    try {
        const { userId, countPuffs, totalCount } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'userId обязателен' });
        }

        const updatedUser = await addRecordToUser(userId, countPuffs, totalCount);
        console.log('updatedUser from add record', updatedUser);

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Ошибка:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
}
