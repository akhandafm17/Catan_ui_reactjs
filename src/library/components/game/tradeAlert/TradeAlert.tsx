import {useAllOpenTrades} from "@library/hooks/useOpenTradesForPlayer.ts";
import CheckIcon from '@mui/icons-material/Check';
import {Resource} from "@library/types";
import styles from './tradeAlert.module.scss'
import {useAcceptTrade} from "@library/hooks/useAcceptTrade.ts";

import imgBrick from '/public/resourcecards/brick.png'
import imgGrain from '/public/resourcecards/grain.png'
import imgLumber from '/public/resourcecards/lumber.png'
import imgOre from '/public/resourcecards/ore.png'
import imgWool from '/public/resourcecards/wool.png'
const resourceCards = [imgBrick, imgGrain, imgLumber, imgOre, imgWool]
const resourceNames = ['BRICK', 'GRAIN', 'LUMBER', 'ORE', 'WOOL'];
export const TradeAlert = () => {
    const {openTrades} = useAllOpenTrades();
    const {mutateAcceptTrade} = useAcceptTrade();

    if (!openTrades) {
        return null;
    }

    const handleAccept = (tradeId: number) => {
        mutateAcceptTrade(tradeId)
    };

    return (
        <>
            {openTrades.map((trade, tradeIndex) => (
                <div key={tradeIndex} className={styles.tradeCard}>
                    <div className={styles.tradeCardIndex}>
                        {resourceNames.map((resourceName, index) => {
                            const parsedResource = resourceName as unknown as Resource;
                            const resourceAmount = (trade.providedCards && trade.providedCards[parsedResource]) || 0;
                            const resourceAmountReq = (trade.requestedCards && trade.requestedCards[parsedResource]) || 0;
                            return (
                                <div key={index} className={styles.imgcontainer}>
                                    <img
                                        className={styles.img}
                                        src={resourceCards[index]}
                                        alt={resourceName}
                                    />
                                    <p>{resourceAmount}</p>
                                    <img
                                        className={styles.img}
                                        src={resourceCards[index]}
                                        alt={resourceName}
                                    />
                                    <p>{resourceAmountReq}</p>
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.iconWrapper}>
                        <CheckIcon color="primary" onClick={() => handleAccept(trade.id)} style={{cursor: 'pointer'}}/>
                    </div>
                </div>
            ))}
        </>
    );
};