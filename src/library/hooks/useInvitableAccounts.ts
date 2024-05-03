import {useQuery} from "@tanstack/react-query";
import {getInvitableAccounts} from "@core/api";

export function useInvitableAccounts(){
    const {
        isLoading: isLoadingInvitableAccounts,
        isError: isErrorInvitableAccounts,
        data: invitableAccounts,
    } = useQuery(["account"], () => getInvitableAccounts(), {
    });

    return {
        isLoadingInvitableAccounts,
        isErrorInvitableAccounts,
        invitableAccounts,
    }
}