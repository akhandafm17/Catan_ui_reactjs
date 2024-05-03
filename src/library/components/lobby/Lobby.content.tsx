import {Alert, Button, CircularProgress, MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import styles from './lobby.content.module.scss';
import {ChangeEvent, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {
    useAllAccounts,
    useAllCurrentPlayingLobbies,
    useAllOpenLobbies,
    useCreateLobby,
    useRemovePlayer
} from "@library/hooks";
import {AccountContext} from "@library/context";
import {Lobby} from "@library/types";


export const LobbyContent = () => {
    const {isLoadingAllOpenLobbies, isErrorAllOpenLobbies, allOpenLobbies, mutateAddPlayerToLobby} = useAllOpenLobbies();
    const {isLoadingAllAccounts, isErrorAllAccounts, allAccounts} = useAllAccounts();
    const {selectedPlayer} = useContext(AccountContext);
    const [filterValue, setFilterValue] = useState("");
    const [filteredLobbies, setFilteredLobbies] = useState<Lobby[]>(allOpenLobbies || []);
    const [filterNameValue, setFilterNameValue] = useState("");
    const navigate = useNavigate();
    const {mutateRemovingPlayerFromLobby} = useRemovePlayer();
    const [isFiltered, setIsFiltered] = useState(false);
    const [activeView, setActiveView] = useState('open');
    const {isLoadingCurrentPlayingLobbies, isErrorCurrentPlayingLobbies, currentPlayingLobbies} = useAllCurrentPlayingLobbies();
    const [newLobbyName, setNewLobbyName] = useState("");
    const { mutateCreateLobby } = useCreateLobby();

    if (isLoadingAllOpenLobbies || isLoadingAllAccounts || isLoadingCurrentPlayingLobbies) {
        return (
            <CircularProgress sx={{display: "block", mt: "10em", mx: "auto"}}/>
        );
    }

    if (isErrorAllOpenLobbies || !allOpenLobbies || isErrorAllAccounts || !allAccounts || isErrorCurrentPlayingLobbies || !currentPlayingLobbies) {
        return <Alert severity="error">Error loading data</Alert>;
    }

    const getOwnerNickname = (ownerId: number) => {
        const owner = allAccounts.find(account => account.id === ownerId);
        return owner ? owner.nickName : "Unknown";
    };

    const joinLobby = (lobbyId: number) => {
        const selectedAccountId = selectedPlayer ? selectedPlayer.id : null;
        if (selectedAccountId) {
            mutateAddPlayerToLobby(lobbyId);
        }
        navigate(`/game-settings/${lobbyId}`)
    };

    const handleFilterChange = (event: SelectChangeEvent<string>) => {
        setFilterValue(event.target.value as string);
    };

    const handleNameFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterNameValue(event.target.value);
    };

    const handleNameNewLobbyName = (event: ChangeEvent<HTMLInputElement>) => {
        setNewLobbyName(event.target.value);
    };

    const filterLobbiesByPlayerCountAndName = () => {
        const filtered = allOpenLobbies.filter((lobby) => {
            const matchesPlayerCount = !filterValue || lobby.accountDtos.length === parseInt(filterValue, 10);
            const matchesName = !filterNameValue || lobby.lobbyName.toLowerCase().includes(filterNameValue.toLowerCase());

            return matchesPlayerCount && matchesName;
        });
        setFilteredLobbies(filtered);
        setIsFiltered(true);
    };

    const hasJoinedLobby = (lobbyId: number) => {
        const selectedAccountId = selectedPlayer ? selectedPlayer.id : null;
        return selectedAccountId && allOpenLobbies.find(lobby => {
            const joinedAccount = lobby.accountDtos.find(account => account.id === selectedAccountId);
            return joinedAccount !== undefined && lobby.lobbyId === lobbyId;
        });
    };

    const removeFromLobby = (lobbyId: number) => {
            mutateRemovingPlayerFromLobby(lobbyId);
    };

    const createNewLobby = () => {
        mutateCreateLobby(newLobbyName);
    }

    const renderOpenLobbyCard = (lobby: Lobby) => {
        const joined = hasJoinedLobby(lobby.lobbyId);
        return (
            <div className={`${styles.card} ${styles.cardWithButtons}`} key={lobby.lobbyId}>
                <h2 className={styles.lobbyName}>{lobby.lobbyName}</h2>
                <div className={styles.contentWrapper}>
                    <p className={styles.playerSize}>{lobby.accountDtos.length}/4</p>
                    <div className={styles.createdBy}>
                        <p>Lobby aangemaakt door: {getOwnerNickname(lobby.ownerId)}</p>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    {joined ? (
                        <>
                            <Button variant="contained" color="primary" sx={{marginRight: '0.1rem'}}
                                    onClick={() => navigate(`/game-settings/${lobby.lobbyId}`)}>
                                Gamesettings
                            </Button>
                            <Button variant="contained" color="primary"
                                    onClick={() => removeFromLobby(lobby.lobbyId)}>
                                Annuleren
                            </Button>
                        </>
                    ) : (
                        <Button variant="contained" color="primary" onClick={() => joinLobby(lobby.lobbyId)}>
                            Join
                        </Button>
                    )}
                </div>
            </div>
        );
    };

    const renderCurrentPlayingLobbyCard = (lobby: Lobby) => {
        return (
            <div className={`${styles.card} ${styles.cardWithButtons}`} key={lobby.lobbyId}>
                <h2 className={styles.lobbyName}>{lobby.lobbyName}</h2>
                <div className={styles.contentWrapper}>
                    <p className={styles.playerSize}>{lobby.accountDtos.length}/4</p>
                    <div className={styles.createdBy}>
                        <p>Lobby aangemaakt door: {getOwnerNickname(lobby.ownerId)}</p>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <Button variant="contained" color="primary" sx={{marginRight: '0.1rem'}}
                            onClick={() => navigate(`/gameboard/${lobby.gameId}`)}>
                        Hervat
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <div>
            <div className={styles.lobbyFiltering}>
                <h2 className={styles.lobbyName}>Lobbies filteren:</h2>
                <div className={styles.filterContainer}>
                    <Select
                        size="small"
                        value={filterValue}
                        onChange={handleFilterChange}
                        displayEmpty
                        className={styles.playerCountDropdown}
                        sx={{backgroundColor: '#0A1828', border: '1px solid #BFA181', color: '#BFA181'}}>
                        <MenuItem value="" >Aantal spelers...</MenuItem>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                            <MenuItem key={count} value={String(count)}>
                                {count}
                            </MenuItem>
                        ))}
                    </Select>
                    <TextField
                        value={filterNameValue}
                        onChange={handleNameFilterChange}
                        placeholder="Zoek lobby..."
                        size="small"
                        className={styles.txtfield}
                    />
                    <Button variant="contained" color="primary" size="large"
                            onClick={filterLobbiesByPlayerCountAndName}>
                        Filteren
                    </Button>
                </div>
            </div>

            <div className={styles.lobbyFiltering}>
                <h2 className={styles.lobbyName}>Lobbies aanmaken:</h2>
                <div className={styles.filterMake}>
                    <TextField
                        className={styles.txtfield}
                        value={newLobbyName}
                        onChange={handleNameNewLobbyName}
                        placeholder="Lobby naam..."
                        size="small"
                    />
                    <Button variant="contained" color="primary" size="large"
                            onClick={createNewLobby}>
                        Lobby aanmaken
                    </Button>
                </div>
            </div>

            <div className={styles.lobbyInformation}>
                <div className={styles.tabButtons}>
                    <button onClick={() => setActiveView('open')} className={styles.tabButton}>Open Lobbies</button>
                    <button onClick={() => setActiveView('closed')} className={styles.tabButton}>Gesloten Lobbies
                    </button>
                    <button onClick={() => setActiveView('resumable')} className={styles.tabButton}>Hervatbare Lobbies
                    </button>
                </div>
                {activeView === 'open' && (
                    isFiltered ? filteredLobbies.map(renderOpenLobbyCard) : allOpenLobbies.map(renderOpenLobbyCard)
                )}
                {activeView === 'closed' && (
                    <p>nog implementeren - Closed Lobbies</p>
                )}
                {activeView === 'resumable' && (
                    currentPlayingLobbies.length > 0 ? currentPlayingLobbies.map(renderCurrentPlayingLobbyCard) :
                        <p>Er zijn geen hervatbare lobbies.</p>
                )}
            </div>
        </div>
    );
}
