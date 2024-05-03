import {useMutation, useQueryClient} from "@tanstack/react-query";
import {sendFriendRequest} from "@core/api";

export function useSendFriendRequest() {
    const queryClient = useQueryClient();

    const {
        mutate: mutateSendFriendRequest,
    } = useMutation((accountInvitedId: number) => sendFriendRequest(accountInvitedId), {
        onSuccess: () => {
            queryClient.invalidateQueries(["updateAccount"]);
        },
    });

    return {
        mutateSendFriendRequest,
    };
}