import {FriendsContent, MainFooter, MainHeader, MainPageLayout} from "@library/components";

export const FriendsPage = () => {
    return (
        <>
            <MainPageLayout
                header={<MainHeader/>}
                content={<FriendsContent/>}
                footer={<MainFooter />}
            />
        </>
    )
}