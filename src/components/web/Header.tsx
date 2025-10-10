import React, { useState, useEffect } from 'react';
import {
    TextField,
    InputAdornment, MenuItem, Menu,
    IconButton, Avatar, Stack, Badge, styled
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";
import { getProfile } from '../../services/userService';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useGlobal } from '../../context/GlobalContext';
import type { propsLogOut } from '../../context/GlobalContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
    width: '35px',
    height: '35px',
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

const HeaderWeb: React.FC<propsLogOut> = ({ onLogout }) => {
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

    const sxTextField: SxProps<Theme> = {
        width: {
            md: "50%"
        },
        '& .MuiOutlinedInput-root': {
            borderRadius: "10px",
            background: "var(--color-white)",
            padding: '3px 8px',
            transition: 'all 0.3s',
            fontSize: 'var(--text-xl)',
            border: 'none',
        },

        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
        },

        '&:hover .MuiOutlinedInput-notchedOutline': {
            outline: 'none',
            border: 'none'
        },

        '& .MuiOutlinedInput-input': {
            padding: 0
        },

        '& .MuiInputBase-input': {
            color: 'var(--color-orange-700)',
            paddingLeft: '14px',
            fontSize: 'var(--text-lg)',
            border: 'none',
        },
    }

    const sxBadge: SxProps<Theme> = {
        "& .MuiBadge-badge": {
            background: 'white',
            color: "var(--color-orange-700)",
            fontWeight: 'bold',
            fontSize: 'var(--text-sm)'
        }
    }

    const { icons, ordersNumber,
        imgs, token, email, setResProfile, resProfile
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

    const [key, setKey] = useState<string>("")

    const handleSearch = async () => {
        if (!key.trim()) {
            toast.error("You have not entered the search keyword")
            return;
        }
        navigate("/products", {
            state: { id: -2, name: key }
        })
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 1. Ngăn Menu “ăn” phím
        e.stopPropagation();
        // 2. Nếu bạn có logic riêng (Enter để search…) thì giữ lại:
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        }
    };

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            <header className='top-0 sticky z-100 px-5 bg-gradient-to-l to-orange-700 from-orange-600'>
                <div className='max-md:hidden max-w-[1500px] text-[16px] font-bold mx-auto py-1 flex justify-between items-center'>
                    <button className='text-white css-icon'
                        onClick={() => {
                            {
                                token === "" ?
                                    navigate("/login", { state: { name: "dashboard" } })
                                    :
                                    navigate("admin")
                            }
                        }}
                    >Dashboard</button>
                    <div className='flex text-white '>
                        {token === "" ?
                            <>
                                <button className='px-2 border-r-[1px] border-r-white/50 css-icon'
                                    onClick={() => {
                                        navigate("/login", { state: { name: "web" } })
                                    }}
                                >Login</button>
                                <button className='px-2 css-icon'
                                    onClick={() => {
                                        navigate("/register")
                                    }}
                                >SignUp</button>
                            </>
                            :
                            <>
                                <p className='px-2 border-r-[1px] border-r-white/50'>{email}</p>
                                <button className='px-2 css-icon' onClick={onLogout}>Logout</button>
                            </>
                        }
                    </div>
                </div>
                <div className='max-w-[1500px] mx-auto py-5 md:flex md:justify-between items-center grid gap-4'>
                    <div className='flex justify-between'>
                        <div className='flex gap-2 items-end'>
                            <img alt='logo' className='h-12 max-md:h-10' src={imgs.logo} />
                            <p className='text-3xl text-white font-bold max-md:text-2xl'>SPEE SHOP</p>
                        </div>
                        <div className='flex items-center gap-5'>
                            <button className='content-end relative md:hidden css-icon'
                                onClick={() => {
                                    navigate("/cart")
                                }}
                            >
                                <Badge badgeContent={ordersNumber} sx={sxBadge}>
                                    <span className='text-white text-3xl max-md:text-2xl'>{icons.iconCart}</span>
                                </Badge >
                            </button>
                            {token === "" ?
                                <button className='text-white text-3xl max-md:text-2xl md:hidden css-icon'
                                    onClick={() => {
                                        navigate("/login", { state: { name: "dashboard" } })
                                    }}
                                >
                                    {icons.iconUser}
                                </button>

                                :
                                <button onClick={handleClick}>
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
                                </button>
                            }
                        </div>
                    </div>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={PaperProps}
                        MenuListProps={MenuListProps}
                    >
                        <MenuItem onClick={() => navigate("admin")}
                            sx={sxMenuItem}
                        >
                            <div className='flex text-lg items-center gap-2'><span className='rotate-[180deg] text-xl'>{icons.iconDashboard}</span> Dashboard</div>
                        </MenuItem>
                        <MenuItem onClick={onLogout}
                            sx={sxMenuItem}
                        >
                            <div className='flex text-lg items-center gap-2'><span className='rotate-[180deg] text-xl'>{icons.iconLogout}</span> Logout</div>
                        </MenuItem>
                    </Menu>
                    <TextField
                        placeholder="Search for products..."
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            sx={{ color: 'var(--color-orange-700)' }}
                                            onClick={handleSearch}>
                                            {icons.iconSearch}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={sxTextField}
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button className='content-end relative max-md:hidden css-icon'
                        onClick={() => {
                            navigate("/cart")
                        }}
                    >
                        <Badge badgeContent={ordersNumber} sx={sxBadge}>
                            <span className='text-white text-3xl'>{icons.iconCart}</span>
                        </Badge >
                    </button>
                </div>
            </header>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default HeaderWeb