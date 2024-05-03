import { ReactElement, useContext } from 'react'
import SecurityContext from "@library/context/SecurityContext.ts";
import {Main} from "@pages";

export interface RouteGuardProps {
    component: ReactElement
}

export const RouteGuard = ({ component }: RouteGuardProps) => {
    const { isAuthenticated } = useContext(SecurityContext)

    if (isAuthenticated()) {
        return component
    } else {
        return <Main/>
    }
}