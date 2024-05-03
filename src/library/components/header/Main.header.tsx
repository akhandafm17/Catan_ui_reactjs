import styles from "./main.header.module.scss";
import {Button, Menu, MenuItem} from "@mui/material";
import {MouseEventHandler, useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SecurityContext from "@library/context/SecurityContext.ts";
import {AccountContext} from "@library/context";

export const MainHeader = () => {
    const {isAuthenticated, logout, login} = useContext(SecurityContext)
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
    const {selectedPlayer} = useContext(AccountContext);

    const handleClick: MouseEventHandler<SVGSVGElement> = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        login()
    }
    return (
        <div className={styles.header}>
            <div className={styles.logoNav}>
                <h1 className={styles.logo}>Team Catacombe</h1>
                {isAuthenticated() && (
                    <>
                        <p className={styles.headerItem} onClick={() => navigate(`/`)}>Start</p>
                        <p className={styles.headerItem} onClick={() => navigate(`/lobby/`)}>Lobby</p>
                    </>
                )}
            </div>

            <div className={styles.divLoginButton}>
                {isAuthenticated() ? (
                    <>
                        <p className={styles.nickName}>{selectedPlayer?.nickName}</p>
                        <div>
                            <ArrowDropDownIcon onClick={handleClick}/>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                className={styles.dropdownMenu}
                                PaperProps={{
                                    style: {
                                        backgroundColor: '#0A1828',
                                        border: '1px solid #BFA181',
                                    },
                                }}
                            >
                                <MenuItem
                                    onClick={logout}
                                    style={{ color: '#178582' }}
                                >
                                    Uitloggen
                                </MenuItem>
                                <MenuItem
                                    onClick={() => navigate(`/profile/${selectedPlayer?.id}`)}
                                    style={{ color: '#178582' }}
                                >
                                    Profiel
                                </MenuItem>
                                <MenuItem
                                    onClick={() => navigate(`/friends/${selectedPlayer?.id}`)}
                                    style={{ color: '#178582' }}
                                >
                                    Vrienden
                                </MenuItem>
                            </Menu>
                        </div>
                    </>
                ) : (
                    <Button
                        className={styles.loginButton}
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                )}
            </div>
        </div>
    );

};

