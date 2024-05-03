import {Button, Checkbox} from "@mui/material";
import {useState} from "react";

import styles from './gameTradePopup.module.scss';
import imgBrick from '/public/resourcecards/brick.png';
import imgGrain from '/public/resourcecards/grain.png';
import imgLumber from '/public/resourcecards/lumber.png';
import imgOre from '/public/resourcecards/ore.png';
import imgWool from '/public/resourcecards/wool.png';
import {usePlayMonopolyCard} from "@library/hooks/usePlayMonopolyCard.ts";
const resourceCards = [imgBrick, imgGrain, imgLumber, imgOre, imgWool];
const resourceNames = ['BRICK', 'GRAIN', 'LUMBER', 'ORE', 'WOOL'];

type Props = {
    gameId: string | undefined;
    closePopup: () => void;
};

export const GameMonopolyCardPopup = (props: Props) => {
    const [selectedResource1, setSelectedResource1] = useState<string | null>(null);
    const { mutatePlayMonopolyCard } = usePlayMonopolyCard();

    const handleCheckboxChange = (resource: string, type: 'resource1') => {
        if (type === 'resource1') {
            setSelectedResource1(resource === selectedResource1 ? null : resource);
        }
    };

    const handleCloseClick = () => {
        if (props.gameId !== undefined && selectedResource1 !== null) {
            const data = {
                gameId: parseInt(props.gameId as string),
                resource: selectedResource1,
            };
            mutatePlayMonopolyCard(data);
            props.closePopup();
        }
    };

    return (
        <div className={styles.popup}>
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '90vh' }}>
                <h3 style={{ textAlign: 'center', color: 'white' }}>Steel 1 resource naar keuze van alle spelers</h3>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <div>
                        <h3 style={{ textAlign: 'center', color: 'white' }}>Kies grondstof 1</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {resourceNames.map((resourceName, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '0.5rem' }}>
                                    <img src={resourceCards[index]} alt={resourceName} style={{ width: '40px', marginRight: '10px' }} />
                                    <Checkbox
                                        checked={selectedResource1 === resourceName}
                                        onChange={() => handleCheckboxChange(resourceName, 'resource1')}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.popupinner} style={{ textAlign: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleCloseClick} disabled={!selectedResource1}>
                        Accepteer
                    </Button>
                </div>
            </div>
        </div>
    )
}