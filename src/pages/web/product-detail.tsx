import React, { useEffect, useState } from "react";
import {
    getProductsById,
    getProductsRelatedById
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

import { useGlobal } from '../../context/GlobalContext';

import {
    TextField,
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";

const ProductDetail: React.FC = () => {
    const sxTextField: SxProps<Theme> = {
        width: "60px",
        '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            height: '40px',
            padding: '3px 8px',
            transition: 'all 0.3s',
            fontSize: 'var(--text-xl)',
            borderTop: '1px solid var(--color-orange-700)',
            borderBottom: '1px solid var(--color-orange-700)',
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
            textAlign: 'center',
        },
    }

    const navigate = useNavigate()
    const { icons, imgs, setResProductBy, resProductBy, setOrdersList, setOrdersNumber, ordersNumber,
        selectProductID, setSelectProductId,
        resProductRelateBy, setResProductRelateBy
    } = useGlobal()

    const getApiSigleProduct = async (id: number) => {
        try {
            const res = await getProductsById(id)
            setResProductBy(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getCategories", error)
            toast.error("Lỗi khi gọi API getCategories")
            setResProductBy(undefined)
        }
    }

    const getApiProductsRelatedById = async (id: number) => {
        try {
            const res = await getProductsRelatedById(id)
            setResProductRelateBy(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getProductsRelatedById", error)
            toast.error("Lỗi khi gọi API getProductsRelatedById")
            setResProductRelateBy([])
        }
    }

    const location = useLocation();
    const { idProduct } = location.state || {};

    useEffect(() => {
        if (idProduct === undefined) {
            navigate("/")
        }
        else {
            getApiSigleProduct(idProduct)
            setSelectProductId(idProduct)
            getApiProductsRelatedById(idProduct)
        }
    }, [])

    const handleProductRelateDetail = (id: number) => {
        getApiSigleProduct(id)
        setSelectProductId(id)
        getApiProductsRelatedById(id)
    }

    const [imageProduct, setImageProduct] = useState<number>(0)

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // tránh vòng lặp vô hạn
        e.currentTarget.src = imgs.imgDefault;//"https://placehold.co/600x400" //imgs.imgDefault; // ảnh mặc định (nên để trong public/images)
    }

    const handleOrderByDetail = () => {
        setOrdersNumber(ordersNumber + 1)
        setOrdersList(prev => [...prev, resProductBy!]);
    }

    const handleBuyNow = () => {
        // Tăng số lượng và thêm sản phẩm vào giỏ
        setOrdersNumber(ordersNumber + 1);
        setOrdersList(prev => [...prev, resProductBy!]);

        // Chuyển sang trang giỏ hàng
        navigate("/cart");

    }

    const handleOrder = (id: number) => {
        setOrdersNumber(ordersNumber + 1)
        const productToAdd = resProductRelateBy.find(product => product.id === id)
        if (!productToAdd) return;
        setOrdersList(prev => [...prev, productToAdd]);
    }

    // Lấy số lượng lưu theo id sản phẩm từ localStorage
    const [quantity, setQuantity] = useState<number>(() => {
        const saved = localStorage.getItem(`quantity_${selectProductID}`);
        return saved ? Number(saved) : 1;
    });

    // Lưu quantity mỗi khi thay đổi
    useEffect(() => {
        localStorage.setItem(`quantity_${selectProductID}`, quantity.toString());
    }, [quantity, selectProductID]);

    const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
    const handleIncrease = () => setQuantity((prev) => prev + 1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(1, Number(e.target.value) || 1);
        setQuantity(value);
    };

    return (
        <>
            <div className='w-full px-5 bg-gray-100 sticky z-[999] md:top-[120px] max-md:top-[142px]'>
                <div className='flex gap-2 max-w-[1500px] mx-auto items-center text-orange-700 py-[10px] text-xl max-md:text-lg '>
                    <div
                        onClick={() => navigate("/")}
                        className='transition duration-300 ease css-icon'>{icons.iconHome}</div>
                    <span>{icons.iconNext}</span>
                    <div
                        onClick={() => navigate("/products")}
                        className='transition duration-300 ease css-icon'>Products</div>
                    <span>{icons.iconNext}</span>
                    <div className='transition duration-300 ease css-icon'>{resProductBy?.title}</div>
                </div>
            </div>
            <main className="bg-gray-100 min-h-[75vh] flex flex-col p-5">
                <div className="max-w-[1500px] mx-auto flex flex-col gap-10">
                    <section className="grid md:grid-cols-[1fr_2fr] gap-10">
                        <div className="relative flex flex-col gap-4">
                            <img src={resProductBy?.images[imageProduct]} alt={resProductBy?.title}
                                className="w-full max-h-[400px] object-center rounded-[10px] shadow-lg" onError={handleImgError} />
                            <div className="flex gap-4">
                                {resProductBy?.images.map((image, id) => (
                                    <button onClick={() => {
                                        setImageProduct(id)
                                    }}>
                                        <img src={image} alt={`img ${id}`} onError={handleImgError}
                                            className={`w-[80px] h-[80px] object-cover object-center cursor-pointer transition-all rounded-[10px] shadow-lg ${imageProduct === id ? "shadow-xl border-[2px] border-orange-700" : ""}`} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className=" flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <p className="text-black/50 text-xl">{resProductBy?.category.name.toUpperCase()}</p>
                                <p className="text-3xl font-bold">{resProductBy?.title}</p>
                                <p className="text-orange-700 text-5xl font-bold">$ {resProductBy?.price}</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <h4 className="text-xl">Quantity:</h4>
                                <div className="flex">
                                    <button onClick={handleDecrease} className="text-xl rounded-[10px_0_0_10px] border-[1px] border-orange-700 px-4 py-2">{icons.iconDecrease}</button>
                                    <TextField
                                        type="number"
                                        value={quantity}
                                        variant="outlined"
                                        sx={sxTextField}
                                        onChange={handleChange}
                                    />
                                    <button onClick={handleIncrease} className="text-xl rounded-[0_10px_10px_0] border-[1px] border-orange-700 px-4 py-2">{icons.iconIncrease}</button>
                                </div>
                            </div>
                            <div className="sm:grid lg:grid-cols-3 gap-4 max-lg:grid-cols-2 max-md:grid-cols-3 max-sm:flex max-sm:justify-between">
                                <button className="text-xl text-orange-700 border-[1px] border-orange-700 px-4 py-2 rounded-[10px] font-600 w-full"
                                    onClick={handleBuyNow}
                                >Buy Now</button>
                                <button className="text-xl justify-center bg-orange-700 text-white px-4 py-2 rounded-[10px] flex gap-2 items-center"
                                    onClick={handleOrderByDetail}
                                >
                                    {icons.iconCart}
                                    <p className="max-sm:hidden">Add To Card</p>
                                </button>
                            </div>
                            <div className="flex flex-col gap-4 max-lg:hidden">
                                <p className="text-xl font-bold">Product description</p>
                                <p className="text-xl text-black/70">{resProductBy?.description}</p>
                            </div>
                        </div>
                    </section>
                    <div className="flex flex-col gap-4 lg:hidden">
                        <p className="text-xl font-bold">Product description</p>
                        <p className="text-xl text-black/70">{resProductBy?.description}</p>
                    </div>
                    <section className="flex flex-col gap-5">
                        <h3 className="text-xl pb-2 border-b-[2px] border-b-gray-200">RELATED PRODUCTS</h3>
                        {resProductRelateBy.length === 0 ?
                            <p className="text-center text-red-800">! No data</p>
                            :

                            <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5 ">
                                {resProductRelateBy.map(productRelate => (
                                    <div key={productRelate.id} className="bg-white relative grid rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl "

                                    >
                                        <div className="relative self-start ">
                                            <button onClick={() => {
                                                handleProductRelateDetail(productRelate.id)
                                            }}>
                                                <img src={productRelate.images[0]} alt={productRelate.title} onError={handleImgError} className="relative transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70" />
                                                <div className="absolute top-[10px] left-[10px] bg-orange-700 text-white rounded-[5px] text-center py-1 px-2 text-sm group-hover:opacity-70">{productRelate.category.name}</div>
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] rounded-full bg-orange-800 transition-all duration-300 ease text-white content-center opacity-0 group-hover:opacity-100 z-10">DETAIL</div>
                                            </button>
                                            <div className="px-3 pt-3">
                                                <p className="text-start font-bold text-lg text-black/70">{productRelate.title}</p>
                                                <p className="text-start text-orange-700 font-bold text-xl">$ {productRelate.price} </p>
                                            </div>
                                        </div>
                                        <div className="flex p-3 self-end gap-2">
                                            <button className="bg-orange-700 text-white w-full justify-center px-4 py-2 rounded-[8px] relative flex gap-2 items-center transition-all duration-300 ease"
                                                onClick={() => {
                                                    handleOrder(productRelate.id)
                                                }}
                                            >{icons.iconCart}
                                                <p className="">Add To Card</p>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </section>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default ProductDetail