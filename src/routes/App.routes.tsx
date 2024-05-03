import { createBrowserRouter } from 'react-router-dom';
import {LobbyPage} from "@library/../pages/lobby";
import {Main, ProfilePage, GameboardPage, GameSettings, AddFriendsPage, FriendsPage} from "@pages";
import {EditProfilePage} from "../pages/editprofile";
import {RouteGuard} from "@library/components";

export const appRoutes = createBrowserRouter([
    {
        path: '/',
        element: <Main/>,
    },
    {
        path: '/lobby',
        element: <RouteGuard component={<LobbyPage/>}/>,
    },
    {
        path: '/gameboard/:gameId',
        element: <RouteGuard component={<GameboardPage/>}/>,
    },
    {
        path: '/game-settings/:lobbyId',
        element: <RouteGuard component={<GameSettings/>}/>,
    },
    {
        path: '/profile/:accountId',
        element: <RouteGuard component={<ProfilePage/>}/>,
    },
    {
        path: '/editprofile/:accountId',
        element: <RouteGuard component={<EditProfilePage/>}/>,
    },
    {
        path: '/addfriends/:accountId',
        element: <RouteGuard component={<AddFriendsPage/>}/>,
    },
    {
        path: '/friends/:accountId',
        element: <RouteGuard component={<FriendsPage/>}/>,
    },
]);


