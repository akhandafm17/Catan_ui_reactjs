import {ProfileContent, MainFooter, MainPageLayout, MainHeader} from "@library/components"

export const ProfilePage = () => {
    return (
        <>
            <MainPageLayout
                header={<MainHeader/>}
                content={<ProfileContent/>}
                footer={<MainFooter />}
            />
        </>
    )
}