import styles from "./main.content.module.scss";
import { Alert, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import {GameExplanation} from "@library/components";
import {useTopAccounts} from "@library/hooks";
import SecurityContext from "@library/context/SecurityContext.ts";


export const MainContent = () => {
    const navigate = useNavigate();
    const { isAuthenticated, login } = useContext(SecurityContext);
    const { isErrorTopAccounts, isLoadingTopAccounts, topAccounts } = useTopAccounts();

    if (isLoadingTopAccounts) {
        return <CircularProgress sx={{ display: "block", mt: "10em", mx: "auto" }} />;
    }

    if (isErrorTopAccounts || !topAccounts) {
        return <Alert severity="error">Top accounts could not be loaded</Alert>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>De Kolonisten Van Catan</h1>
            <div className={styles.mainContent}>
                <div className={styles.leaderboard}>
                    <h3>Leaderboard:</h3>
                    {topAccounts.map((account, index) => (
                        <p key={account.id}>{index + 1}. {account.nickName}</p>
                    ))}
                </div>
                <div className={styles.gameExplanation}>
                    <h3>Speluitleg:</h3>
                    <GameExplanation />
                </div>
            </div>
            <div className={styles.divPlayButton}>
                {isAuthenticated() ? (
                    <Button
                        className={styles.playButton}
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            navigate(`/lobby/`);
                        }}
                    >
                        Speel nu
                    </Button>
                ) : (
                    <Button
                        className={styles.playButton}
                        variant="contained"
                        color="primary"
                        onClick={login}
                    >
                        Speel nu
                    </Button>
                )}
            </div>
        </div>
    );
};
