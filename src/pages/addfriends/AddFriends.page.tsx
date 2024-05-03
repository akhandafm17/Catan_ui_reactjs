import {AddFriendsContent, MainFooter, MainHeader, MainPageLayout} from "@library/components";

export const AddFriendsPage = () => {
    return (
        <>
            <MainPageLayout
                header={<MainHeader/>}
                content={<AddFriendsContent/>}
                footer={<MainFooter />}
            />
        </>
    )
}