import {useNavigate, useParams} from "react-router-dom";
import {useAllAccounts} from "@library/hooks";
import {Alert, Button, CircularProgress, Grid} from "@mui/material";
import {useContext} from "react";
import {AccountContext} from "@library/context";
import styles from "@library/components/profile/content/profile.content.module.scss";
import {FriendGrid} from "@library/components";

import avatar1 from "/public/avatars/avatar1.gif";
import avatar2 from "/public/avatars/avatar2.gif";
import avatar3 from "/public/avatars/avatar3.gif";
import avatar4 from "/public/avatars/avatar4.gif";
import avatar5 from "/public/avatars/avatar5.gif";
import noPicture from "/public/avatars/geen_profielfoto.png";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export const ProfileContent = () => {
    const {accountId} = useParams();
    const {isLoadingAllAccounts, isErrorAllAccounts, allAccounts} = useAllAccounts();
    const {selectedPlayer} = useContext(AccountContext);
    const navigate = useNavigate();

    if (!accountId || isLoadingAllAccounts) {
        return (
            <CircularProgress sx={{display: "block", mt: "10em", mx: "auto"}}/>
        );
    }

    if (isErrorAllAccounts || !allAccounts) {
        return <Alert severity="error">Account could not be loaded</Alert>;
    }

    const account = allAccounts.find(account => account.id === parseInt(accountId));

    if (!account) {
        return <Alert severity="error">Account not found</Alert>;
    }

    const selectedAvatar = avatars.find(avatar => avatar.includes(account.avatar)) || noPicture;


    return (
        <div>
            <div className={styles.profileWrapper}>
                <div className={styles.profileInformation}>
                    <div className={styles.textContainer}>
                        <h2>{account.nickName}</h2>
                        <p>Achievementpoints: {account.achievementPoints}</p>
                    </div>
                    <div className={styles.buttonsContainer}>
                        {selectedPlayer.id === account.id && (
                            <Button variant="contained" color="primary"
                                    onClick={() => navigate(`/editprofile/${account.id}`)}>
                                Profiel bewerken
                            </Button>
                        )}
                    </div>
                </div>
                <div className={styles.avatarContainer}>
                    <img src={selectedAvatar} alt={`Avatar ${account.avatar}`}/>
                </div>
            </div>

            <div className={styles.friends}>
                <h2>Vrienden van {account.nickName}</h2>
                {selectedPlayer.id === account.id && (
                    <Button className={styles.addBtn} variant="contained" color="primary"
                            onClick={() => navigate(`/addfriends/${account.id}`)}>
                        Vrienden toevoegen
                    </Button>
                )}
                {Array.isArray(account.friends) && account.friends.length === 0 ? (
                    <p>{account.nickName} heeft nog geen vrienden</p>
                ) : (
                    <Grid container spacing={2}>
                        {Array.isArray(account.friends) && account.friends.map((friend) => (
                            <FriendGrid
                                friend={friend}
                                onClick={() => navigate(`/profile/${friend.id}`)}
                            />
                        ))}
                    </Grid>
                )}
            </div>

            <div className={styles.profileWrapper}>
                <div className={styles.profileInformation}>
                    <div>
                        {(!account.endGameInfos || account.endGameInfos.length === 0) ? (
                            <p>{account.nickName} heeft nog geen games gespeeld</p>
                        ) : (
                            account.endGameInfos.map((info) => (
                                <div className={styles.friendGrid}>
                                    <div className={styles.profileInfo}>
                                        <p>Date:</p>
                                        <p>{info.timeFinished.toTimeString()}</p>
                                        <p>Winner:</p>
                                        <FriendGrid
                                            friend={info.winner}
                                            onClick={() => navigate(`/profile/${info.winner.id}`)}
                                        />
                                        <p>Score: {info.scores.indexOf(0)}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
