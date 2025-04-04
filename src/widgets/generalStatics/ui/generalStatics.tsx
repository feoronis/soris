import styles from './generalStatics.module.css';
import Image from 'next/image';
import { useState, useEffect } from 'react';

import { getUserData, UserDataResponse } from '@/shared/api/endpoints/getRecords';
import { getAverageNumberWeek, getSumWeek, getDaysRecord, getDynamicsLastWeek } from '@/shared/getStatistic';
import { useUserData, useUserLoading } from '@/store/hooks';

export function GeneralStatics () {
    const [data, setData] = useState<UserDataResponse | null>(null);
    const userData = useUserData();
    const loading = useUserLoading();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await getUserData({userId: 'ba92ac48-e883-416c-a25c-deb85d351b0a'});
                setData(response);
            } catch(err) {
                console.log(err);
            }

        };
        fetchUserData();
    }, [])



    if (!data?.data || data?.data.records.length == 0) {
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
                    <p className={styles.statNum}>{data.data.records.length > 0 ? data.data.records[data.data.records.length - 1].countPuffs : 0}</p>
                </div>

                <div className={styles.elemStat}>
                    <p className={styles.statHed}>Среднее кол-во</p>
                    <p className={styles.statNum}>{getAverageNumberWeek(data.data)}</p>
                </div>

                <div className={styles.elemStat}>
                    <p className={styles.statHed}>За неделю</p>
                    <p className={styles.statNum}>{getSumWeek(data.data)}</p>
                </div>
                
                {data && dynamicBlockStat(data)}

                <div className={styles.elemStat}>
                    <p className={styles.statHed}>Всего дней</p>
                    <p className={styles.statNum}>{getDaysRecord(data.data)}</p>
                </div>
            </div>
        </div>
    );
}

function dynamicBlockStat (data:UserDataResponse) {
    if (!data.data) {
        return;
    }
    let dynamic = getDynamicsLastWeek(data.data);

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