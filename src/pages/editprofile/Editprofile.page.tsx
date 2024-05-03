import {MainFooter, MainPageLayout, EditProfileContent, MainHeader} from "@library/components"

export const EditProfilePage = () => {
    return (
        <>
            <MainPageLayout
                header={<MainHeader/>}
                content={<EditProfileContent/>}
                footer={<MainFooter />}
            />
        </>
    )
}