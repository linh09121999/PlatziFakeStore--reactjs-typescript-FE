import React, { useEffect, useState } from "react";
import { useGlobal } from '../../context/GlobalContext';

import {
    TextField,
    InputAdornment,
    Avatar, Stack, Badge, styled
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";
import { ToastContainer, toast } from 'react-toastify';

import {
    putUserById
} from "../../services/userService"

const StyledBadge = styled(Badge)(({ theme }) => ({
    width: '200px',
    height: '200px',
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

const SettingAdmin: React.FC = () => {
    const sxTextField: SxProps<Theme> = {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            borderRadius: "10px",
            background: "var(--color-white)",
            height: '40px',
            // boxShadow: 'var(--shadow-lg)',
            padding: '3px 8px',
            transition: 'all 0.3s',
            fontSize: 'var(--text-xl)',
            border: '1px solid var(--color-gray-200)',
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
            color: 'black',
            fontSize: 'var(--text-lg)',
            border: 'none',
        },
    }

    const sxAvata: SxProps<Theme> = {
        width: "100%",
        height: "100%",
        boxShadow: 'var(--shadow-xl)',

    }

    const { icons, resProfile, setSelectPage
    } = useGlobal()

    useEffect(() => {
        setSelectPage("Setting")
    }, [])

    useEffect(() => {
        if (resProfile?.email) {
            setEmail(resProfile.email);
        }
        if (resProfile?.name) {
            setName(resProfile.name);
        }
    }, [resProfile]);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")

    const convertDateToVn = (date: string) => {
        return new Date(date).toLocaleDateString('en-US')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (resProfile?.id) {
                const res = await putUserById(resProfile?.id, { name, email })
                if (res.data.id === resProfile.id) {
                    toast.success("Edit Success")
                }
            }

        } catch (error) {
            console.error("Lỗi khi gọi API getCategories", error)
            toast.error("Lỗi khi gọi API getCategories")
        }
    }

    return (
        // EDIT PROFILE resProfile
        <>
            <main className="min-h-[77.5vh] p-5 flex flex-col">
                <div className="grid grid-cols-[1fr_5fr] gap-10">
                    <div className="flex flex-col gap-5 mx-auto">
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
                        <p className="text-center text-3xl font-700">{name}</p>
                        <div className="bg-orange-700/20 py-2 rounded-full text-orange-700 text-lg border-[1px] border-orange-700/30 shadow-lg text-center ">{resProfile?.role}</div>
                    </div>
                    <form className="flex flex-col gap-5 mx-5" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="block text-xl font-medium text-gray-700">
                                    Name
                                </label>
                                <TextField
                                    type="text"
                                    required
                                    autoComplete="name"
                                    placeholder="name"
                                    name="name"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {icons.iconUser}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={name}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="block text-xl font-medium text-gray-700">
                                    Email
                                </label>
                                <TextField
                                    type="text"
                                    required
                                    autoComplete="email"
                                    placeholder="email"
                                    name="email"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {icons.iconMail}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={email}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="role" className="block text-xl font-medium text-gray-700">
                                    Role
                                </label>
                                <TextField
                                    type="text"
                                    disabled
                                    autoComplete="role"
                                    placeholder="role"
                                    name="role"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {icons.iconRole}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={resProfile?.role}
                                    variant="outlined"
                                    sx={sxTextField}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                                    Password
                                </label>
                                <TextField
                                    type={showPassword ? 'text' : 'password'}
                                    disabled
                                    autoComplete="new-password"
                                    placeholder="Your password"
                                    name="password"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {icons.iconLock}
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? icons.iconEyeSlash : icons.iconEye}
                                                    </button>
                                                </InputAdornment>
                                            )
                                        },
                                    }}
                                    value={resProfile?.password}
                                    variant="outlined"
                                    sx={sxTextField}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="creationAt" className="block text-xl font-medium text-gray-700">
                                    Createion At
                                </label>
                                <TextField
                                    type="text"
                                    disabled
                                    autoComplete="creationAt"
                                    placeholder="creationAt"
                                    name="creationAt"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {icons.iconClock}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={convertDateToVn(resProfile?.creationAt ?? "")}
                                    variant="outlined"
                                    sx={sxTextField}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label htmlFor="updateAt" className="block text-xl font-medium text-gray-700">
                                    Update At
                                </label>
                                <TextField
                                    type="text"
                                    disabled
                                    autoComplete="updateAt"
                                    placeholder="updateAt"
                                    name="updateAt"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {icons.iconClock}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={convertDateToVn(resProfile?.creationAt ?? "")}
                                    variant="outlined"
                                    sx={sxTextField}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-[200px] mr-auto flex justify-center py-2 px-4 border border-transparent rounded-[10px] shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                            >
                                Edit
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default SettingAdmin