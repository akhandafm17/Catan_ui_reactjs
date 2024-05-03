import {useMutation, useQueryClient} from "@tanstack/react-query";
import {declineFriendRequest} from "@core/api";

export function useDeclineFriendRequest() {
    const queryClient = useQueryClient();

    const {
        mutate,
    } = useMutation((friendRequest: number) => declineFriendRequest(friendRequest), {
        onSuccess: () => {
            queryClient.invalidateQueries(["openLobbies"]);
        },
    });

    return {
        mutateDeclineFriendRequest : mutate,
    }
}