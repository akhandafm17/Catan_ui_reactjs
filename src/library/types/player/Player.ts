import {Account, DevelopmentCard, Resource} from "@library/types";


export interface Player {
    id: number,
    accountId: number,
    name: string,
    points: number,
    robbersUsed: number,
    account: Account,
    gameId: number,
    resources: Record<Resource, number>;
    developmentCards: DevelopmentCard[],
}