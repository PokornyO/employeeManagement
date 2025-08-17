import styled from "styled-components";

export const CalendarWrapper = styled.div`
    --fc-border-color: ${(props) => props.theme.primaryLight};
    --fc-today-bg-color: ${(props) => props.theme.primaryLight};
    
    .fc {
        &-toolbar-title {
            font-size: 1.2em;
            font-weight: normal;
            color: ${(props) => props.theme.text};
        }
        
        &-col-header-cell {
            font-size: 0.9em;
            color: ${(props) => props.theme.text};
        }
        
        &-event-title {
            font-size: 0.85em;
            color: ${(props) => props.theme.text};
        }
        
        &-button {
            background-color: ${(props) => props.theme.primaryLight};
            color: ${(props) => props.theme.text};
            border: none;
            padding: 6px 12px;
            font-size: 0.9em;
            border-radius: 4px;
            cursor: pointer;

            &:hover {
                background-color: ${(props) => props.theme.primary};
            }
            
            &-primary {
                &:focus, &:not(:disabled):active:focus {
                    box-shadow: none;
                }
            }
        }
    }
`;