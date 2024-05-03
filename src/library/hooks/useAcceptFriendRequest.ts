import {useMutation, useQueryClient} from "@tanstack/react-query";
import {acceptFriendRequest} from "@core/api";

export function useAcceptFriendRequest() {
    const queryClient = useQueryClient();

    const {
        mutate,
    } = useMutation((friendRequest: number) => acceptFriendRequest(friendRequest), {
        onSuccess: () => {
            queryClient.invalidateQueries(["openLobbies"]);
        },
    });

    return {
        mutateAcceptFriendRequest: mutate,
    }
}