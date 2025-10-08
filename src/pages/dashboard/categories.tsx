import React, { useEffect } from "react";
import { useGlobal } from '../../context/GlobalContext';

import {
    getCategories,
} from "../../services/userService"
import {
    TextField,
    InputAdornment,
    FormControl,
    Autocomplete,
    MenuItem, Menu,
    Slider
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const CategoriesAdmin: React.FC = () => {

    const navigate = useNavigate()

    const { icons,
        resCategoriesAdmin,
        setResCategoriesAdmin,
        imgs
    } = useGlobal()

    const getApiCategories = async () => {
        try {
            const res = await getCategories()
            setResCategoriesAdmin(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getCategories", error)
            toast.error("Lỗi khi gọi API getCategories")
            setResCategoriesAdmin([])
        }
    }

    useEffect(() => {
        getApiCategories()
    }, [])

    return (
        <>
            <main className="min-h-[77.5vh] p-5 flex flex-col">
                <div>

                </div>
            </main>
        </>
    )
}

export default CategoriesAdmin