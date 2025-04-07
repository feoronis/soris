import styles from './chartBlock.module.css';
import { useState, useEffect } from 'react';
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Tooltip, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { getUserData, UserDataResponse } from '@/shared/api/endpoints/getRecords';

import { useAppDispatch, useUserData, useUserLoading } from '@/store/hooks';
import { setUserData, setLoading, UserData } from '@/store/slices/userSlice';

import { useSession } from 'next-auth/react';

ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Tooltip, TimeScale);

export function ChartBlock() {
    const [data, setData] = useState<UserDataResponse | null>(null);

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

    if (!userData || userData.records.length === 0) {
        return (
            <div className={styles.container}>
                <div className={styles.containerDataIsEmpty}>
                    <p className={styles.textEmptyData}>ДИНАМИКА</p>
                    <img
                        src="/arrowsDown.svg"
                        alt="Нет данных"
                        className={styles.arrowsDown}
                        width={50}
                        height={50}
                    />
                    <p className={styles.textEmptyData}>Нет данных для отображения</p>
                </div>
            </div>
        );
    }

    const chartData = {
        labels: userData.records.map(record => record.date),
        datasets: [
            {
                label: 'Затяжки',
                data: userData.records.map(record => record.countPuffs),
                borderColor: '#2DCBC2',
                backgroundColor: 'rgba(45, 203, 194, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#2DCBC2',
                fill: true
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'dd MMM yyyy',
                    displayFormats: {
                        day: 'dd MMM'
                    }
                },
                grid: {
                    display: false
                },
                ticks: {
                    color: '#94a3b8'
                }
            },
            y: {
                beginAtZero: true,
                grace: '10%',
                ticks: {
                    color: '#94a3b8',
                    precision: 0
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)'
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y} затяжек`
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    return (
        <div className={`${styles.container} ${styles.containerData}`}>
            <p className={styles.textEmptyData}>ДИНАМИКА</p>
            <div className={styles.chartContainer}>
                <div className={styles.chartWrapper}>
                    <Line data={chartData} options={options} />
                </div>
            </div>
            <div className={styles.statsRow}>
                <div className={styles.elemStat}>
                    <p className={styles.statHed}>Максимум</p>
                    <p className={styles.statNum}>
                        {Math.max(...userData.records.map(r => r.countPuffs))}
                    </p>
                </div>
                <div className={styles.elemStat}>
                    <p className={styles.statHed}>Минимум</p>
                    <p className={styles.statNum}>
                        {Math.min(...userData.records.map(r => r.countPuffs))}
                    </p>
                </div>
            </div>
        </div>
    );
}
