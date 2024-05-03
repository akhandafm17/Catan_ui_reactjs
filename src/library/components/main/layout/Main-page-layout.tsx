import styles from './main-page-layout.module.scss';
import * as React from "react";

type Props = {
    children?: React.ReactNode;
    header?: React.ReactNode;
    content?: React.ReactNode;
    footer?: React.ReactNode;
};
export const MainPageLayout = ({ header, content, footer }: Props) => {
    return (
        <>
            <div className={styles.main}>
                <div>{header}</div>
                <div className={styles.footerDivider}>
                    <div className={styles.content}>{content}</div>
                    <div className={styles.footer}>{footer}</div>
                </div>
            </div>
        </>
    );
};