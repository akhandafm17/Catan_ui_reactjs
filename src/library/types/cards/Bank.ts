import {DevelopmentCard, ResourceCard} from "@library/types";


export interface Bank{
    id: number,
    resourceCards: ResourceCard[],
    developmentCards: DevelopmentCard[]
}