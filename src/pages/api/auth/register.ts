import { NextApiRequest, NextApiResponse } from 'next';
import { createUser } from '../../../../prisma/userClient/userFunctions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: 'error',
      message: 'Method not allowed' 
    });
  }

  try {
    const { login, password } = req.body;
    
    if (!login || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Login and password are required'
      });
    }

    // Используем вашу существующую функцию
    const newUser = await createUser(login, password);

    return res.status(201).json({
      status: 'success',
      data: {
        id: newUser.id,
        login: newUser.login,
        createdAt: newUser.createdAt
      }
    });

  } catch (error: any) {
    console.error('Error in user creation API:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        status: 'error',
        message: 'Login already exists' 
      });
    }
    
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Internal server error'
    });
  }
}