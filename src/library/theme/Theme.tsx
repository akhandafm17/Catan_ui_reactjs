import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";

type Props = {
    children : React.ReactNode
}

export const Theming = ({children}: Props) => {
    const themeNormal = createTheme({
        palette: {
            primary: {
                main: '#178582',
                contrastText: '#0A1828'
            },
        },
    });

    return (
        <ThemeProvider theme={themeNormal}>
            {children}
        </ThemeProvider>
    );
};

