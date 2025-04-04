import styles from './header.module.css';
import Image from 'next/image';


export function Header() {

    return (
        <div className={styles.container}>
            <p className={styles.logo}>SORIS</p>
            <div className={styles.navBar}>
                <div className={styles.mobileNav}>
                    <Image
                        src='/headerNavBar.svg'
                        alt='Открыть навигацию'
                        className={styles.navBarImage}
                        width={40}
                        height={40}
                    />
                </div>

                <div className={styles.fullNav}>
                    <p className={styles.navElem}>Вход</p>
                    <p className={styles.navElem}>Настройки</p>
                </div>
            </div>
        </div>
    )
}