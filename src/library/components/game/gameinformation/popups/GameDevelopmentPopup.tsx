import styles from './gameTradePopup.module.scss';
import imgBrick from '/public/resourcecards/brick.png';
import imgGrain from '/public/resourcecards/grain.png';
import imgLumber from '/public/resourcecards/lumber.png';
import imgOre from '/public/resourcecards/ore.png';
import imgWool from '/public/resourcecards/wool.png';
import { useState } from 'react';
import { Button, Checkbox } from "@mui/material";
import {usePlayYearOfPlentyCard} from "@library/hooks/usePlayYearOfPlentyCard.ts";

const resourceCards = [imgBrick, imgGrain, imgLumber, imgOre, imgWool];
const resourceNames = ['BRICK', 'GRAIN', 'LUMBER', 'ORE', 'WOOL'];

type Props = {
    gameId: string | undefined;
    closePopup: () => void;
};

export const GameDevelopmentPopup = (props: Props) => {
    const [selectedResource1, setSelectedResource1] = useState<string | null>(null);
    const [selectedResource2, setSelectedResource2] = useState<string | null>(null);
    const { mutatePlayYearOfPlentyCard } = usePlayYearOfPlentyCard();

    const handleCheckboxChange = (resource: string, type: 'resource1' | 'resource2') => {
        if (type === 'resource1') {
            setSelectedResource1(resource === selectedResource1 ? null : resource);
        } else if (type === 'resource2') {
            setSelectedResource2(resource === selectedResource2 ? null : resource);
        }
    };

    const handleCloseClick = () => {
        if (props.gameId !== undefined && selectedResource1 !== null && selectedResource2 !== null) {
            const data = {
                gameId: parseInt(props.gameId as string),
                resource1: selectedResource1,
                resource2: selectedResource2,
            };
            mutatePlayYearOfPlentyCard(data);
            props.closePopup();
        }
    };



    return (
        <div className={styles.popup}>
            <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', maxHeight: '90vh' }}>
                <h2 style={{ textAlign: 'center', color: 'white' }}>Selecteer 2 grondstoffen naar keuze van de bank</h2>
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
                    <div>
                        <h3 style={{ textAlign: 'center', color: 'white' }}>Kies grondstof 2</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {resourceNames.map((resourceName, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', margin: '0.5rem' }}>
                                    <img src={resourceCards[index]} alt={resourceName} style={{ width: '40px', marginRight: '10px' }} />
                                    <Checkbox
                                        checked={selectedResource2 === resourceName}
                                        onChange={() => handleCheckboxChange(resourceName, 'resource2')}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.popupinner} style={{ textAlign: 'center' }}>
                    <Button variant="contained" color="primary" onClick={handleCloseClick} disabled={!selectedResource1 || !selectedResource2}>
                        Accepteer
                    </Button>
                </div>
            </div>
        </div>
    )
}
