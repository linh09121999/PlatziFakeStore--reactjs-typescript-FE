import React, { useEffect, useState } from "react";
import { useGlobal } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { ToastContainer, toast } from 'react-toastify';

const Cart: React.FC = () => {
    const navigate = useNavigate();
    const {
        icons,
        imgs,
        ordersList,
        setOrdersList,
        ordersNumber, setOrdersNumber
    } = useGlobal();

    // --- style cho TextField ---
    const sxTextField: SxProps<Theme> = {
        minWidth: "30px",
        maxWidth: "60px",
        "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            height: "30px",
            padding: "3px 8px",
            transition: "all 0.3s",
            fontSize: "var(--text-xl)",
            borderTop: "1px solid var(--color-orange-700)",
            borderBottom: "1px solid var(--color-orange-700)",
        },
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            outline: "none",
            border: "none",
        },
        "& .MuiOutlinedInput-input": {
            padding: 0,
        },
        "& .MuiInputBase-input": {
            color: "black",
            fontSize: "var(--text-lg)",
            border: "none",
            textAlign: "center",
        },
    };

    // --- Quản lý số lượng theo ID sản phẩm ---
    const [quantities, setQuantities] = useState<Record<number, number>>({});

    // Lấy dữ liệu từ localStorage cho tất cả sản phẩm trong ordersList
    useEffect(() => {
        const storedQuantities: Record<number, number> = {};
        ordersList.forEach((item) => {
            const saved = localStorage.getItem(`quantity_${item.id}`);
            storedQuantities[item.id] = saved ? Number(saved) : 1;
        });
        setQuantities(storedQuantities);
    }, [ordersList]);

    // Lưu localStorage khi quantity thay đổi
    const updateQuantity = (id: number, newQty: number) => {
        setQuantities((prev) => {
            const updated = { ...prev, [id]: newQty };
            localStorage.setItem(`quantity_${id}`, String(newQty));
            return updated;
        });
    };

    // --- Xử lý sự kiện ---
    const handleDecrease = (id: number) => {
        updateQuantity(id, Math.max(1, (quantities[id] || 1) - 1));
    };

    const handleIncrease = (id: number) => {
        updateQuantity(id, (quantities[id] || 1) + 1);
    };

    const handleChange = (id: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = Math.max(1, Number(e.target.value) || 1);
        updateQuantity(id, value);
    };

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = imgs.imgDefault;
    };

    const handleDelete = (id: number) => {
        const updated = ordersList.filter((item) => item.id !== id);
        setOrdersList(updated);
        setOrdersNumber(ordersNumber - 1)
        localStorage.removeItem(`quantity_${id}`);
    };

    // --- Tính tổng tiền ---
    const total = ordersList.reduce(
        (sum, item) => sum + item.price * (quantities[item.id] || 1),
        0
    );

    const handleCheckout = () => {
        if (ordersList.length === 0) {
            toast.error("There is no product in the cart")
        }
        else {
            toast.success("Successful order!");
            setOrdersList([]);
            setOrdersNumber(0)
        }
    }

    return (
        <>
            {/* Breadcrumb */}
            <div className="w-full px-5 bg-gray-100 sticky z-[999] md:top-[120px] max-md:top-[142px]">
                <div className="flex gap-2 max-w-[1500px] mx-auto items-center text-orange-700 py-[10px] text-xl max-md:text-lg">
                    <div
                        onClick={() => navigate("/")}
                        className="transition duration-300 ease css-icon"
                    >
                        {icons.iconHome}
                    </div>
                    <span>{icons.iconNext}</span>
                    <div className="transition duration-300 ease css-icon">Cart</div>
                </div>
            </div>

            {/* Main */}
            <main className="bg-gray-100 min-h-[70vh] p-5">
                <div className="max-w-[1500px] mx-auto items-center grid lg:grid-cols-[3fr_350px] gap-5">
                    {/* Danh sách sản phẩm */}
                    <div className="flex flex-col gap-6 self-start rounded-[10px] bg-white p-5 flex-1 shadow-lg">
                        <h3 className="text-xl pb-2 border-b-[1px] border-b-gray-300">
                            PRODUCTS
                        </h3>

                        {ordersList.length === 0 ? (
                            <img src={imgs.imgNoItem} alt="no items" />
                        ) : (
                            <>
                                {ordersList.map((list) => (
                                    <div
                                        key={list.id}
                                        className="  transition-all duration-300 ease group pointer pb-[10px] border-b-[1px] border-b-gray-200"
                                    >
                                        <p className="text-xl max-md:text-lg text-start sm:hidden">{list.title}</p>

                                        <div className="relative items-center flex gap-4 max-md:gap-2 max-sm:gap-1 overflow-hidden text-center">
                                            <img
                                                src={list.images[0]}
                                                alt={list.title}
                                                onError={handleImgError}
                                                className="relative w-[140px] max-sm:w-[100px] transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70"
                                            />

                                            <div className="xl:flex gap-4 p-5 xl:justify-between max-xl:grid items-center w-full">
                                                <div className="flex flex-col gap-4">
                                                    <p className="text-xl max-md:text-lg text-start max-sm:hidden">{list.title}</p>
                                                    <p className="text-2xl max-md:text-xl max-sm:text-lg text-start text-orange-700 bg-orange-700/20 w-fit px-4  rounded-full font-bold border-[1px] border-orange-700/20 shadow-lg">$ {list.price}</p>
                                                </div>

                                                <div className="flex gap-4 items-center">
                                                    <div className="flex">
                                                        <button
                                                            onClick={() => handleDecrease(list.id)}
                                                            className=" rounded-[10px_0_0_10px] border-[1px] border-orange-700 px-2 max-md:px-2 max-md:py-1"
                                                        >
                                                            {icons.iconDecrease}
                                                        </button>
                                                        <TextField
                                                            value={quantities[list.id] || 1}
                                                            variant="outlined"
                                                            sx={sxTextField}
                                                            onChange={(e) => handleChange(list.id, e)}
                                                        />
                                                        <button
                                                            onClick={() => handleIncrease(list.id)}
                                                            className=" rounded-[0_10px_10px_0] border-[1px] border-orange-700 px-2 max-md:px-2 max-md:py-1"
                                                        >
                                                            {icons.iconIncrease}
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(list.id)}
                                                        className="text-orange-700 text-xl max-md:text-lg"
                                                    >
                                                        {icons.iconDelete}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        <div>
                            <button
                                onClick={() => navigate("/products")}
                                className="css-next shadow-lg flex gap-2 border-[1px] border-orange-700 text-orange-700 rounded-[10px] px-4 py-2 w-fit justify-self-center"
                            >
                                <span className="rotate-[180deg]">{icons.iconNext}</span>
                                Continue to buy products
                            </button>
                        </div>
                    </div>

                    {/* Thanh toán */}
                    <div className="bg-white p-5 rounded-[10px] shadow-lg flex flex-col gap-5 self-start ">
                        <h3 className="text-xl pb-2 border-b-[1px] border-b-gray-300">
                            PAYMENT
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between text-lg">
                                <p>Subtotal</p>
                                <p>$ {total.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between text-lg">
                                <p>Shipping fee</p>
                                <p>$ 0</p>
                            </div>
                            <div className="flex justify-between text-lg">
                                <p>Discount</p>
                                <p>$ 0</p>
                            </div>
                        </div>
                        <div className="pt-2 border-t-[1px] border-t-gray-300 flex justify-between text-xl">
                            <p>Total</p>
                            <p>$ {total.toFixed(2)}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="py-2 text-white font-bold rounded-[10px] bg-orange-700">Checkout</button>
                    </div>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default Cart;
