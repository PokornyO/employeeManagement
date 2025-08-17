import styled from "styled-components";

export const SideMenuStyle = styled.div`
    width: 250px;
    background-color: ${props => props.theme.primary};
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 1rem;
`;