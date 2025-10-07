import React, { useState } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton, Badge
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useGlobal } from '../../context/GlobalContext';

const HeaderWeb: React.FC = () => {
    const navigate = useNavigate()
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
        imgs, token, email
    } = useGlobal()

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

    return (
        <>
            <header className='top-0 sticky z-100 px-5 bg-gradient-to-l to-orange-700 from-orange-600'>
                <div className='max-md:hidden max-w-[1500px] text-[16px] font-bold mx-auto py-1 flex justify-between items-center'>
                    <button className='text-white css-icon'
                        onClick={() => {
                            navigate("/login", { state: { name: "dashboard" } })
                        }}
                    >Dashboard</button>
                    <div className='flex text-white '>
                        {token ?
                            <p className=''>{email}</p>
                            :
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
                            <button className='text-white text-3xl max-md:text-2xl md:hidden css-icon'
                                onClick={() => {
                                    navigate("/login", { state: { name: "dashboard" } })
                                }}
                            >
                                {icons.iconUser}
                            </button>
                        </div>
                    </div>
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