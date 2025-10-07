import React, { useState } from "react";
import { useGlobal } from "../../context/GlobalContext";
import Footer from "../../components/Footer";
import {
    TextField,
    InputAdornment,
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";
import { useNavigate, useLocation } from 'react-router-dom';
import { postLogin } from "../../services/userService";

const Login: React.FC = () => {
    const navigate = useNavigate()
    const location = useLocation();

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

    const { icons, imgs, email, setEmail, password, setPassword, setToken } = useGlobal()
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const from = location.state?.from?.pathname || "/admin";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await postLogin({ email, password });
            const token = res.data?.access_token || res.data?.token; // tuỳ backend trả về

            if (token) {
                setToken(token);
                if (location.state?.name === "web") {
                    // Lưu email vào localStorage để hiển thị lên web
                    localStorage.setItem("userEmail", email);
                    navigate("/", { replace: true });
                } else if (location.state?.name === "dashboard") {
                    navigate("/admin", { replace: true });
                } else {
                    navigate(from, { replace: true });
                }
            } else {
                setError("No token found in feedback!");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed!");
        } finally {
            setLoading(false);
        }
    };

    // For input events specifically
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.currentTarget.setCustomValidity("");
    };

    // For invalid events
    const handleInvalidInput = (e: React.InvalidEvent<HTMLInputElement>) => {
        e.currentTarget.setCustomValidity("Unable to leave empty!");
    };


    return (
        <>
            <header className="top-0 sticky z-100 px-5 bg-white">
                <div className='max-w-[1500px] mx-auto py-5 md:flex items-end grid gap-4'>
                    <img alt='logo' className='h-12 max-md:h-10' src={imgs.logoColor} />
                    <p className='text-3xl text-orange-700 font-bold max-md:text-2xl'>SPEE SHOP</p>
                    <p className="text-3xl border-l-[2px] border-l-orange-700 pl-[20px]">Login</p>
                </div>
            </header>
            <div className="min-h-[78.5vh] bg-gradient-to-r to-orange-600 from-orange-700 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <p className="text-3xl font-600 text-orange-700 text-center mb-3 pb-[10px] border-b-[1px] border-b-gray-200">Login</p>
                        {error && (
                            <div className="bg-orange-700/20 border-[1px] border-orange-700/50 shadow-lg flex gap-2 items-center mb-3 text-orange-700 text-lg py-1 rounded-[5px] justify-center">
                                <span>{icons.iconError}</span>
                                <p className=" ">
                                    {error} !
                                </p>
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className="flex flex-col gap-2">
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
                                                <InputAdornment position="start"
                                                >
                                                    {icons.iconMail}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={email}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onInvalid={handleInvalidInput}
                                    onInput={handleInput}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="block text-xl font-medium text-gray-700">
                                    Password
                                </label>
                                <TextField
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    autoComplete="current-password"
                                    placeholder="Your password"
                                    name="password"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start"
                                                >
                                                    {icons.iconLock}
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <button onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? icons.iconEyeSlash : icons.iconEye}
                                                    </button>
                                                </InputAdornment>
                                            )
                                        },
                                    }}
                                    value={password}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onInvalid={handleInvalidInput}
                                    onInput={handleInput}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {/* Login Button */}
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-[10px] shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                                >
                                    {loading ? "Login..." : "Login"}
                                </button>
                            </div>
                        </form>

                        {/* Register Section */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        No account?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        navigate("/register")
                                    }}
                                    type="button"
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-[10px] shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                                >
                                    Register for a new account
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
            <Footer />
        </>
    )
}

export default Login