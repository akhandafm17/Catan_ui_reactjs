import {useMutation, useQueryClient} from "@tanstack/react-query";
import {buyDevelopmentCard} from "@core/api/";

export function useBuyDevelopmentCard() {
    const queryClient = useQueryClient();

    const {
        mutate: mutateBuyDevelopmentCard,
    } = useMutation((gameId: number) => buyDevelopmentCard(gameId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["updateAccount"]);
        },
    });

    return {
        mutateBuyDevelopmentCard,
    };
}