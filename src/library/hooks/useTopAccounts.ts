import {useQuery} from "@tanstack/react-query";
import {getTopAccounts} from "@core/api";

export function useTopAccounts() {
    const {
        isLoading: isLoadingTopAccounts,
        isError: isErrorTopAccounts,
        data: topAccounts,
    } = useQuery(["topaccounts"], getTopAccounts);

    return {
        isLoadingTopAccounts,
        isErrorTopAccounts,
        topAccounts
    }
}