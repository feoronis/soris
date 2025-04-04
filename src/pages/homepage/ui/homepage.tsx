import styles from './homepage.module.css';
import { GeneralStatics } from '@/widgets/generalStatics';
import { AmountToday } from '@/widgets/amountToday';
import { ChartBlock } from '@/widgets/chartBlock';

export function Homepage () {

    return (
        <div className={styles.containerPage}>
            <div className={styles.containerElem}>
                <GeneralStatics/>
            </div>

            <div className={styles.containerElem}>
                <AmountToday/>
            </div>

            <div className={styles.containerElem}>
                <ChartBlock/>
            </div>
        </div>
    )
}