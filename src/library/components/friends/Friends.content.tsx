import {useNavigate, useParams} from "react-router-dom";
import {useAcceptFriendRequest, useAccount, useDeclineFriendRequest} from "@library/hooks";
import {Alert, Button, CircularProgress, Grid} from "@mui/material";
import styles from './friends.module.scss'
import {useContext} from "react";
import {FriendGrid} from "@library/components";
import {AccountContext} from "@library/context";

import avatar1 from "/public/avatars/avatar1.gif";
import avatar2 from "/public/avatars/avatar2.gif";
import avatar3 from "/public/avatars/avatar3.gif";
import avatar4 from "/public/avatars/avatar4.gif";
import avatar5 from "/public/avatars/avatar5.gif";
import noPicture from "/public/avatars/geen_profielfoto.png";
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export const FriendsContent = () => {
    const {accountId} = useParams<{ accountId: string }>();
    const {isErrorAccount, isLoadingAccount, account} = useAccount();
    const {mutateAcceptFriendRequest} = useAcceptFriendRequest();
    const {mutateDeclineFriendRequest} = useDeclineFriendRequest();
    const navigate = useNavigate();
    const {selectedPlayer} = useContext(AccountContext);

    if (isLoadingAccount) {
        return (
            <CircularProgress sx={{display: "block", mt: "10em", mx: "auto"}}/>
        );
    }

    if (isErrorAccount || !account) {
        return <Alert severity="error">Account could not be loaded</Alert>;
    }

    if (selectedPlayer.id !== parseInt(accountId as string)){
        navigate(`/`);
    }

    const handleAcceptFriendRequest = (friendRequestId: number) => {
        mutateAcceptFriendRequest(friendRequestId)
    }

    const handleDeclineFriendRequest = (friendRequestId: number) => {
        mutateDeclineFriendRequest(friendRequestId)
    }

    return (
        <div>
            <div className={styles.addFriends} style={{ marginBottom: '1rem' }}>
                <h2>Vriendschapsverzoeken:</h2>
                {account.friendRequests && account.friendRequests.length === 0 ? (
                    <p>Je hebt geen vriendschapsverzoeken</p>
                ) : (
                    <Grid container spacing={2}>
                        {account.friendRequests && account.friendRequests.map((friendrequest) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={friendrequest.id}>
                                <div className={styles.friendGrid}>
                                    <div className={styles.profileInfo}>
                                        <img
                                            src={avatars.find(avatar => avatar.includes(friendrequest.accountInviter.avatar)) || noPicture}
                                            alt={`Avatar ${friendrequest.accountInviter.avatar}`}
                                            className={styles.profilePicture}
                                        />
                                        <p>{friendrequest.accountInviter.nickName}</p>
                                    </div>
                                    <Button className={styles.btn} variant="contained" color="primary"
                                            onClick={() => handleAcceptFriendRequest(friendrequest.id)}>
                                        Accepteren
                                    </Button>
                                    <Button className={styles.btn} variant="contained" color="primary"
                                            onClick={() => handleDeclineFriendRequest(friendrequest.id)}>
                                        Weigeren
                                    </Button>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                )}

            </div>
            <div className={styles.addFriends}>
                <h2>Vrienden:</h2>
                {account.friends && account.friends.length === 0 ? (
                    <p>Je hebt nog geen vrienden</p>
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
        </div>
    )

}