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
import {
    getCategories,
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';

const Dashboard: React.FC = () => {
    const { icons,
        setResCategoriesAdmin, imgs
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
        getApiCategories()
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
        console.log(data)
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
                        <div className="flex justify-between gap-2 text-lg items-start">Weekly Revenue Analysis

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
                        <div className="flex justify-between gap-2 text-lg items-center">Weekly Target
                        </div>
                        <div>
                            <ChartGauge vsFromLastWeek={5} value={70} min={0} max={100} donvi="%" backgroundColor={["#ca3500", "#ca3500", "#ffd7a8"]} />
                        </div>
                        <div>
                            <span className="font-bold">Greay Progress</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-orange-200 rounded-[7px] p-5 grid justify-center">
                                <p className="text-gray-600 text-sm text-center">Target</p>
                                <p className="text-xl font-bold text-center">$500</p>
                            </div>
                            <div className="bg-orange-200 rounded-[7px] p-5 grid justify-center">Revenue</div>
                        </div>
                    </div>
                    <div className="md:col-span-3 md:col-start-1 bg-gray-50 rounded-[10px] p-5 shadow-lg hover:shadow-xl grid gap-4">
                        <div className="flex justify-between gap-2 text-lg items-center">Recent Orders
                        </div>
                        <div className="grid">
                            <div className="w-full overflow-auto scroll-x max-h-[200px]">
                                <CTable bordered hover align="middle" responsive className="w-full border border-gray-300 " style={{ tableLayout: 'fixed' }}>
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[70px]">Image</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[180px] max-lg:w-[120px]">Title</CTableHeaderCell>
                                            <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[70px]">Price</CTableHeaderCell>
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
                                                <CTableDataCell className='p-3 border-[1px] border-gray-200 w-fit'>
                                                    <div className="grid gap-2 justify-center w-fit">
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