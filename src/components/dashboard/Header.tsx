import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../services/userService';
import { useGlobal } from '../../context/GlobalContext';
import {
    Menu, MenuItem, Avatar, Stack, Badge, styled,
    Drawer, Box, IconButton, Divider, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";
import type { propsLogOut } from '../../context/GlobalContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
    width: '50px',
    height: '50px',
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '2px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const HeaderAdmin: React.FC<propsLogOut> = ({ onLogout }) => {
    const navigate = useNavigate()
    const sxAvata: SxProps<Theme> = {
        width: "100%",
        height: "100%",
        boxShadow: 'var(--shadow-xl)',

    }
    const PaperProps: SxProps<Theme> = {
        sx: {
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            maxWidth: 'calc(100%)',
            background: 'white',
            zIndex: 100,
        },
    }

    const MenuListProps: SxProps<Theme> = {
        sx: {
            paddingY: 0.5,
        },
    }

    const sxMenuItem: SxProps<Theme> = {
        justifyContent: 'start',
        paddingY: '10px',
        paddingLeft: '20px',
        color: 'black',
        zIndex: 100,
        '&:hover': {
            backgroundColor: 'var(--color-orange-700) !important',
            color: 'white !important',
            fontWeight: 600
        },
    }

    const sxPaperPropsDrawer: SxProps<Theme> = {
        sx: {
            background: 'white',
            color: 'var(--color-orange-700)',
            p: 2,
        }
    }

    const sxBox1Drawer: SxProps<Theme> = {
        width: 200,
    }

    const sxBox2Drawer: SxProps<Theme> = {
        display: 'flex',
        justifyContent: 'space-between',
        paddingY: '20px',
        cursor: 'pointer',
        alignItems: 'center',
        // position: 'relative'
    }

    const sxIconButton: SxProps<Theme> = {
        color: 'var(--color-gray-400)',
        fontSize: 'var(--text-3xl)',
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        border: '1px solid var(--color-gray-400)',
        '&:hover': {
            color: 'var(--color-orange-700)',
            border: '1px solid var(--color-orange-700)',
            background: 'white'
        }
    }

    const sxDivider: SxProps<Theme> = {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    }

    const sxListItemDrawer: SxProps<Theme> = {
        padding: '12px 24px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'var(--color-orange-700)',
            color: "white",
            fontWeight: '700',
            borderRadius: '10px'
        },
        '& .MuiListItemIcon-root': {
            color: 'inherit',
            minWidth: '40px'
        }
    }

    const sxListItemIcon: SxProps<Theme> = {
        fontSize: 'var(--text-2xl)'
    }

    const sxPrimaryTypographyProps = {
        fontSize: 'var(--text-xl)',
        fontWeight: 'medium',
        transition: 'all 0.3s ease',
    }

    const { icons, setResProfile, resProfile, sidebarOpen, setSidbarOpen,
        selectPage, listPagesDashboard, setSelectPage, imgs
    } = useGlobal()

    const getApiProfile = async () => {
        try {
            const res = await getProfile();
            setResProfile(res.data)
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
    };

    useEffect(() => {
        getApiProfile()
    }, [])

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openDrawer, setOpenDrawer] = useState<boolean>(false);

    const toggleDrawer = (state: boolean) => () => {
        setOpenDrawer(state);
    };

    return (
        <>
            <header className={`sticky top-0 flex w-full bg-white z-99 bg-white border-b-[1px] border-b-gray-200`} >
                <div className='flex justify-between p-5 w-full'>
                    <div className='flex gap-4 items-center text-3xl max-md:text-2xl '>
                        <button className='max-lg:hidden border-[1px] border-black/50 p-1 text-black/50 rounded-[10px] hover:border-orange-700 hover:text-orange-700'
                            onClick={() => {
                                setSidbarOpen(!sidebarOpen);
                            }}
                        >{icons.iconMenu}</button>
                        <button className='lg:hidden border-[1px] border-gray-400 p-1 text-black/50 rounded-[10px] hover:border-orange-700 hover:text-orange-700'
                            onClick={toggleDrawer(true)}
                        >
                            {icons.iconMenu}
                        </button>
                        <Drawer
                            anchor="left"
                            open={openDrawer}
                            sx={{ display: { lg: 'none' } }}
                            onClose={toggleDrawer(false)}
                            PaperProps={sxPaperPropsDrawer}
                        >
                            <Box sx={sxBox1Drawer}>
                                <Box sx={sxBox2Drawer}>
                                    <div className='flex justify-start items-end gap-2'>
                                        <img alt='logo' className='h-10 max-md:h-8' src={imgs.logoColor} />
                                        <p className={`text-3xl text-orange-700 font-bold max-md:text-2xl transition-all duration-300 ease-in-out`}>SPEE</p>
                                    </div>
                                    <IconButton onClick={toggleDrawer(false)} sx={sxIconButton}>
                                        {icons.iconClose}
                                    </IconButton>
                                </Box>

                                <Divider sx={sxDivider} />

                                <List>
                                    {listPagesDashboard.map((page, index) => (
                                        <ListItem
                                            component="button"
                                            key={index}
                                            onClick={() => {
                                                setSelectPage(page.title)
                                                navigate(page.path)
                                            }}
                                            sx={sxListItemDrawer}
                                        >
                                            <ListItemIcon sx={sxListItemIcon}>{page.icon}</ListItemIcon>
                                            <ListItemText
                                                primary={page.title}
                                                primaryTypographyProps={sxPrimaryTypographyProps}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider sx={sxDivider} />
                                <List>
                                    <ListItem
                                        component="button"
                                        onClick={() => {
                                            setSelectPage("Setting")
                                            navigate("/admin/setting")
                                        }}
                                        sx={sxListItemDrawer}
                                    >
                                        <ListItemIcon sx={sxListItemIcon}>{icons.iconSetting}</ListItemIcon>
                                        <ListItemText
                                            primary="Setting"
                                            primaryTypographyProps={sxPrimaryTypographyProps}
                                        />
                                    </ListItem>
                                    <ListItem
                                        component="button"
                                        onClick={onLogout}
                                        sx={sxListItemDrawer}
                                    >
                                        <ListItemIcon sx={sxListItemIcon}>
                                            <span className='rotate-[180deg]'>{icons.iconLogout}</span>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Logout"
                                            primaryTypographyProps={sxPrimaryTypographyProps}
                                        />
                                    </ListItem>
                                </List>
                            </Box>
                        </Drawer>
                        <p className=''>{selectPage}</p>
                    </div>
                    <button className='flex gap-4 items-center'
                        onClick={handleClick}
                    >
                        <Stack direction="row" spacing={2}>
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar
                                    src={resProfile?.avatar}
                                    alt="avatar"
                                    sx={sxAvata}
                                />
                            </StyledBadge >
                        </Stack>
                        <div>
                            <p className='text-lg max-md:hidden'>{resProfile?.email}</p>
                            <p className='text-sm bg-orange-700/10 text-orange-700 w-fit px-4 py-1 rounded-full border-[1px] border-orange-700/20 max-md:hidden'>{resProfile?.role}</p>
                        </div>
                        <span className='max-md:hidden'>{open ? icons.iconUp : icons.iconDown}</span>
                    </button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={PaperProps}
                        MenuListProps={MenuListProps}
                    >
                        <MenuItem onClick={() => {
                            navigate("/admin/setting", { state: { data: resProfile } })
                            handleClose()
                        }}
                            sx={sxMenuItem}
                        >
                            <div className='flex text-lg items-center gap-2'><span className=' text-xl'>{icons.iconEditUser}</span> Edit profile</div>
                        </MenuItem>
                        <MenuItem onClick={onLogout}
                            sx={sxMenuItem}
                        >
                            <div className='flex text-lg items-center gap-2'><span className='rotate-[180deg] text-xl'>{icons.iconLogout}</span> Logout</div>
                        </MenuItem>
                    </Menu>
                </div>
            </header>

        </>
    )
}

export default HeaderAdmin