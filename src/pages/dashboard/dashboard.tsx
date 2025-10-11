import React, { useEffect } from "react";
import { useGlobal } from '../../context/GlobalContext';

import {
    getCategories,
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';

const Dashboard: React.FC = () => {

    const { icons,
        setResCategoriesAdmin,
        totalRevenues, totalOrder, totalPurchases
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
            <main className="min-h-[77.5vh] bg-white flex flex-col p-5">
                <div className="grid lg:grid-cols-4 lg:grid-rows-5 gap-5 md:grid-cols-3 md:grid-rows-8">
                    <div className=" bg-orange-200 rounded-[10px] p-5 shadow-lg hover:shadow-xl flex flex-col gap-2">
                        {/*  doanh thu */}
                        <div className="flex justify-between gap-2 text-lg items-center">Total Revenues
                            <span className="w-[30px] h-[30px] rounded-[10px] text-white bg-orange-700 content-center">{icons.iconRevenue}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                            <p className="text-4xl font-bold">$ {totalRevenues}</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl flex flex-col gap-2">
                        {/*  don hàng */}
                        <div className="flex justify-between gap-2 text-lg items-center">Total Orders
                            <span className="w-[30px] h-[30px] rounded-[10px] text-black/70 bg-white content-center">{icons.iconCartAdmin}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                            <p className="text-4xl font-bold">$ {totalOrder}</p>
                        </div>
                    </div>
                    <div className=" bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl flex flex-col gap-2">
                        {/*  don hàng */}
                        <div className="flex justify-between gap-2 text-lg items-center">Total Purchases
                            <span className="w-[30px] h-[30px] rounded-[10px] text-black/70 bg-white content-center">{icons.iconPackage}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                            <p className="text-4xl font-bold">$ {totalPurchases}</p>
                        </div>
                    </div>
                    <div className="md:col-span-2 md:row-span-2 md:col-start-1 md:row-start-2 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                        <div className="flex justify-between gap-2 text-lg items-center">Revenue Analutics
                        </div>
                    </div>
                    <div className="md:row-span-2 md:col-start-3 md:row-start-2 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                        <div className="flex justify-between gap-2 text-lg items-center">Monthly Target
                        </div>
                    </div>
                    <div className="md:col-start-1 md:row-start-4 md:row-span-2 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                        <div className="flex justify-between gap-2 text-lg items-center">
                        </div>
                    </div>
                    <div className="md:row-span-2 md:col-span-2 md:col-start-2 md:row-start-4 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                        <div className="flex justify-between gap-2 text-lg items-center">
                        </div>
                    </div>
                    <div className="md:row-span-3 md:col-span-2 lg:col-start-4 lg:row-start-1 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                        <div className="flex justify-between gap-2 text-lg items-center">
                        </div>
                    </div>
                    <div className="lg:col-start-4 lg:row-start-4 lg:row-span-2 md:row-span-3 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl">
                        <div className="flex justify-between gap-2 text-lg items-center">
                        </div>
                    </div>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default Dashboard