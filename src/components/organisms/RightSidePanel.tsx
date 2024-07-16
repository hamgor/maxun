import React, { useEffect, useState } from 'react';
import { Button, MenuItem, Paper, Stack, Tabs, Tab } from "@mui/material";
import { Dropdown as MuiDropdown } from '../atoms/DropdownMui';
import styled from "styled-components";
import { ActionSettings } from "../molecules/ActionSettings";
import { SelectChangeEvent } from "@mui/material/Select/Select";
import { SimpleBox } from "../atoms/Box";
import Typography from "@mui/material/Typography";
import { useGlobalInfoStore } from "../../context/globalInfo";
import { PairForEdit } from "../../pages/RecordingPage";

interface RightSidePanelProps {
  pairForEdit: PairForEdit;
}

export const RightSidePanel = ({pairForEdit}: RightSidePanelProps) => {

  const [content, setContent] = useState<string>('action');
  const [action, setAction] = React.useState<string>('');
  const [isSettingsDisplayed, setIsSettingsDisplayed] = React.useState<boolean>(false);

  const { lastAction } = useGlobalInfoStore();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setContent(newValue);
  };

  const handleActionSelect = (event: SelectChangeEvent) => {
    const { value } = event.target;
    setAction(value);
    setIsSettingsDisplayed(true);
  };

  useEffect(() => {
    if (content !== 'detail' && pairForEdit.pair !== null) {
      setContent('detail');
    }
  }, [pairForEdit])

  return (
    <Paper
      variant="outlined"
      sx={{
        height: '100%',
        width: '100%',
        backgroundColor: 'white',
        alignItems: "center",
      }}>
      <SimpleBox height={60} width='100%' background='lightGray' radius='0%'>
        <Typography sx={{ padding: '10px' }}>
          Last action:
          {` ${lastAction}`}
        </Typography>
      </SimpleBox>

      {content === 'action' ? (
          <React.Fragment>
            <ActionDescription>Type of action:</ActionDescription>
            <ActionTypeWrapper>
              <MuiDropdown
                id="action"
                label="Action"
                value={action}
                handleSelect={handleActionSelect}>
                <MenuItem value="mouse.click">click on coordinates</MenuItem>
                <MenuItem value="enqueueLinks">enqueueLinks</MenuItem>
                <MenuItem value="scrape">scrape</MenuItem>
                <MenuItem value="scrapeSchema">scrapeSchema</MenuItem>
                <MenuItem value="screenshot">screenshot</MenuItem>
                <MenuItem value="script">script</MenuItem>
                <MenuItem value="scroll">scroll</MenuItem>
              </MuiDropdown>
            </ActionTypeWrapper>

            {isSettingsDisplayed &&
                <ActionSettings action={action}/>
            }
          </React.Fragment>
        )
        : null
      }
    </Paper>
  );
};

const ActionTypeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

export const ActionDescription = styled.p`
  margin-left: 15px;
`;