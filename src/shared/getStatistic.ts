interface dataStatisticParams {
    id: string;
    totalCount: number;
    records: Array<{
      id: string;
      date: string;
      countPuffs: number;
    }>;
}

export function getAverageNumberWeek(userData: dataStatisticParams): number {
    const weekRecords = userData.records.slice(Math.max(userData.records.length - 7, 0));
    const average = weekRecords.reduce((sum, record) => sum + record.countPuffs, 0) / weekRecords.length;
    
    return Math.round(average);
}

export function getSumWeek (userData:dataStatisticParams) {
    let weekRecords = userData.records.slice(Math.max(userData.records.length - 7, 0));

    return weekRecords.reduce((sum, record) => sum + record.countPuffs, 0);
}

export function getDaysRecord (userData:dataStatisticParams) {
    return userData.records.length;
}

export function getDynamicsLastWeek(userData: dataStatisticParams): number {
    if (userData.records.length < 14) {
        return 0;
    }
    const lastTwoWeeksRecords = userData.records.slice(-14);
    
    const previousWeekRecords = lastTwoWeeksRecords.slice(0, 7);
    const currentWeekRecords = lastTwoWeeksRecords.slice(7);
    
    const previousWeekAverage = previousWeekRecords.reduce((sum, record) => sum + record.countPuffs, 0) / 7;
    const currentWeekAverage = currentWeekRecords.reduce((sum, record) => sum + record.countPuffs, 0) / 7;
    
    return Math.round(currentWeekAverage - previousWeekAverage);
}