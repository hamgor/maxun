import React, { useState, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { stopRecording } from "../../api/recording";
import { useGlobalInfoStore } from "../../context/globalInfo";
import { IconButton, Menu, MenuItem, Typography, Chip } from "@mui/material";
import { AccountCircle, Logout, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth";
import { SaveRecording } from "../molecules/SaveRecording";
import DiscordIcon from "../atoms/DiscordIcon";
import { apiUrl } from "../../apiConfig";
import MaxunLogo from "../../assets/maxunlogo.png";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

interface NavBarProps {
  recordingName: string;
  isRecording: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({
  recordingName,
  isRecording,
}) => {
  const { notify, browserId, setBrowserId } = useGlobalInfoStore();
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); // Get translation function and i18n methods

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setLangAnchorEl(null);
  };

  const logout = async () => {
    dispatch({ type: "LOGOUT" });
    window.localStorage.removeItem("user");
    const { data } = await axios.get(`${apiUrl}/auth/logout`);
    notify("success", data.message);
    navigate("/login");
  };

  const goToMainMenu = async () => {
    if (browserId) {
      await stopRecording(browserId);
      notify("warning", "Current Recording was terminated");
      setBrowserId(null);
    }
    navigate("/");
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang); // Change language dynamically
    localStorage.setItem("language", lang); // Persist language to localStorage
  };

  return (
    <NavBarWrapper>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <img
          src={MaxunLogo}
          width={45}
          height={40}
          style={{ borderRadius: "5px", margin: "5px 0px 5px 15px" }}
        />
        <div style={{ padding: "11px" }}>
          <ProjectName>Maxun</ProjectName>
        </div>
        <Chip
          label="beta"
          color="primary"
          variant="outlined"
          sx={{ marginTop: "10px" }}
        />
      </div>
      {user ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {!isRecording ? (
            <>
              <IconButton
                component="a"
                href="https://discord.gg/5GbPjBUkws"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "5px",
                  padding: "8px",
                  marginRight: "30px",
                }}
              >
                <DiscordIcon sx={{ marginRight: "5px" }} />
              </IconButton>
              <iframe
                src="https://ghbtns.com/github-btn.html?user=getmaxun&repo=maxun&type=star&count=true&size=large"
                frameBorder="0"
                scrolling="0"
                width="170"
                height="30"
                title="GitHub"
              ></iframe>
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "5px",
                  padding: "8px",
                  marginRight: "10px",
                  "&:hover": { backgroundColor: "white", color: "#ff00c3" },
                }}
              >
                <AccountCircle sx={{ marginRight: "5px" }} />
                <Typography variant="body1">{user.email}</Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    logout();
                  }}
                >
                  <Logout sx={{ marginRight: "5px" }} /> {t("logout")}
                </MenuItem>
              </Menu>
              {/* Language dropdown */}
            </>
          ) : (
            <>
              <IconButton
                onClick={goToMainMenu}
                sx={{
                  borderRadius: "5px",
                  padding: "8px",
                  background: "red",
                  color: "white",
                  marginRight: "10px",
                  "&:hover": { color: "white", backgroundColor: "red" },
                }}
              >
                <Clear sx={{ marginRight: "5px" }} />
                {t("discard")}
              </IconButton>
              <SaveRecording fileName={recordingName} />
            </>
          )}
          <IconButton
            onClick={handleLangMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: "5px",
              padding: "8px",
              marginRight: "10px",
            }}
          >
            <Typography variant="body1">{t("language")}</Typography>
          </IconButton>
          <Menu
            anchorEl={langAnchorEl}
            open={Boolean(langAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              onClick={() => {
                changeLanguage("en");
                handleMenuClose();
              }}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => {
                changeLanguage("es");
                handleMenuClose();
              }}
            >
              Español
            </MenuItem>
            <MenuItem
              onClick={() => {
                changeLanguage("ja");
                handleMenuClose();
              }}
            >
              日本語
            </MenuItem>
            <MenuItem
              onClick={() => {
                changeLanguage("ar");
                handleMenuClose();
              }}
            >
              العربية
            </MenuItem>
            <MenuItem
              onClick={() => {
                changeLanguage("zh");
                handleMenuClose();
              }}
            >
              中文
            </MenuItem>
          </Menu>
        </div>
      ) : (
       <><IconButton
       onClick={handleLangMenuOpen}
       sx={{
         display: "flex",
         alignItems: "center",
         borderRadius: "5px",
         padding: "8px",
         marginRight: "10px",
       }}
     >
       <Typography variant="body1">{t("language")}</Typography>
     </IconButton>
     <Menu
       anchorEl={langAnchorEl}
       open={Boolean(langAnchorEl)}
       onClose={handleMenuClose}
       anchorOrigin={{
         vertical: "bottom",
         horizontal: "right",
       }}
       transformOrigin={{
         vertical: "top",
         horizontal: "right",
       }}
     >
       <MenuItem
         onClick={() => {
           changeLanguage("en");
           handleMenuClose();
         }}
       >
         English
       </MenuItem>
       <MenuItem
         onClick={() => {
           changeLanguage("es");
           handleMenuClose();
         }}
       >
         Español
       </MenuItem>
       <MenuItem
         onClick={() => {
           changeLanguage("ja");
           handleMenuClose();
         }}
       >
         日本語
       </MenuItem>
       <MenuItem
         onClick={() => {
           changeLanguage("ar");
           handleMenuClose();
         }}
       >
         العربية
       </MenuItem>
       <MenuItem
         onClick={() => {
           changeLanguage("zh");
           handleMenuClose();
         }}
       >
         中文
       </MenuItem>
     </Menu></>
      )}


    </NavBarWrapper>
  );
};

const NavBarWrapper = styled.div`
  grid-area: navbar;
  background-color: white;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e0e0e0;
`;

const ProjectName = styled.b`
  color: #3f4853;
  font-size: 1.3em;
`;
