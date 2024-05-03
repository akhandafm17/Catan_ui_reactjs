import {useMutation, useQueryClient} from "@tanstack/react-query";
import {playMonopolyCard} from "@core/api";
import {PlayMonopolyCard} from "@library/types";

export function usePlayMonopolyCard() {
    const queryClient = useQueryClient();

    const {
        mutate: mutatePlayMonopolyCard,

    } = useMutation((data: PlayMonopolyCard) => playMonopolyCard(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["playYearOfPlentyCard"]);
        },
    });

    return {
        mutatePlayMonopolyCard,
    };
}