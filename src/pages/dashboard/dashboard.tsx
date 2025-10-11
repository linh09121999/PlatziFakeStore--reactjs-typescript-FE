import React, { useEffect, useState } from "react";
import { useGlobal } from '../../context/GlobalContext';
import ChartMultiLine from "../../charts/chartMultiLine";
import ChartGauge from "../../charts/chartGauge";

import {
    getCategories,
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';

const Dashboard: React.FC = () => {

    const { icons,
        setResCategoriesAdmin,
        totalRevenues, totalOrder, totalPurchases,
        setTotalPurchases, setTotalOrder, setTotalRevenues
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

    const label = ["Revenue", "Order"]
    const currentDay = new Date().getDay();

    const [days, setDays] = useState<string[]>([]);

    const getLast7Days = (includeToday = true) => {
        const days = [];
        const today = new Date();
        const offset = includeToday ? 0 : 1;

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i + offset);
            const dayStr = d.toISOString().split("T")[0]; // định dạng YYYY-MM-DD
            days.push(dayStr);
        }

        return days;
    };

    useEffect(() => {
        getApiCategories()
        const listDay = getLast7Days(true)
        setDays(listDay)
    }, [])


    useEffect(() => {
        const loadData = () => {
            const data = localStorage.getItem("dailyStats");
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed[currentDay]) {
                    setTotalPurchases(parsed[currentDay].totalPurchases);
                    setTotalRevenues(parsed[currentDay].totalRevenues);
                    setTotalOrder(parsed[currentDay].totalOrder);
                }
            }
        };

        // Lần đầu load
        loadData();

        // Lắng nghe localStorage thay đổi
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "dailyStats") {
                loadData();
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [currentDay]);


    const getDataLineMulti = () => {
        const data = localStorage.getItem("dailyStats");
        if (!data) return { revenues: [], orders: [] };

        const parsed = JSON.parse(data);
        const last7Days = getLast7Days(true);

        const revenues = last7Days.map(day => parsed[day]?.totalRevenues || 0);
        const orders = last7Days.map(day => parsed[day]?.totalOrder || 0);

        return  [revenues, orders ];
    };

    const dataLineMulti = getDataLineMulti()

    const borderDash = [
        [0, 0], [6, 6]
    ]

    return (
        <>
            <main className="min-h-[77.5vh] bg-white flex flex-col p-5">
                <div className="grid md:grid-cols-3 gap-5">
                    <div className=" bg-orange-200 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        {/*  doanh thu */}
                        <div className="flex justify-between gap-2 text-lg items-center">Total Revenues
                            <span className="w-[30px] h-[30px] rounded-[10px] text-white bg-orange-700 content-center">{icons.iconRevenue}</span>
                        </div>
                        <div className="flex justify-between gap-2 items-center content-end">
                            <p className="text-5xl font-bold">${totalRevenues}</p>
                            <div>
                                <p className="text-end text-red-600 font-bold bg-red-600/20 w-fit ml-auto rounded-full px-1">-6%</p>
                                <p className="text-sm text-gray-600">Vs last weed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        {/*  don hàng */}
                        <div className="flex justify-between gap-2 text-lg items-center">Total Orders
                            <span className="w-[30px] h-[30px] rounded-[10px] text-black/70 bg-white content-center">{icons.iconCartAdmin}</span>
                        </div>
                        <div className="flex justify-between gap-2 items-center">
                            <p className="text-5xl font-bold">{totalOrder}</p>
                            <div>
                                <p className="text-end text-green-600 font-bold bg-green-600/20 w-fit ml-auto rounded-full px-1">+10%</p>
                                <p className="text-sm text-gray-600">Vs last weed</p>
                            </div>
                        </div>
                    </div>
                    <div className=" bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        {/*  don hàng */}
                        <div className="flex justify-between gap-2 text-lg items-center">Total Purchases
                            <span className="w-[30px] h-[30px] rounded-[10px] text-black/70 bg-white content-center">{icons.iconPackage}</span>
                        </div>
                        <div className="flex justify-between gap-2 items-center">
                            <p className="text-5xl font-bold">{totalPurchases}</p>
                            <div>
                                <p className="text-end text-red-600 font-bold bg-red-600/20 w-fit ml-auto rounded-full px-1">-4%</p>
                                <p className="text-sm text-gray-600">Vs last weed</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 md:col-start-1 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        <div className="flex justify-between gap-2 text-lg items-center">Revenue Analutics
                        </div>
                        <div className="w-full">
                            <ChartMultiLine
                                stepSize={0.5}
                                label={label}
                                border={["orange", "orange"]}
                                background={[
                                    "white",
                                    "white",
                                ]}
                                currentIndex={currentDay}
                                donvi=''
                                hours={days}
                                dataDetail={dataLineMulti}
                                borderDash={borderDash}
                            />
                        </div>
                    </div>
                    <div className="md:col-start-3 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        <div className="flex justify-between gap-2 text-lg items-center">Monthly Target
                        </div>
                        <div>
                            <ChartGauge vsFromLastWeek={5} value={70} min={0} max={100} donvi="%" backgroundColor={["#ca3500", "#ca3500", "#ffd7a8"]} />
                        </div>
                        <div>
                            <span className="font-bold">Greay Progress</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-200 rounded-[7px] p-5 grid justify-center">Target</div>
                            <div className="bg-orange-200 rounded-[7px] p-5 grid justify-center">Revenue</div>
                        </div>
                    </div>
                    <div className="md:col-start-1 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        <div className="flex justify-between gap-2 text-lg items-center">
                        </div>
                    </div>
                    <div className="md:col-span-2 md:col-start-2 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
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