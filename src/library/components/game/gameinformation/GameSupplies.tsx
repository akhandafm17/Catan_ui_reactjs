import {useContext} from "react";
import {AccountContext} from "@library/context";
import {Player, Resource} from "@library/types";
import {useRollDice} from "@library/hooks/useRollDice.ts";
import styles from './gamesupplies.module.scss'

import imgBrick from '/public/resourcecards/brick.png'
import imgGrain from '/public/resourcecards/grain.png'
import imgLumber from '/public/resourcecards/lumber.png'
import imgOre from '/public/resourcecards/ore.png'
import imgWool from '/public/resourcecards/wool.png'

import die1 from '/public/dice/die1.png'
import die2 from '/public/dice/die2.png'
import die3 from '/public/dice/die3.png'
import die4 from '/public/dice/die4.png'
import die5 from '/public/dice/die5.png'
import die6 from '/public/dice/die6.png'


import building from '/public/developmentcards/build_road.png'
import knight from '/public/developmentcards/robber.png'
import monopoly from '/public/developmentcards/monopoly.png'
import yearofplenty from '/public/developmentcards/year_of_plenty.png'

const developmentCards = [building, knight, monopoly, yearofplenty]
const developmentCardNames = ['build_road', 'robber', 'monopoly', 'year_of_plenty'];

const dice = [die1, die2, die3, die4, die5, die6]
const resourceCards = [imgBrick, imgGrain, imgLumber, imgOre, imgWool]
const resourceNames = ['BRICK', 'GRAIN', 'LUMBER', 'ORE', 'WOOL'];

type Props = {
    gameId: string | undefined;
    toggleDevelopmentPopup: () => void;
    toggleMonopolyPopup: () => void;
    currentPlayer: Player
    players: Player[]
    dice: number[]
    gamePhase: string
};

export const GameSupplies = (props: Props) => {
    const {mutateRollDice} = useRollDice();
    const {selectedPlayer} = useContext(AccountContext);

    const handleDevelopmentPopup = () => {
        props.toggleDevelopmentPopup();
    };

    const handleMonopolyPopup = () => {
        props.toggleMonopolyPopup();
    };

    const handleDieClick = async () => {
        const crtPlayer = props.players.find(player => player?.accountId === selectedPlayer?.id);
        if (crtPlayer) {
            mutateRollDice(parseInt(props.gameId as string));
        }

    };

    return (
        <div className={styles.gamesuppliesContainer}>
            <div>
                {Array.isArray(props.players) && props.players.length > 0 && props.players.map((player, playerIndex) => (
                    <div key={playerIndex}>
                        <h3>{player?.name ? `${player?.name}'s kaarten:` : 'Unknown Player\'s Grondstoffen:'}</h3>
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>
                            {resourceNames.map((resourceName, index) => {
                                const parsedResource = resourceName as unknown as Resource;
                                const resourceAmount = (player.resources && player.resources[parsedResource]) || 0;

                                return (
                                    <div key={index} style={{margin: '0.125rem', textAlign: 'center', color: 'white'}}>
                                        <img className={styles.img} src={resourceCards[index]} alt={resourceName}/>
                                        <p>{resourceAmount}</p>
                                    </div>
                                );
                            })}
                            {developmentCardNames.map((cardName, index) => {
                                const cardAmount = player.developmentCards.filter(card => card.name.toLowerCase() === cardName.toLowerCase()).length;
                                const isYearOfPlenty = cardName.toLowerCase() === 'year_of_plenty' && cardAmount > 0;
                                const isMonopoly = cardName.toLowerCase() === 'monopoly' && cardAmount > 0;

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            color: 'white',
                                            margin: '0.125rem',
                                            textAlign: 'center',
                                            cursor: props.gamePhase === 'Turn' && selectedPlayer && selectedPlayer.id === props.currentPlayer?.accountId && (isYearOfPlenty || isMonopoly) ? 'pointer' : 'default',
                                            pointerEvents: props.gamePhase !== 'Turn' ? 'none' : 'auto' // Disable pointer events if not in 'turn' phase
                                        }}
                                        onClick={
                                            props.gamePhase === 'Turn' && selectedPlayer && selectedPlayer.id === props.currentPlayer?.accountId ?
                                                (isYearOfPlenty ? handleDevelopmentPopup : isMonopoly ? handleMonopolyPopup : undefined) :
                                                undefined
                                        }
                                    >
                                        <img className={styles.img} src={developmentCards[index]} alt={`development-card`} />
                                        <p>{cardAmount}</p>
                                    </div>
                                );
                            })}


                        </div>
                    </div>
                ))}
            </div>

            <div
                style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem', marginBottom: '1rem', cursor: 'pointer'}}
                onClick={handleDieClick}>
                {props.dice && props.dice.length >= 2 && props.gamePhase=== 'Rolling dice' && selectedPlayer && selectedPlayer.id === props.currentPlayer?.accountId &&
                    <>
                        <img src={dice[props.dice[0] - 1]} alt={`die`} style={{width: '3rem', height: '3rem'}}/>
                        <img src={dice[props.dice[1] - 1]} alt={`die`} style={{width: '3rem', height: '3rem'}}/>
                    </>
                }
            </div>
        </div>
    );
};
