import {Grid} from "@mui/material";
import styles from './friendgrid.module.scss'
import {SlimAccountDto} from "@core/api";
import {MouseEventHandler} from "react";

import avatar1 from "/public/avatars/avatar1.gif";
import avatar2 from "/public/avatars/avatar2.gif";
import avatar3 from "/public/avatars/avatar3.gif";
import avatar4 from "/public/avatars/avatar4.gif";
import avatar5 from "/public/avatars/avatar5.gif";
import noPicture from "/public/avatars/geen_profielfoto.png";
const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5];

type Props = {
    friend: SlimAccountDto;
    onClick: MouseEventHandler<HTMLDivElement>;
}

export const FriendGrid = (props: Props) => {
    return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={props.friend.id}>
            <div className={styles.friendGrid} onClick={props.onClick}>
                <div className={styles.profileInfo}>
                    <img
                        src={avatars.find(avatar => avatar.includes(props.friend.avatar)) || noPicture}
                        alt={`Avatar ${props.friend.avatar}`}
                        className={styles.profilePicture}
                    />
                    <p>{props.friend.nickName}</p>
                </div>
            </div>
        </Grid>
    );
};
