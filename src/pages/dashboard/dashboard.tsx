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

const Dashboard: React.FC = () => {
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
            <main className="min-h-[77.5vh] bg-white grid grid-cols-4 grid-rows-3 gap-5 p-5">
                <div className="bg-orange-200 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    {/*  doanh thu */}
                    <div className="flex justify-between gap-2 text-lg items-center">Total Revenues
                        <span className="w-[30px] h-[30px] rounded-[10px] text-white bg-orange-700"></span>
                    </div>
                </div>
                <div className="bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    {/*  don hàng */}
                    <div className="flex justify-between gap-2 text-lg items-center">Total Orders
                        <span className="w-[30px] h-[30px] rounded-[10px] text-black/70 bg-white content-center">{icons.iconCartAdmin}</span>
                    </div>
                </div>
                <div className=" bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    {/*  don hàng */}
                    <div className="flex justify-between gap-2 text-lg items-center">Total Purchases
                        <span className="w-[30px] h-[30px] rounded-[10px] text-black/70 bg-white content-center"></span>
                    </div>
                </div>
                <div className="col-span-2 col-start-1 row-start-2 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    <div className="flex justify-between gap-2 text-lg items-center">Revenue Analutics
                    </div>
                </div>
                <div className="col-start-3 row-start-2 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    <div className="flex justify-between gap-2 text-lg items-center">Monthly Target
                    </div>
                </div>
                <div className="col-start-1 row-start-3 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    <div className="flex justify-between gap-2 text-lg items-center">
                    </div>
                </div>
                <div className="col-span-2 col-start-2 row-start-3 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    <div className="flex justify-between gap-2 text-lg items-center">
                    </div>
                </div>
                <div className="row-span-2 col-start-4 row-start-1 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    <div className="flex justify-between gap-2 text-lg items-center">
                    </div>
                </div>
                <div className="col-start-4 row-start-3 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                    <div className="flex justify-between gap-2 text-lg items-center">
                    </div>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default Dashboard