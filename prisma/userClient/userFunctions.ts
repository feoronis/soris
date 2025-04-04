import prisma from './prismaClient';

async function createUser() {
  try {
    const newUser = await prisma.user.create({
      data: {
        totalCount: 0,
        records: {
          create: [], 
        },
      },
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
      // Получаем текущие данные пользователя с записями
      const user = await getUserDataById(userId);

      // Получаем последнюю запись пользователя
      const lastRecord = user.records.length > 0 ? user.records[user.records.length - 1] : null;
      const today = new Date();
      
      // Преобразуем дату последней записи и текущую дату к формату (YYYY-MM-DD) для сравнения
      const formatDate = (date: Date) => date.toISOString().split("T")[0];
      const lastRecordDate = lastRecord ? formatDate(lastRecord.date) : null;
      const todayDate = formatDate(today);

      let updatedTotalCount = user.totalCount;
      let incrementValue = 0;
      let newRecordData = null;

      if (countPuffs !== 0) {
          // Увеличиваем totalCount на countPuffs
          updatedTotalCount += countPuffs;
          incrementValue = countPuffs;

          // Проверяем, совпадает ли дата последней записи с текущей
          if (lastRecordDate === todayDate) {
              // Обновляем последнюю запись
              await prisma.record.update({
                  where: { id: lastRecord.id },
                  data: {
                      countPuffs: { increment: countPuffs },
                  },
              });
          } else {
              // Создаем новую запись
              newRecordData = {
                  date: today,
                  countPuffs: countPuffs,
              };
          }
      }

      if (totalCount !== 0) {
        let delta = 0;
        
        if (user.records.length == 0) {
            // Первая запись - сохраняем totalCount, но не учитываем в countPuffs
            updatedTotalCount = totalCount;
            // Создаем запись с нулевым countPuffs для текущего дня
            newRecordData = {
                date: today,
                countPuffs: 0
            };
        } else {
            // Для существующих записей - обычная логика расчета
            const previousRemainder = updatedTotalCount % 10000;
            
            if (totalCount < previousRemainder) {
                // Случай сброса счетчика
                delta = (10000 - previousRemainder) + totalCount;
            } else {
                // Обычный случай
                delta = totalCount - previousRemainder;
            }
            
            updatedTotalCount += delta;
            incrementValue = delta;
    
            if (lastRecordDate === todayDate) {
                // Обновляем запись за сегодня
                await prisma.record.update({
                    where: { id: lastRecord.id },
                    data: {
                        countPuffs: { increment: delta },
                    },
                });
            } else {
                // Создаем новую запись за сегодня
                newRecordData = {
                    date: today,
                    countPuffs: delta,
                };
            }
        }
    }

      // Обновляем пользователя
      const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
              totalCount: updatedTotalCount,
              records: newRecordData ? { create: newRecordData } : undefined,
          },
          include: { records: true },
      });
      console.log(updatedUser, 'updatedUser');
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
          include: { records: {
            orderBy: {
                date: 'asc'
            }
          } },
      });

      if (!user) {
          throw new Error(`Пользователь с id ${userId} не найден`);
      }

      console.log(`Данные пользователя ${userId}:`, user);
      return user;
  } catch (error) {
      console.error(`Ошибка при получении данных пользователя ${userId}:`, error);
      throw error;
  }
}



export { createUser, addRecordToUser, getUserDataById };
