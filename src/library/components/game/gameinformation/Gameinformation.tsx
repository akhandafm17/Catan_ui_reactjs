import {Timer} from "@library/components";
import {Player} from "@library/types";
import styles from './gameinformation.module.scss'
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useContext, useState} from "react";
import {AccountContext} from "@library/context";
import {useFinishTurn} from "@library/hooks";
import {useBuyDevelopmentCard} from "@library/hooks/useBuyDevelopmentCard.ts";

type Props = {
    gameId: string | undefined;
    currentPlayer: Player
    players: Player[]
    toggleTradePopup: () => void;
    secondsLeft: number
    secondsInTurn: number
    gamePhase: string;
}

export const Gameinformation = (props: Props) => {
    const {selectedPlayer} = useContext(AccountContext);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const {mutateFinishTurn} = useFinishTurn();
    const {mutateBuyDevelopmentCard} = useBuyDevelopmentCard();

    const handleConfirm = () => {
        const crtPlayer = props.players.find(player => player?.accountId === selectedPlayer?.id);
        if (crtPlayer) {
            mutateFinishTurn(parseInt(props.gameId as string))
            setConfirmDialogOpen(false);
        }
    };

    const handleTradeButtonClick = () => {
        props.toggleTradePopup();
    };

    const handleBuyDevelopmentCard = () => {
        mutateBuyDevelopmentCard(parseInt(props.gameId as string))
    };

    const handleCancel = () => {
        setConfirmDialogOpen(false);
    };

    const handleButtonClick = () => {
        setConfirmDialogOpen(true);
    };

    type LegendItemProps = {
        color: string;
        label: string;
    };
    
    const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
        <p>
            <Box component={'span'}
                aria-label={`Color indicator for ${label}`}
                sx={{
                    display: 'inline-block',
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    backgroundColor: color,
                    marginRight: '8px',
                    verticalAlign: 'middle'
                }}
            />
            {label}
        </p>
    );

    return (
        <div className={styles.gameinformationContent}>
            <Timer secondsLeft={props.secondsLeft} secondsInTurn={props.secondsInTurn}/>
            <h3>Speler aan de beurt:</h3>
            <p>{props.currentPlayer?.name}</p>
            <div>
                <h3>Huidige punten:</h3>
                {Array.isArray(props.players) && props.players.length > 0 && props.players.map((player) => (
                    <p key={player.id}>{player?.name}: {player.points}</p>
                ))}
            </div>
            <div>
                <div>
                    {selectedPlayer && selectedPlayer.id === props.currentPlayer?.accountId && props.gamePhase === "Setup" && (
                        <div>
                            <Button className={styles.btn} variant="contained" color="primary"
                                    onClick={handleButtonClick}>
                                Beurt beëindigen
                            </Button>
                        </div>
                    )}
                </div>
                {selectedPlayer && selectedPlayer.id === props.currentPlayer?.accountId && props.gamePhase === "Turn" && (
                    <div className={styles.btnInformation}>
                        <div>
                            <Button className={styles.btn} variant="contained" color="primary"
                                    onClick={handleTradeButtonClick}>
                                Ruilen
                            </Button>
                        </div>
                        <div >
                            <Button className={styles.btn} variant="contained" color="primary"
                                    onClick={handleButtonClick}>
                                Beurt beëindigen
                            </Button>
                        </div>
                        <div>
                            <Button className={styles.btn} variant="contained" color="primary"
                                    onClick={handleBuyDevelopmentCard}>
                                Developmentcard kopen
                            </Button>
                        </div>
                    </div>
                )}
              <div>
                
    <h3>Legende:</h3>
    <LegendItem color="#707070" label=" Erts" />
    <LegendItem color="#8FAC8F" label=" Wol" />
    <LegendItem color="#F4D03F" label=" Graan" />
    <LegendItem color="#CB4335" label=" Baksteen" />
    <LegendItem color="#196F3D" label=" Hout" />
    <LegendItem color="#DF915E" label=" Woestijn" />
    <LegendItem color="#864AF9" label=" Wildcard" />
  </div>
            </div>
            <Dialog open={confirmDialogOpen} onClose={handleCancel}>
                <DialogTitle>Beurt beëindigen</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Weet je zeker dat je je beurt wilt beëindigen?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Annuleren</Button>
                    <Button onClick={handleConfirm} variant="contained" color="primary">
                        Bevestigen
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}