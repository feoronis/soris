import styles from './footer.module.css';


export function Footer() {

    return (
        <div className={styles.container}>
            <p className={`${styles.description} ${styles.text}`}>Soris - тулка для отслеживания количества курения, может помочь бросить, а может помочь начать больше курить</p>
            <p className={`${styles.developers} ${styles.text}`}>Разработка - feorgang</p>
        </div>
    )
}