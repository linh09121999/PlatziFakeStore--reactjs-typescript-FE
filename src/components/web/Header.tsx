import React, { useState } from 'react';
import {
    TextField,
    InputAdornment,
    Menu,
    MenuItem,
    IconButton,
    Button, Badge
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useGlobal } from '../../context/GlobalContext';
import type { ResProduct } from '../../context/GlobalContext';

import { getFilterProductByTitle, getFilterProductByTitle_Page } from '../../services/userService';

const HeaderWeb: React.FC = () => {
    const navigate = useNavigate()
    const sxTextField: SxProps<Theme> = {
        width: "50%",
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

    const { icons, setResProduct, ordersNumber, setSelectCateCategoryName, setSelectCateCategoryID,
        pageSize
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
                    <button className='text-white '
                        onClick={() => {
                            navigate("/admin")
                        }}
                    >Dashboard</button>
                    <div className='flex text-white '>
                        <button className='px-2 border-r-[1px] border-r-white/50'
                            onClick={() => {
                                navigate("/login")
                            }}
                        >Login</button>
                        <button className='px-2'
                            onClick={() => {
                                navigate("/register")
                            }}
                        >SignUp</button>
                    </div>
                </div>
                <div className='max-w-[1500px] mx-auto py-5 md:flex md:justify-between items-center gap-4'>
                    <div className='flex gap-2 items-center'>
                        <img alt='logo' className='h-12' src="../src/assets/logoHeader.png" />
                        <p className='text-3xl text-white font-bold'>SPEE SHOP</p>
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
                    <button className='content-end relative'
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