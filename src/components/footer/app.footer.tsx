import styles from "@/style/footer.module.css"
import Image from "next/image"
export default function AppFooter() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.topFooter}>
                    <hr className={styles.hr} />
                </div>
                <div className={styles.lastFooter}>
                    <div className={styles.left}>
                        <Image src="/PTITLOGO.png" width={100} height={100} alt="Logo" />
                        <div className={styles.content}>
                            <p></p>
                            <p>Học viện công nghệ bưu chính viễn thông cơ sở tại thành phố Hồ Chí Minh</p>
                            <p>Địa chỉ: 97, Man Thiện, Hiệp Phú, Quận 9, Thành Phố Thủ Đức, Thành Phố Hồ Chí Minh</p>
                        </div>

                    </div>
                    <div className={styles.center}>
                        <h6>Thông tin liên hệ</h6>
                        <ul>
                            <li>
                                hvcnbcvthcm@ptithcm.edu.vn
                            </li>
                            <li>
                                0825040559
                            </li>
                            <li>
                                0967385553
                            </li>
                        </ul>
                    </div>
                    <div className={styles.right}>
                        <Image className={styles.imgMap} src="/map.png" width={150} height={150} alt="map" />
                    </div>
                </div>
            </div>

        </footer>
    )
}
