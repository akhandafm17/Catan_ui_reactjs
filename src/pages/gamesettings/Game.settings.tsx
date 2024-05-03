import {GameSettingsContent, MainFooter, MainHeader, MainPageLayout} from "@library/components"

export const GameSettings = () => {
    return (
        <>
            <MainPageLayout
                header={<MainHeader/>}
                content={<GameSettingsContent/>}
                footer={<MainFooter />}
            />
        </>
    )
}