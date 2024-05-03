import {FriendRequestDto, SlimAccountDto} from "@core/api";
import {EndGameInfoDto} from "@core/api/dto/EndGameInfoDto";

export interface Account {
    id: number;
    nickName: string;
    email: string;
    avatar: string;
    achievementPoints: number;
    friendRequests: FriendRequestDto[];
    friends: SlimAccountDto[];
    endGameInfos: EndGameInfoDto[];
}

