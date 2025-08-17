import styled from "styled-components";
import {theme} from "../../../constants/theme.ts";

export const FormContainer = styled.div`
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    max-width: 100%;
    
    @media (min-width: 768px) {
        max-width: 600px;
    }
`;

export const CenteredFormContainer = styled.div`
    background-color: ${theme.secondary};
    padding: 2rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 400px;
    margin: auto;
`;