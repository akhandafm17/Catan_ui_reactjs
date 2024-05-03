import {useNavigate, useParams} from "react-router-dom";
import {useContext, useState} from "react";
import {Alert, AlertTitle, Button, CircularProgress, Grid} from "@mui/material";
import styles from "./game.settings.module.scss";
import {AccountContext} from "@library/context";
import {
    useAllAccounts,
    useLobby,
    usePlayerStatus,
    useRemovePlayer,
} from "@library/hooks";
import {Lobby} from "@library/types";

import avatar1 from "../../../../public/avatars/avatar1.gif";
import avatar2 from "../../../../public/avatars/avatar2.gif";
import avatar3 from "../../../../public/avatars/avatar3.gif";
import avatar4 from "../../../../public/avatars/avatar4.gif";
import avatar5 from "../../../../public/avatars/avatar5.gif";
import noPicture from "../../../../public/avatars/geen_profielfoto.png";
import {useAddAi} from "@library/hooks/useAddAi";
import {useRemoveAi} from "@library/hooks/useRemoveAi";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];
export const GameSettingsContent = () => {
    const {lobbyId} = useParams();
    const {selectedPlayer} = useContext(AccountContext);
    const {mutateChangePlayerStatus} = usePlayerStatus();
    const {mutateRemovingPlayerFromLobby} = useRemovePlayer();
    const navigate = useNavigate();
    const {isLoadingLobby, isErrorLobby, lobby} = useLobby(parseInt(lobbyId as string))
    const {isLoadingAllAccounts, isErrorAllAccounts, allAccounts} = useAllAccounts();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const {mutateAddAi} = useAddAi();
    const {mutateRemoveAi} = useRemoveAi();

    if (isLoadingLobby || isLoadingAllAccounts) {
        return (
            <CircularProgress sx={{display: "block", mt: "10em", mx: "auto"}}/>
        );
    }

    if (isErrorLobby || !lobby) {
        return <Alert severity="error">Lobby could not be loaded</Alert>;
    }

    if (isErrorAllAccounts || !allAccounts) {
        return <Alert severity="error">Accounts could not be loaded</Alert>;
    }

    const addAi = () => {
        mutateAddAi(parseInt(lobbyId as string));
    };
    const removeAi = () => {
        mutateRemoveAi(parseInt(lobbyId as string));
    };


    const changeStatus = (status: boolean) => {
        const selectedAccountId = selectedPlayer ? selectedPlayer.id : null;
        if (selectedAccountId) {
            const data = {
                lobbyId: parseInt(lobbyId as string),
                status: status
            };
            mutateChangePlayerStatus(data);
            showAlert();
        }
    };

    const removeFromLobby = () => {
        mutateRemovingPlayerFromLobby(parseInt(lobbyId as string));
        navigate('/lobby/')
    };

    const getAccount = (playerId: number) => {
        const account = allAccounts.find(acc => acc.id === playerId);
        if (account) {
            return account;
        }
        return {
            id: -1,
            nickName: 'Unknown',
            email: 'unknown@example.com',
            avatar: null,
            achievementPoints: 0
        };
    };


    const getStatusText = (status: boolean) => {
        return status ? <p>Klaar</p> : <p>Niet Klaar</p>;
    };

    const getPlayerStatus = (lobby: Lobby) => {
        const lobbystatus = lobby.statusList.find(lobbystatus => lobbystatus.playerId === selectedPlayer.id);
        return lobbystatus?.ready;
    }

    const showAlert = () => {
        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);
    }

    return (
        <>
            {!lobby.lobbyNotClosed ? (
                navigate(`/gameboard/${lobby.gameId}`)
            ) : (
                <div className={styles.gamesettings}>
                    <h1 className={styles.openLobbyHeader}>{lobby.lobbyName}:</h1>
                    <p>Het spel start zodra alle spelers hun status op "klaar" hebben gezet.</p>
                    <p>A.I. spelers toegevoegd: {lobby.aiCount}</p>
                    <Grid container spacing={2}>
                        {lobby.statusList
                            .slice()
                            .sort((a, b) => a.playerId - b.playerId)
                            .map((statuslist, index) => (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <div className={styles.friendGrid}>
                                        <div className={styles.profileInfo}>
                                            <img
                                                src={avatars.find(avatar => avatar === getAccount(statuslist.playerId).avatar) || noPicture}
                                                alt={`Avatar ${getAccount(statuslist.playerId)?.avatar}`}
                                                className={styles.profilePicture}
                                            />
                                            <p>{getAccount(statuslist.playerId).nickName}</p>
                                        </div>
                                        {getStatusText(statuslist.ready)}
                                    </div>
                                </Grid>
                            ))}

                    </Grid>
                    {showSuccessAlert && (
                        <Alert severity="success" className={styles.alert}>
                            <AlertTitle>Success</AlertTitle>
                            Status succesvol aangepast!
                        </Alert>
                    )}
                    {getPlayerStatus(lobby) ? (
                        <Button variant="contained" color="primary" className={styles.btn}
                                onClick={() => changeStatus(false)}>Niet
                            Klaar</Button>
                    ) : (
                        <Button variant="contained" color="primary" className={styles.btn}
                                onClick={() => changeStatus(true)}>Klaar</Button>
                    )
                    }
                    <Button variant="contained" color="primary" className={styles.btn}
                            onClick={() => removeFromLobby()}>Lobby verlaten</Button>
                    <Button variant="contained" color="primary" className={styles.btn}
                            onClick={() => addAi()}>Voeg A.I. toe</Button>
                    <Button variant="contained" color="primary" className={styles.btn}
                            onClick={() => removeAi()}>Verwijder A.I.</Button>

                </div>
            )}
        </>
    );
}