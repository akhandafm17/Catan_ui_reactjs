import {LobbyContent, MainFooter, MainHeader, MainPageLayout} from "@library/components"


export const LobbyPage = () => {
    return (
        <>
            <MainPageLayout
                header={<MainHeader/>}
                content={<LobbyContent/>}
                footer={<MainFooter />}
            />
        </>
    )
}