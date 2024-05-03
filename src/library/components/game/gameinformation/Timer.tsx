import {useEffect, useState} from "react";
import {CircularProgress, Typography} from "@mui/material";

type Props = {
    secondsLeft: number
    secondsInTurn: number
}

export const Timer = (props: Props) => {
    const totalSeconds = props.secondsInTurn; // total time in turn
    const [timeLeft, setTimeLeft] = useState(totalSeconds * 1000);

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimeLeft(props.secondsLeft * 1000);
        }, 10);
        return () => {
            clearInterval(countdown);
        };
    }, [timeLeft, props.secondsLeft]);


    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const progress = 100 - (timeLeft / (totalSeconds * 1000)) * 100;

    const progressBarColor = timeLeft <= 10000 ? 'error' : 'primary';

    return (
        <div style={{textAlign: "center"}}>
            <Typography variant="h6" color="white" gutterBottom>
                Jouw beurt
            </Typography>
            <div style={{position: "relative", display: "inline-flex"}}>
                <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={150}
                    thickness={5}
                    color={progressBarColor}
                />
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography variant="h5" component="div" color="white">
                        {formatTime(timeLeft)}
                    </Typography>
                </div>
            </div>
        </div>
    );
};
