import {useMutation, useQueryClient} from "@tanstack/react-query";
import {playYearOfPlentyCard} from "@core/api";
import {PlayYearOfPlentyCard} from "@library/types";

export function usePlayYearOfPlentyCard() {
    const queryClient = useQueryClient();

    const {
        mutate: mutatePlayYearOfPlentyCard,

    } = useMutation((data: PlayYearOfPlentyCard) => playYearOfPlentyCard(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["playYearOfPlentyCard"]);
        },
    });

    return {
        mutatePlayYearOfPlentyCard,
    };
}
