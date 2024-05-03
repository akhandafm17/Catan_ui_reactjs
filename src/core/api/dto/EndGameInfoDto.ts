import {SlimAccountDto} from "@core/api";

export interface EndGameInfoDto {
    id:number,
    timeFinished: Date;
    winner: SlimAccountDto;
    scores: number[];
}