import React, { useEffect, useState } from "react";
import { type ResProduct, useGlobal } from '../../context/GlobalContext';
import ChartMultiLine from "../../charts/chartMultiLine";
import ChartGauge from "../../charts/chartGauge";
import {
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';

import { ToastContainer } from 'react-toastify';

const Dashboard: React.FC = () => {
    const { icons, imgs
    } = useGlobal()

    const [totalRevenues, setTotalRevenues] = useState<number>(0)
    const [totalOrder, setTotalOrder] = useState<number>(0)
    const [totalPurchases, setTotalPurchases] = useState<number>(0)
    const [totalProducts, setTotalProducts] = useState<ResProduct[]>([])

    const label = ["Revenue", "Order"]
    const today = new Date();
    const currentDay = `${(today.getMonth() + 1).toString().padStart(2, '0')}/${today
        .getDate()
        .toString()
        .padStart(2, '0')}/${today.getFullYear()}`;

    const [days, setDays] = useState<string[]>([]);

    const getLast7Days = () => {
        const days = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            days.push(`${month}/${day}/${year}`); // theo local time
        }
        return days;
    };

    useEffect(() => {
        const listDay = getLast7Days()
        setDays(listDay)
    }, [])

    useEffect(() => {
        const loadData = () => {
            const data = localStorage.getItem("dailyStats");
            if (data) {
                const parsed = JSON.parse(data);
                const todayData = parsed[currentDay];
                console.log(currentDay)
                if (todayData) {
                    setTotalPurchases(parsed[currentDay].totalPurchases || 0);
                    setTotalRevenues(parsed[currentDay].totalRevenues || 0);
                    setTotalOrder(parsed[currentDay].totalOrder || 0);
                    setTotalProducts(parsed[currentDay].totalProducts || [])
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
        if (!data) return [[], []];

        const parsed = JSON.parse(data);
        const last7Days = getLast7Days();
        const revenues = last7Days.map((day) => parsed[day]?.totalRevenues || 0);
        const orders = last7Days.map((day) => parsed[day]?.totalOrder || 0);

        return [revenues, orders];
    };


    const dataLineMulti = getDataLineMulti()

    const borderDash = [
        [0, 0], [6, 6]
    ]

    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // tránh vòng lặp vô hạn
        e.currentTarget.src = imgs.imgDefault;//"https://placehold.co/600x400" // // ảnh mặc định (nên để trong public/images)
    };

    const getWeekData = (startDate: Date, endDate: Date) => {
        const data = JSON.parse(localStorage.getItem("dailyStats") || "{}");
        const start = new Date(startDate);
        const end = new Date(endDate);

        let totalRevenues = 0;
        let totalOrders = 0;
        let totalPurchases = 0;

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const key = (d.getMonth() + 1).toString().padStart(2, '0') + '/' +
                d.getDate().toString().padStart(2, '0') + '/' +
                d.getFullYear();

            totalRevenues += data[key]?.totalRevenues || 0;
            totalOrders += data[key]?.totalOrder || 0;
            totalPurchases += data[key]?.totalPurchases || 0;
        }

        return { totalRevenues, totalOrders, totalPurchases };
    };

    const getWeekComparison = () => {
        const now = new Date();
        const currentDay = now.getDay(); // 0: CN, 1: T2, ...
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;

        // Ngày thứ 2 của tuần hiện tại
        const monday = new Date(now);
        monday.setDate(now.getDate() - diffToMonday);

        // Chủ nhật tuần hiện tại
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        // Tuần trước (thứ 2 → CN)
        const prevMonday = new Date(monday);
        prevMonday.setDate(monday.getDate() - 7);
        const prevSunday = new Date(prevMonday);
        prevSunday.setDate(prevMonday.getDate() + 6);

        // Lấy dữ liệu tuần hiện tại và tuần trước
        const thisWeek = getWeekData(monday, sunday);
        const lastWeek = getWeekData(prevMonday, prevSunday);

        // So sánh
        const diffRevenue = thisWeek.totalRevenues - lastWeek.totalRevenues;
        const diffOrder = thisWeek.totalOrders - lastWeek.totalOrders;
        const diffPurchases = thisWeek.totalPurchases - lastWeek.totalPurchases

        return {
            thisWeek,
            lastWeek,
            diff: {
                revenues: diffRevenue,
                orders: diffOrder,
                purchases: diffPurchases
            }
        };
    };

    const [weekStats, setWeekStats] = useState({
        thisWeek: { totalRevenues: 0, totalOrders: 0, totalPurchases: 0 },
        lastWeek: { totalRevenues: 0, totalOrders: 0, totalPurchases: 0 },
        diff: { revenues: 0, orders: 0, purchases: 0 },
    });

    useEffect(() => {
        // Hàm cập nhật dữ liệu
        const updateWeekStats = () => {
            const result = getWeekComparison();
            setWeekStats(result);
        };

        // Gọi ngay khi mount
        updateWeekStats();

        // Cập nhật liên tục mỗi 10 giây (tùy bạn chỉnh)
        const interval = setInterval(updateWeekStats, 10000);

        // Dọn dẹp interval khi component bị unmount
        return () => clearInterval(interval);
    }, []);

    const calcPercentChange = (current: number, previous: number) => {
        if (previous === 0) {
            if (current === 0) return 0;
            return 100; // hoặc Infinity nếu muốn hiển thị "tăng vô hạn"
        }
        const percent = ((current - previous) / previous) * 100;
        return Math.round(percent);
    };

    const percentRevenue = calcPercentChange(
        weekStats.thisWeek.totalRevenues,
        weekStats.lastWeek.totalRevenues
    );

    const percentOrder = calcPercentChange(
        weekStats.thisWeek.totalOrders,
        weekStats.lastWeek.totalOrders
    )

    const percentPurchases = calcPercentChange(
        weekStats.thisWeek.totalPurchases,
        weekStats.lastWeek.totalPurchases
    )

    return (
        <>
            <main className="min-h-[77.5vh] bg-white flex flex-col p-5">
                <div className="grid md:grid-cols-3 gap-5">
                    <div className=" bg-orange-100 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        {/*  doanh thu */}
                        <div className="flex justify-between gap-2 text-lg items-center font-semibold">Total Revenues
                            <span className="w-[30px] h-[30px] rounded-[10px] text-white bg-orange-700 content-center">{icons.iconRevenue}</span>
                        </div>
                        <div className="flex justify-between gap-2 items-center content-end">
                            <p className="text-5xl font-bold">${totalRevenues}</p>
                            <div>
                                <p className={`${percentRevenue >= 0 ? "text-green-600 bg-green-600/20" : "text-red-600 bg-red-600/20"} text-end font-bold w-fit ml-auto rounded-full px-1`}>{percentRevenue >= 0 ? "+" : ""}{percentRevenue}%</p>
                                <p className="text-sm text-gray-600">Vs last weed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        {/*  don hàng */}
                        <div className="flex justify-between gap-2 text-lg items-center font-semibold">Total Orders
                            <span className="w-[30px] h-[30px] rounded-[10px] text-black/70 bg-white content-center">{icons.iconCartAdmin}</span>
                        </div>
                        <div className="flex justify-between gap-2 items-center">
                            <p className="text-5xl font-bold">{totalOrder}</p>
                            <div>
                                <p className={`${percentOrder >= 0 ? "text-green-600 bg-green-600/20" : "text-red-600 bg-red-600/20"} text-end font-bold w-fit ml-auto rounded-full px-1`}>{percentOrder >= 0 ? "+" : ""}{percentOrder}%</p>
                                <p className="text-sm text-gray-600">Vs last weed</p>
                            </div>
                        </div>
                    </div>
                    <div className=" bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        {/*  don hàng */}
                        <div className="flex justify-between gap-2 text-lg items-center font-semibold">Total Purchases
                            <span className="w-[30px] h-[30px] rounded-[10px] text-black/70 bg-white content-center">{icons.iconPackage}</span>
                        </div>
                        <div className="flex justify-between gap-2 items-center">
                            <p className="text-5xl font-bold">{totalPurchases}</p>
                            <div>
                                <p className={`${percentPurchases >= 0 ? "text-green-600 bg-green-600/20" : "text-red-600 bg-red-600/20"} text-end font-bold w-fit ml-auto rounded-full px-1`}>{percentPurchases >= 0 ? "+" : ""}{percentPurchases}%</p>
                                <p className="text-sm text-gray-600">Vs last weed</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 md:col-start-1 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        <div className="flex justify-between gap-2 text-lg items-start font-semibold">Weekly Revenue Analysis

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
                                currentIndex={6}
                                donvi=''
                                hours={days}
                                dataDetail={dataLineMulti}
                                borderDash={borderDash}
                            />
                        </div>
                    </div>
                    <div className="md:col-start-3 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        <div className="flex justify-between gap-2 text-lg items-center font-semibold">Weekly Target
                        </div>
                        <div>
                            <ChartGauge vsFromLastWeek={(percentRevenue)} value={(weekStats.thisWeek.totalRevenues / 5)} min={0} max={100} donvi="%" backgroundColor={["#ca3500", "#ca3500", "#ffd7a8"]} />
                        </div>
                        <div>
                            <p className="font-bold text-center text-xl">Greay Progress</p>
                            <p className="text-center text-lg">You earn <span className="text-orange-700 font-bold">${weekStats.diff.revenues}</span> today, it's higher than last week. Keep up your good work!</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-100 rounded-[7px] p-3 grid justify-center">
                                <p className="text-gray-600 text-sm text-center">Target</p>
                                <p className="text-xl font-bold text-center">$500</p>
                            </div>
                            <div className="bg-orange-100 rounded-[7px] p-3 grid justify-center">
                                <p className="text-gray-600 text-sm text-center">Revenue</p>
                                <p className="text-xl font-bold text-center">${weekStats.thisWeek.totalRevenues}</p>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-3 md:col-start-1 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        <div className="flex justify-between gap-2 text-lg items-center font-semibold">Recent Orders
                        </div>
                        <div className="grid">
                            <div className="w-full overflow-x-auto scroll-x">
                                <CTable bordered hover align="middle" responsive className="w-full border border-gray-300 " style={{ tableLayout: 'fixed' }}>
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[70px]">Image</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[180px] max-lg:w-[120px]">Title</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[100px]">Price</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[110px]">Category</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[110px]">Status</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {totalProducts.map((row, index) => (
                                            <CTableRow className="table-body-row-mucluc" key={row.id || index}
                                                onClick={() => {
                                                    setSelectedRow(index);
                                                }} onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault(); // Ngăn xuống dòng nếu cần
                                                        setSelectedRow(null); // Thoát khỏi select
                                                    }
                                                }}
                                                style={{
                                                    border: index === selectedRow ? '2px dashed rgb(92, 0, 0)' : '',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <CTableDataCell className='p-3 border-[1px] border-gray-200 w-fit '>
                                                    <div className="grid gap-2 justify-center w-fit mx-auto">
                                                        <img src={row.images[0]} onError={handleImgError} className="w-12 h-12 object-cover rounded" alt={`category ${row.id}`} />
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{row.title}</CTableDataCell>
                                                <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>
                                                    <span className="text-orange-700  font-bold border-[1px] border-orange-700/20 p-1 bg-orange-700/10 rounded-full">$ {row.price}</span>
                                                </CTableDataCell>
                                                <CTableDataCell className='text-center p-3 border-[1px] border-gray-200 break-all'>{row.category.name}</CTableDataCell>
                                                <CTableDataCell className="text-center p-3 border-[1px] border-gray-200"><span className="text-green-600 px-2 bg-green-600/20 w-fit rounded-full py-1">Delivered</span></CTableDataCell>
                                            </CTableRow>
                                        ))}
                                    </CTableBody>
                                </CTable>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default Dashboard