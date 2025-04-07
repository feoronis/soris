import styles from './header.module.css';
import Image from 'next/image';
import Link from 'next/link';

import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

export function Header() {
    const {data: session, status} = useSession();

    const handleLogout = async () => {
        await signOut({
            redirect: true,
            callbackUrl: '/',
        })
    }

    return (
        <div className={styles.container}>
            <Link href={'/'} className={styles.logo}>SORIS</Link>
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
                    {status === 'authenticated' ? (
                        <button onClick={handleLogout} className={styles.navElem}>Выход</button>
                    ): (
                        <Link href={'/login'} className={styles.navElem}>Вход</Link>
                    )}
                    <p className={styles.navElem}>Настройки</p>
                </div>
            </div>
        </div>
    )
}