import React, { useState, useRef } from "react";
import { useGlobal } from "../../context/GlobalContext";
import Footer from "../../components/Footer";
import {
    TextField,
    InputAdornment,
    Avatar, Box, IconButton, Stack, Badge, styled
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";
import { useNavigate } from 'react-router-dom';

import {
    // postCheckMailAvailable,
    postUsers,
    uploadBase64ToImgBB
} from "../../services/userService"

const StyledBadge = styled(Badge)(({ theme }) => ({
    width: '150px',
    height: '150px',
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
            border: '1px solid currentColor',
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

const Register: React.FC = () => {
    const navigate = useNavigate()

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

    const sxBox: SxProps<Theme> = {
        position: "relative",
        width: '150px',
        height: '150px',
        "&:hover .overlay": { opacity: 1 },
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-gray-100)',
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "pointer",
    }
    const sxAvata: SxProps<Theme> = { width: "100%", height: "100%" }
    const sxBoxHover: SxProps<Theme> = {
        position: "absolute",
        top: '50%',
        left: 0,
        width: "100%",
        height: "50%",
        bgcolor: "rgba(0,0,0,0.4)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "opacity 0.3s",
    }
    const sxIconButton: SxProps<Theme> = { color: "white" }

    const { icons, imgs } = useGlobal()

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [name, setName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    // const [checkEmail, setCheckEmail] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [confirmPassword, setConfirmPassword] = useState("");

    // const postApiCheckMailAvailable = async (email: string) => {
    //     try {
    //         const response = await postCheckMailAvailable({ email });
    //         const resEmail = response.data.isAvailable
    //         setCheckEmail(resEmail)
    //     } catch (error) {
    //         setError('An error occurred while checking email availability. Please try again.');
    //         console.error('Error:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPass, setErrorPass] = useState<string>('');
    const [errorConfirmPass, setErrorConfirmPass] = useState<string>('');
    const [errorAvatar, setErrorAvatar] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setErrorEmail("");
        setErrorPass("");
        setErrorConfirmPass("");
        setErrorAvatar("")
        if (!inputRef.current?.files?.length) {
            setErrorAvatar('Please choose a representative photo');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setErrorConfirmPass("Passwords do not match!");
            setLoading(false);
            return;
        }
        if (password.length < 8) {
            setErrorPass("Password must be at least 8 characters long!");
            setLoading(false);
            return;
        }

        // postApiCheckMailAvailable(email)
        // if (!checkEmail) {
        //     setErrorEmail("Email is available! Please use a different email address")
        // }
        // else {
        const avatar = await uploadBase64ToImgBB(avatarUrl);

        try {
            const res = await postUsers({ name, email, password, avatar })
            if (res.data.email === email) {
                setLoading(true);
                navigate("/login")
            } else {
                setLoading(true);
                setError("Register false")
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Register false")
        } finally {
            setLoading(false);
        }
        // }

    }



    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setError('Please choose a representative photo');
        } else {

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setAvatarUrl(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClick = () => inputRef.current?.click();

    return (
        <>
            <header className="top-0 sticky z-100 px-5 bg-white">
                <div className='max-w-[1500px] mx-auto py-5 flex items-end gap-4'>
                    <img alt='logo' className='h-12 max-md:h-10' src={imgs.logoColor} />
                    <p className='text-3xl text-orange-700 font-bold max-md:text-2xl'>SPEE SHOP</p>
                    <p className="text-3xl border-l-[2px] border-l-orange-700 pl-[20px] max-sm:hidden">Register</p>
                </div>
            </header>
            <div className="min-h-[78.5vh] bg-gradient-to-r to-orange-600 from-orange-700 flex flex-col justify-center sm:px-6 lg:px-8">
                <div className="mx-auto w-full max-w-lg p-5">
                    <div className="bg-white py-4 pb-8 pt-4 shadow rounded-lg sm:px-10 px-4">
                        <p className="text-3xl font-600 text-orange-700 text-center mb-3 pb-[10px] border-b-[1px] border-b-gray-200">Register</p>
                        {error && (
                            <div className="bg-orange-700/20 border-[1px] border-orange-700/50 shadow-lg items-center justify-center mb-3 text-orange-700 text-lg py-1 rounded-[5px]">
                                {/* <span>{icons.iconError}</span> */}
                                <p className="text-center ">
                                    {error} !
                                </p>
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div className=" grid gap-3">
                                <Stack direction="row" spacing={2} sx={{ marginInline: 'auto' }}>
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Box
                                            sx={sxBox}
                                            onClick={handleClick}
                                        >
                                            <Avatar
                                                src={avatarUrl}
                                                alt="avatar"
                                                sx={sxAvata}
                                            />
                                            <Box
                                                className="overlay"
                                                sx={sxBoxHover}
                                            >
                                                <IconButton sx={sxIconButton}>
                                                    {icons.iconCamera}
                                                </IconButton>
                                            </Box>
                                            <input
                                                alt="avata"
                                                type="file"
                                                accept="image/*"
                                                ref={inputRef}
                                                name="avatar"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </Box>
                                    </StyledBadge >
                                </Stack>
                                <div className="w-full pt-[10px] flex">
                                    <label htmlFor="avataInput" className="mx-auto transition-all duration-300 ease cursor-pointer border-[1px] border-orange-700 text-orange-700 px-7 py-2 rounded-full hover:text-orange-600 hover:border-orange-600 hover:shadow-lg">Upload avatar</label>
                                    <input
                                        id="avataInput"
                                        alt="avata"
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        ref={inputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    // required
                                    />
                                </div>
                            </div>
                            {errorAvatar &&
                                <p className="text-sm text-orange-700">
                                    {errorAvatar} !
                                </p>
                            }

                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="block text-xl font-medium text-gray-700">
                                    Full Name
                                </label>
                                <TextField
                                    type="text"
                                    required
                                    autoComplete="name"
                                    placeholder="Your full name"
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

                            {/* Email Field */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="email" className="block text-xl font-medium text-gray-700">
                                    Email
                                </label>
                                <TextField
                                    type="email"
                                    required
                                    autoComplete="email"
                                    placeholder="Your email"
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
                                {errorEmail &&
                                    <p className="text-sm text-orange-700">
                                        {errorEmail} !
                                    </p>
                                }
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                                    Password
                                </label>
                                <TextField
                                    type={showPassword ? 'text' : 'password'}
                                    required
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
                                    value={password}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {errorPass &&
                                    <p className="text-sm text-orange-700">
                                        {errorPass} !
                                    </p>
                                }
                            </div>
                            {/* Password Field */}
                            <div className="flex flex-col gap-1">
                                <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                                    Confirm the password
                                </label>
                                <TextField
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="new-password-confinn"
                                    placeholder="Confirm password"
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
                                    value={confirmPassword}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                {errorPass &&
                                    <p className="text-sm text-orange-700">
                                        {errorPass} !
                                    </p>
                                }
                                {errorConfirmPass &&
                                    <p className="text-sm text-orange-700">
                                        {errorConfirmPass} !
                                    </p>
                                }
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-[10px] shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                                >
                                    {loading ? "Register..." : "Register"}
                                </button>
                            </div>
                        </form>
                        <div className="pt-3 flex">
                            <div className="mx-auto">
                                There are accounts?
                                <button className="text-orange-700 hover:text-orange-800 hover:font-bold ml-[4px]"
                                    onClick={() => {
                                        navigate("/login")
                                    }}>
                                    Sign in now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
}

export default Register