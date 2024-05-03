import {SlimAccountDto} from "@core/api/dto/SlimAccountDto.ts";

export interface FriendRequestDto {
    id: number;
    accountInviter: SlimAccountDto;
    accountInvited: SlimAccountDto;
}