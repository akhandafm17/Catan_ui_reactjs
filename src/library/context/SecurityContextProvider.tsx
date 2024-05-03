import {ReactNode, useContext, useEffect, useState} from 'react'
import {isExpired} from 'react-jwt'
import Keycloak from 'keycloak-js'
import {useCreateAccount} from "@library/hooks";
import {addAccessTokenToAuthHeader, removeAccessTokenFromAuthHeader} from "@library/services";
import SecurityContext from './SecurityContext'
import {getAccount} from "@core/api";
import {AccountContext} from "@library/context/AccountContext.ts";
import useLocalStorage from "@library/hooks/useLocalStorage.ts";

type IWithChildren = {
    children: ReactNode
}

const keycloakConfig = {
    url:(import.meta.env.VITE_KC_HOST || 'http://localhost:8180'),
    realm: "Catan-realm",
    clientId: "catan-client",
}

const keycloak: Keycloak = new Keycloak(keycloakConfig)

export default function SecurityContextProvider({children}: IWithChildren) {
    const [loggedInUser, setLoggedInUser] = useState<string | undefined>(undefined)
    const {mutateCreateAccount} = useCreateAccount();
    const {setSelectedPlayer, toggleLoginStatus} = useContext(AccountContext);
    const [, , removeStoredPlayer] = useLocalStorage('selectedPlayer');

    useEffect(() => {
        keycloak.init({onLoad: 'check-sso'})
    }, [])

    keycloak.onAuthSuccess = async () => {
        addAccessTokenToAuthHeader(keycloak.token);
        setLoggedInUser(keycloak.idTokenParsed?.name);
        mutateCreateAccount(keycloak.token)
        await getAccount().then((account) =>{
            setSelectedPlayer(account)
            toggleLoginStatus()
        })
    };

    keycloak.onAuthLogout = () => {
        removeAccessTokenFromAuthHeader()
        removeStoredPlayer()
    }

    keycloak.onAuthError = () => {
        removeAccessTokenFromAuthHeader()
        removeStoredPlayer()
    }

    keycloak.onTokenExpired = () => {
        keycloak.updateToken(-1).then(function () {
            addAccessTokenToAuthHeader(keycloak.token)
            setLoggedInUser(keycloak.idTokenParsed?.name)
            mutateCreateAccount(keycloak.token)
        })
    }

    function login() {
        const LoginOptions = {  redirectUri: window.location.origin + '/' }
        keycloak.login(LoginOptions)
    }

    function logout() {
        const LoginOptions = {  redirectUri: window.location.origin + '/' }
        keycloak.logout(LoginOptions)
    }

    function isAuthenticated() {
        if (keycloak.token) return !isExpired(keycloak.token)
        else return false
    }

    return (
        <SecurityContext.Provider
            value={{
                isAuthenticated,
                loggedInUser,
                login,
                logout
            }}
        >
            {children}
        </SecurityContext.Provider>
    )
}
