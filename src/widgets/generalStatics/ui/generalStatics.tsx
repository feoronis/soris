import styles from './generalStatics.module.css';
import Image from 'next/image';
import { useEffect } from 'react';

import { getUserData } from '@/shared/api/endpoints/getRecords';
import { getAverageNumberWeek, getSumWeek, getDaysRecord, getDynamicsLastWeek } from '@/shared/getStatistic';
import { useAppDispatch, useUserData, useUserLoading } from '@/store/hooks';
import { setUserData, setLoading, UserData } from '@/store/slices/userSlice';

import { useSession } from 'next-auth/react';

export function GeneralStatics () {

    const dispatch = useAppDispatch();
    const userData = useUserData();
    const loading = useUserLoading();

    const {data: session, status} = useSession();

    useEffect(() => {
        if (status === 'authenticated') {
            const userId = session?.user?.id;
            console.log('Fetched session:', session);

            if (!userData) {
                const fetchUserData = async () => {
                    try {
                        dispatch(setLoading(true));
                        const response = await getUserData({userId});
                        if (response.data) {
                            dispatch(setUserData(response.data));
                        }
                    } catch(err) {
                        console.error('Error fetching user data:', err);
                    } finally {
                        dispatch(setLoading(false));
                    }
                };
                fetchUserData();
            }
        }
    }, [session, status]);



    if (!userData) {
        return (
            <div className={styles.container}>  
                <div className={styles.contanerDataIsEmpty}>
                    <p className={styles.textEmptyData}>Общая статистика</p>
                    <Image
                        src={'/arrowsDown.svg'}
                        alt='Стрелки вниз'
                        className={styles.arrowsDown}
                        width={50}
                        height={50}
                        priority
                    />
                    <p className={styles.textEmptyData}>Начните отслеживание</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.container} ${styles.containerData}`}>
            <p className={styles.textEmptyData}>СТАТИСТИКА</p>
            <div className={styles.containerStat}>
            
                <div className={styles.elemStat}>
                    <p className={styles.statHed}>Сегодня</p>
                    <p className={styles.statNum}>{userData.records.length > 0 ? userData.records[0].countPuffs : 0}</p>
                </div>

                <div className={styles.elemStat}>
                    <p className={styles.statHed}>Среднее кол-во</p>
                    <p className={styles.statNum}>{getAverageNumberWeek(userData)}</p>
                </div>

                <div className={styles.elemStat}>
                    <p className={styles.statHed}>За неделю</p>
                    <p className={styles.statNum}>{getSumWeek(userData)}</p>
                </div>
                
                {userData && dynamicBlockStat(userData)}

                <div className={styles.elemStat}>
                    <p className={styles.statHed}>Всего дней</p>
                    <p className={styles.statNum}>{getDaysRecord(userData)}</p>
                </div>
            </div>
        </div>
    );
}

function dynamicBlockStat (data:UserData) {
    if (!data) {
        return;
    }
    let dynamic = getDynamicsLastWeek(data);

    if (dynamic < 0) {
        return (
            <div className={styles.elemStat}>
                <p className={styles.statHed}>С прошлой недели</p>
                <p className={`${styles.statNumGreen} ${styles.statNum}`}>{dynamic}</p>
            </div>
        )
    }
    else {
        return (
            <div className={styles.elemStat}>
                <p className={styles.statHed}>С прошлой недели</p>
                <p className={`${styles.statNumRed} ${styles.statNum}`}>+{dynamic}</p>
            </div>
        )
    }
}