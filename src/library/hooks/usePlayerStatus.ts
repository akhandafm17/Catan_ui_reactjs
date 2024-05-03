import {useMutation, useQueryClient} from "@tanstack/react-query";
import {changePlayerStatus, PlayerStatusDto} from "@core/api";


export function usePlayerStatus() {
    const queryClient = useQueryClient();

    const {
        mutate,
        isLoading: isLoadingChangingPlayerStatus,
        isError: isErrorChangingPlayerStatus,
    } = useMutation((data: PlayerStatusDto) => changePlayerStatus(data), {
        onSuccess: () => {
            queryClient.invalidateQueries(["changestatus"]);
        },
    });

    return {
        mutateChangePlayerStatus: mutate,
        isLoadingChangingPlayerStatus,
        isErrorChangingPlayerStatus
    }
}