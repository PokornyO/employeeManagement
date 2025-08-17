import React from "react";
import { ProviderProps } from "../../types/layout";
import { createGlobalStyle } from "styled-components";
import {theme} from "../../constants/theme.ts";

const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
    }

    html, body {
        height: 100%;
        background-color: ${theme.background};
        color: ${theme.text};
        font-family: 'Open Sans', sans-serif;
    }

    #root {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
`;

const StyleProvider: React.FC<ProviderProps> = ({ children }) => {

    return (
        <>
            <GlobalStyle />
            {children}
        </>
    );
};

export default StyleProvider;
