import {useQuery} from "@tanstack/react-query";
import {getOpenTradesForPlayer} from "@core/api";

export function useAllOpenTrades() {
    const {
        isLoading: isLoadingOpenTrades,
        isError: isErrorOpenTrades,
        data: openTrades,
    } = useQuery(["openTrades"], () => getOpenTradesForPlayer(), {
        refetchInterval: 1000,
    });

    return {
        isLoadingOpenTrades,
        isErrorOpenTrades,
        openTrades,
    }
}
