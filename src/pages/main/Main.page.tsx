import {MainContent, MainFooter, MainHeader, MainPageLayout} from "@library/components";

export const Main = () => {

    return (
        <>
            <MainPageLayout
                header={<MainHeader/>}
                content={<MainContent/>}
                footer={<MainFooter />}
            />
        </>
    );
};

