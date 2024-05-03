import {useNavigate, useParams} from "react-router-dom";
import {Alert, CircularProgress, Grid, Button, TextField} from "@mui/material";
import {ChangeEvent, useContext, useState} from "react";
import styles from './addFriends.module.scss'
import {AccountContext} from "@library/context";
import {useInvitableAccounts, useSendFriendRequest} from "@library/hooks";
import {Account} from "@library/types";

import avatar1 from "/public/avatars/avatar1.gif";
import avatar2 from "/public/avatars/avatar2.gif";
import avatar3 from "/public/avatars/avatar3.gif";
import avatar4 from "/public/avatars/avatar4.gif";
import avatar5 from "/public/avatars/avatar5.gif";
import noPicture from "/public/avatars/geen_profielfoto.png";
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

export const AddFriendsContent = () => {
    const {accountId} = useParams<{ accountId: string }>();
    const {selectedPlayer} = useContext(AccountContext);
    const {isErrorInvitableAccounts, isLoadingInvitableAccounts, invitableAccounts} = useInvitableAccounts();
    const {mutateSendFriendRequest} = useSendFriendRequest();
    const [filterNameValue, setFilterNameValue] = useState("");
    const [isFiltered, setIsFiltered] = useState(false);
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>(invitableAccounts || []);
    const navigate = useNavigate();

    if (isLoadingInvitableAccounts) {
        return (
            <CircularProgress sx={{display: "block", mt: "10em", mx: "auto"}}/>
        );
    }

    if (isErrorInvitableAccounts || !invitableAccounts || !Array.isArray(invitableAccounts)) {
        return <Alert severity="error">Accounts could not be loaded</Alert>;
    }

    if (selectedPlayer.id !== parseInt(accountId as string)){
        navigate(`/`);
    }

    const handleSendFriendRequest = (accountInvitedId: number) => {
        mutateSendFriendRequest(accountInvitedId)
    }

    const handleNameFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterNameValue(event.target.value);
    };

    const filterAccounts = () => {
        const filteredAccounts = invitableAccounts.filter(account => {
            return account.nickName.toLowerCase().includes(filterNameValue.toLowerCase());
        });
        setFilteredAccounts(filteredAccounts);
        setIsFiltered(true);
    };

    const renderAccounts = isFiltered ? filteredAccounts : invitableAccounts;

    return (
        <div>
            <div className={styles.filtering}>
                <h2 className={styles.lobbyName}>Vrienden filteren:</h2>
                <div className={styles.filteringcontainer}>
                    <TextField
                        value={filterNameValue}
                        onChange={handleNameFilterChange}
                        placeholder="Naam vriend..."
                        size="small"
                        className={styles.txtfield}
                    />
                    <Button variant="contained" color="primary" size="large"
                            onClick={filterAccounts}>
                        Filteren
                    </Button>
                </div>
            </div>
            <div className={styles.addFriends}>
                <h2>Vrienden toevoegen:</h2>
                <Grid container spacing={2}>
                    {renderAccounts.length === 0 ? (
                        <p style={{marginLeft: '1rem'}}>Er zijn geen accounts gevonden</p>
                    ) : (
                        renderAccounts.map((account) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={account.id}>
                                <div className={styles.friendGrid} >
                                    <div className={styles.profileInfo}>
                                        <img
                                            src={avatars.find(avatar => avatar.includes(account.avatar)) || noPicture}
                                            alt={`Avatar ${account.avatar}`}
                                            className={styles.profilePicture}
                                        />
                                        <p>{account.nickName}</p>
                                    </div>
                                    <Button variant="contained" color="primary"
                                            onClick={() => handleSendFriendRequest(account.id)}>
                                        Vriend toevoegen
                                    </Button>
                                </div>
                            </Grid>
                        ))
                    )}
                </Grid>
            </div>
        </div>
    );
};
