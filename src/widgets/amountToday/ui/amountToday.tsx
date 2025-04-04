import styles from './amountToday.module.css';
import { useState } from 'react';
import { addRecord } from '@/shared/api/endpoints/addRecord';
import { useAppDispatch, useUserData, useUserLoading } from '@/store/hooks';
import { setUserData, setLoading } from '@/store/slices/userSlice';

export function AmountToday () {
    const [countPuffs, setCountPuffs] = useState('');
    const [totalCount, setTotalCount] = useState('');

    const dispatch = useAppDispatch();
    const userData = useUserData();
    const loading = useUserLoading();

    const handleSubmit = async () => {
        const userId = 'ba92ac48-e883-416c-a25c-deb85d351b0a';

        if (countPuffs !== '' || totalCount !== '') {
            try {
              dispatch(setLoading(true));

              const response = await addRecord({
                userId,
                countPuffs: Number(countPuffs),
                totalCount: Number(totalCount),
              });


              if (response.records) {
                dispatch(setUserData(response));
              }
            } catch (error) {
              console.error('Ошибка при добавлении записи:', error);
            }
            finally {
              dispatch(setLoading(false));
            }
        }
    
      };


    return (
        <div className={styles.container}>  
            <p className={styles.heading}>Новая запись</p>

            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="countOfPuffs"
                name="countOfPuffs"
                placeholder="Затяжки"

                className={styles.input}

                value={countPuffs}
                onChange={(e) => setCountPuffs(e.target.value)}
            />

            <p className={styles.separator}>/</p>

            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                id="quantityСounter"
                name="quantityСounter"
                placeholder="Кол-во на счетчике"

                className={styles.input}

                value={totalCount}
                onChange={(e) => setTotalCount(e.target.value)}
            />

            <button type="submit" className={styles.btnSave} onClick={handleSubmit}>Сохранить</button>

        </div>
    )
}