import {useNavigate, useParams} from "react-router-dom";
import {useAccount, useUpdatePlayer} from "@library/hooks";
import {useContext, useState} from "react";
import styles from './edit.profile.module.scss'
import {Alert, AlertTitle, Button, CircularProgress, TextField} from "@mui/material";
import {AccountContext} from "@library/context";

import avatar1 from "/public/avatars/avatar1.gif";
import avatar2 from "/public/avatars/avatar2.gif";
import avatar3 from "/public/avatars/avatar3.gif";
import avatar4 from "/public/avatars/avatar4.gif";
import avatar5 from "/public/avatars/avatar5.gif";
import noPicture from "/public/avatars/geen_profielfoto.png";

const avatars = [noPicture, avatar1, avatar2, avatar3, avatar4, avatar5];

export const EditProfileContent = () => {
    const {accountId} = useParams<{ accountId: string }>();
    const {isErrorAccount, isLoadingAccount, account} = useAccount();
    const {selectedPlayer} = useContext(AccountContext);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string>(account ? account.nickName : '');
    const {mutateAccount} = useUpdatePlayer();
    const navigate = useNavigate();
    const [selectedAvatarIndex, setSelectedAvatarIndex] = useState<number | null>(null);
    const {setSelectedPlayer} = useContext(AccountContext);
    const [showErrorAlert, setShowErrorAlert] = useState(false);


    if (isLoadingAccount) {
        return (
            <CircularProgress sx={{display: 'block', mt: '10em', mx: 'auto'}}/>
        );
    }

    if (isErrorAccount || !account) {
        return <Alert severity="error">Account could not be loaded</Alert>;
    }

    if (selectedPlayer.id !== parseInt(accountId as string)){
        navigate(`/`);
    }

    const handleUpdateProfile = () => {
        if (selectedAvatarIndex !== null && selectedAvatar) {
            const avatarParts = selectedAvatar.split('/');
            const avatarFileName = avatarParts[avatarParts.length - 1].replace(/\.[^/.]+$/, "");

            const data = {
                nickName: nickname,
                avatar: avatarFileName,
            };
            const newAccount = {
                id: account.id,
                nickName: nickname,
                email: account.email,
            };

            const avatarCost = (selectedAvatarIndex) * 10;
            const playerAchievementPoints = account.achievementPoints;

            if (playerAchievementPoints < avatarCost) {
                showAlert();
            } else {
                mutateAccount(data, {
                    onSuccess: () => {
                        setSelectedPlayer(newAccount);
                        navigate(`/profile/${account.id}`);
                    },
                });
            }
        }
    };

    const showAlert = () => {
        setShowErrorAlert(true);
        setTimeout(() => {
            setShowErrorAlert(false);
        }, 3000);
    }

    return (
        <div className={styles.edit}>
            <h2>Profiel bewerken</h2>
            <p>Profiel van {account.nickName}</p>
            <p>Aantal achievementpoints: {account.achievementPoints}</p>


            <div className={styles.edit}>
                <p>Kies een gebruikersnaam:</p>
                <TextField
                    className={styles.whiteTextField}
                    value={nickname} // Geef de nickname als waarde aan het TextField
                    onChange={(e) => setNickname(e.target.value)}
                />

                <p>Kies een avatar:</p>
                <div
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px'}}>
                    {avatars.map((avatar, index) => (
                        <div key={index}>
                            <img
                                src={avatar}
                                alt={`Avatar ${index + 1}`}
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    cursor: 'pointer',
                                    border: selectedAvatarIndex === index ? '0.2rem solid red' : 'none',
                                }}
                                onClick={() => {
                                    setSelectedAvatarIndex(index);
                                    setSelectedAvatar(avatar);
                                }}
                            />
                            <p>Points: {(index) * 10}</p>
                        </div>
                    ))}
                </div>

                {showErrorAlert && (
                    <Alert severity="error" style={{marginBottom: '10px'}}>
                        <AlertTitle>Error</AlertTitle>
                        Je hebt te weinig punten!
                    </Alert>
                )}

                {selectedPlayer.id === account.id && (
                    <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
                        Opslaan
                    </Button>
                )}
            </div>
        </div>
    );
};
