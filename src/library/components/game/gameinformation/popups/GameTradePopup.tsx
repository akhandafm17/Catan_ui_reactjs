import styles from './gameTradePopup.module.scss';
import {Button} from "@mui/material";
import {ChangeEvent, Dispatch, SetStateAction, useContext, useState} from "react";
import {AccountContext} from "@library/context";
import {useAddTrade} from "@library/hooks/useAddTrade.ts";
import {useTradeWithBank} from "@library/hooks/useTradeWithBank.ts";


import imgBrick from '/public/resourcecards/brick.png'
import imgGrain from '/public/resourcecards/grain.png'
import imgLumber from '/public/resourcecards/lumber.png'
import imgOre from '/public/resourcecards/ore.png'
import imgWool from '/public/resourcecards/wool.png'
import {Game, Player} from "@library/types";

const resourceCards = [imgBrick, imgGrain, imgLumber, imgOre, imgWool];
const resourceNames = ['BRICK', 'GRAIN', 'LUMBER', 'ORE', 'WOOL'];
type ResourceState = Record<string, number>;

type Props = {
    closePopup: () => void;
    players: Player[];
    game: Game;
};

export const GameTradePopup = (props: Props) => {
    const {selectedPlayer} = useContext(AccountContext);
    const {mutateAddingTrade} = useAddTrade();
    const {mutateTradeWithBank} = useTradeWithBank();
    const [activeView, setActiveView] = useState('player');

    const createStateObject = (initialValue: number) => {
        return resourceNames.reduce((acc, resourceName) => {
            acc[resourceName] = initialValue;
            return acc;
        }, {} as Record<string, number>);
    };

    const [requested, setRequested] = useState(createStateObject(0));
    const [provided, setProvided] = useState(createStateObject(0));
    const [bankProvided, setBankProvided] = useState(createStateObject(0));
    const [bankRequested, setBankRequested] = useState(createStateObject(0));

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement>,
        resourceName: string,
        setFunction: Dispatch<SetStateAction<ResourceState>>
    ) => {
        const value = parseInt(e.target.value, 10) || 0;
        setFunction((prev: ResourceState) => ({...prev, [resourceName]: value}));
    };


    const handleCloseClickBank = () => {
        const sendingPlayer = props.players.find(player => player.accountId === selectedPlayer.id)
        if (sendingPlayer) {
            const data = {
                id: -1,
                gameId: props.game.gameId,
                requestedCards: bankRequested,
                providedCards: bankProvided,
            };
            mutateTradeWithBank(data);
            props.closePopup();
        }
    };

    const handleCloseClick = () => {
        const sendingPlayer = props.players.find(player => player.accountId === selectedPlayer.id)
        if (sendingPlayer) {
            const data = {
                id: -1,
                gameId: props.game.gameId,
                requestedCards: requested,
                providedCards: provided,
            };
            mutateAddingTrade(data);
            props.closePopup();
        }
    };

    const handleCancel = () => {
        props.closePopup();
    };

    return (
        <div className={styles.popup}>
            <div className={styles.tabButtons}>
                <button onClick={() => setActiveView('player')} className={styles.tabButton}>Spelers</button>
                <button onClick={() => setActiveView('bank')} className={styles.tabButton}>Bank</button>
            </div>
            {activeView === 'player' && (
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <h2 style={{textAlign: 'center', color: 'white'}}>Ruil met andere spelers</h2>
                    <h3 style={{textAlign: 'center' ,color: 'white'}}>Gewenste Grondstoffen</h3>
                    <div className={styles.resourceContainer}>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {resourceNames.map((resourceName, index) => (
                            <div key={index} className={styles.resourceItem}>
                                <img src={resourceCards[index]} alt={resourceName} style={{ width: '40px', marginRight: '10px' }} />
                                <input
                                    type="number"
                                    defaultValue={0}
                                    style={{ marginTop: '5px', width: '40px' }}
                                    onChange={(e) => handleInputChange(e, resourceName, setRequested)}
                                />
                            </div>
                        ))}
                    </div>
                    </div>

                    <h3 style={{textAlign: 'center', color: 'white'}}>Jouw Grondstoffen</h3>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {resourceNames.map((resourceName, index) => (
                            <div key={index} className={styles.resourceItem}>
                                <img src={resourceCards[index]} alt={resourceName}
                                     style={{width: '40px', marginRight: '10px'}}/>
                                <input
                                    type="number"
                                    defaultValue={0}
                                    style={{ marginTop: '5px', width: '40px' }}
                                    onChange={(e) => handleInputChange(e, resourceName, setProvided)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={styles.popupinner} style={{textAlign: 'center'}}>
                        <Button style={{textTransform: 'none'}} variant="contained" color="primary" onClick={handleCloseClick}>
                            Ruilen
                        </Button>
                    </div>
                </div>
            )}
            {activeView === 'bank' && (
                <div style={{display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '90vh'}}>
                    <h2 style={{textAlign: 'center', color: 'white'}}>Ruil met de bank</h2>
                    <h3 style={{textAlign: 'center', color: 'white'}}>Onthoud! Een bank trade is 1:4, tenzij je een trade boat hebt!</h3>


                    <h3 style={{textAlign: 'center', color: 'white'}}>Gewenste Grondstoffen</h3>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {resourceNames.map((resourceName, index) => (
                            <div key={index} className={styles.resourceItem}>
                                <img src={resourceCards[index]} alt={resourceName}
                                     style={{width: '40px', marginRight: '10px'}}/>
                                <input
                                    type="number"
                                    defaultValue={0}
                                    style={{ marginTop: '5px', width: '40px' }}
                                    onChange={(e) => handleInputChange(e, resourceName, setBankRequested)}
                                />
                            </div>
                        ))}
                    </div>

                    <h3 style={{textAlign: 'center', color: 'white'}}>Jouw Grondstoffen</h3>
                    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                        {resourceNames.map((resourceName, index) => (
                            <div key={index} className={styles.resourceItem}>
                                <img src={resourceCards[index]} alt={resourceName}
                                     style={{width: '40px', marginRight: '10px'}}/>
                                <input
                                    type="number"
                                    defaultValue={0}
                                    style={{ marginTop: '5px', width: '40px' }}
                                    onChange={(e) => handleInputChange(e, resourceName, setBankProvided)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={styles.popupinner} style={{textAlign: 'center'}}>
                        <Button style={{textTransform: 'none'}} variant="contained" color="primary" onClick={handleCloseClickBank}>
                            Ruilen
                        </Button>
                    </div>
                </div>
            )}

            <Button style={{textTransform: 'none'}} variant="contained" color="primary" onClick={handleCancel}>
                Annuleren
            </Button>

        </div>
    );
};
