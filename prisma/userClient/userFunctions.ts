import prisma from './prismaClient';
import bcrypt from 'bcryptjs';

async function createUser(login: string, password: string) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        login,
        password: hashedPassword,
        maxCounter: 10000,
        totalCount: 0,
      },
      select: {
        id: true,
        login: true,
        createdAt: true
      }
    });

    console.log('Новый пользователь создан:', newUser);
    return newUser;
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    throw error;
  }
}

async function addRecordToUser(userId: string, countPuffs: number, totalCount: number) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        records: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      throw new Error(`Пользователь с id ${userId} не найден`);
    }

    const lastRecord = user.records[0] || null;
    const today = new Date();
    const formatDate = (date: Date) => date.toISOString().split('T')[0];
    const lastRecordDate = lastRecord ? formatDate(lastRecord.date) : null;
    const todayDate = formatDate(today);

    let updatedTotalCount = user.totalCount;
    let incrementValue = 0;
    let newRecordData = null;

    if (countPuffs !== 0) {
      updatedTotalCount += countPuffs;
      incrementValue = countPuffs;

      if (lastRecordDate === todayDate) {
        await prisma.record.update({
          where: { id: lastRecord.id },
          data: { countPuffs: { increment: countPuffs } },
        });
      } else {
        newRecordData = { date: today, countPuffs };
      }
    }

    if (totalCount !== 0) {
      let delta = 0;
      
      if (user.records.length === 0) {
        updatedTotalCount = totalCount;
        newRecordData = { date: today, countPuffs: 0 };
      } else {
        const previousRemainder = updatedTotalCount % user.maxCounter;
        
        delta = totalCount < previousRemainder 
          ? (user.maxCounter - previousRemainder) + totalCount 
          : totalCount - previousRemainder;
        
        updatedTotalCount += delta;
        incrementValue = delta;

        if (lastRecordDate === todayDate) {
          await prisma.record.update({
            where: { id: lastRecord.id },
            data: { countPuffs: { increment: delta } },
          });
        } else {
          newRecordData = { date: today, countPuffs: delta };
        }
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        totalCount: updatedTotalCount,
        records: newRecordData ? { create: newRecordData } : undefined,
      },
      include: { 
        records: {
          orderBy: { date: 'desc' },
          take: 10
        }
      },
    });

    console.log('Данные пользователя обновлены:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error(`Ошибка при добавлении записи для пользователя ${userId}:`, error);
    throw error;
  }
}

async function getUserDataById(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        records: {
          orderBy: { date: 'desc' },
          take: 30
        },
        session: true
      },
    });

    if (!user) {
      throw new Error(`Пользователь с id ${userId} не найден`);
    }

    return {
      ...user,
      password: undefined // Исключаем пароль из результата
    };
  } catch (error) {
    console.error(`Ошибка при получении данных пользователя ${userId}:`, error);
    throw error;
  }
}

async function createSession(userId: string, token: string, expires: Date) {
  return await prisma.session.create({
    data: {
      userId,
      token,
      expires
    }
  });
}

async function deleteSession(userId: string) {
  return await prisma.session.deleteMany({
    where: { userId }
  });
}

export { 
  createUser, 
  addRecordToUser, 
  getUserDataById,
  createSession,
  deleteSession
};