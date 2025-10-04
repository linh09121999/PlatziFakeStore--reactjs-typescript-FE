import React, { useEffect, useState } from "react";
import {
    getProductsPage,
    getCategories,
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useGlobal } from '../../context/GlobalContext';

const Home: React.FC = () => {
    const navigate = useNavigate()
    const { icons, imgs, setResProduct, resProduct, setResCategories, resCategories, setResProductBy,
        ordersList, setOrdersList, setOrdersNumber, ordersNumber,
        resCategoriesBy, setResCategoriesBy,
        selectCateCategoryName, setSelectCateCategoryName,
        selectCateCategoryID, setSelectCateCategoryID,
    } = useGlobal()


    const getApiCategories = async () => {
        try {
            const res = await getCategories()
            setResCategories(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getCategories", error)
            toast.error("Lỗi khi gọi API getCategories")
            setResCategories([])
        }
    }

    const getApiProductPage = async (offset: number, limit: number) => {
        try {
            const res = await getProductsPage(offset, limit)
            setResProduct(res.data)
            console.log(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getProductsPage", error)
            toast.error("Lỗi khi gọi API getProductsPage")
            setResProduct([])
        }
    }

    useEffect(() => {
        getApiCategories()
        getApiProductPage(0, 10)
    }, [])

    const handleProduct = () => {
        navigate("/products")
        setSelectCateCategoryID(-1)
        setSelectCateCategoryName("all")
        setResProduct([])
    }

    const handleSigleProduct = (id: number) => {
        navigate("/product-detail")
    }

    const handleOrder = (id: number) => {
        setOrdersNumber(ordersNumber + 1)
        const productToAdd = resProduct.find(product => product.id === id)
        if (!productToAdd) return;
        setOrdersList(prev => [...prev, productToAdd]);
    }

    const handleCateGoriesById = (id: number, name: string) => {
        setSelectCateCategoryID(id)
        setSelectCateCategoryName(name)
        navigate("/products")
    }

    return (
        <>
            <main className="bg-gray-100 min-h-[70vh] p-5">
                <div className="max-w-[1500px] mx-auto flex flex-col gap-10">
                    <section className="flex justify-between bg-gradient-to-r to-orange-600 from-orange-700 py-5 px-20 rounded-[10px]">
                        <div className="flex flex-col gap-10 self-center">
                            <h1 className="text-8xl font-bold text-white">Spee Shop</h1>
                            <button onClick={handleProduct}
                                className="px-4 py-1 css-next bg-white rounded-[10px] text-xl font-600 flex gap-2 items-center w-fit text-orange-700">BY NOW
                                <span>{icons.iconNext}</span>
                            </button>
                        </div>
                        <img src={imgs.imgBanner1} alt='banner' className=" h-[450px]" />
                    </section>
                    <section className=" flex flex-col gap-4">
                        <div className="md:flex md:justify-between items-center pb-2 border-b-[2px] border-b-gray-200">
                            <h3 className="text-xl text-black/50">CATEGORIES</h3>
                            <button className="text-orange-700 flex gap-1 text-lg css-next items-center"
                                onClick={() => {
                                    navigate("/categories")
                                }}>
                                View all
                                <span>{icons.iconNext}</span>
                            </button>
                        </div>
                        {/* flex wrap justify-center */}
                        <div className="grid grid-cols-5 gap-5 ">
                            {resCategories?.slice(0, 5).map(cate => (
                                <div key={cate.id} className="bg-white relative rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl">
                                    <img src={cate?.image} alt={cate?.name} className="transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70" />
                                    <h3 className="p-3 text-lg text-black/70 font-bold group-hover:opacity-70">{cate?.name}</h3>
                                    <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] rounded-full bg-orange-800 transition-all duration-300 ease text-white content-center opacity-0 group-hover:opacity-100 z-100"
                                        onClick={() => {
                                            handleCateGoriesById(cate.id, cate.name)
                                        }}
                                    >
                                        DETAIL
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className=" flex flex-col gap-4">
                        <div className="md:flex md:justify-between items-center pb-2 border-b-[2px] border-b-gray-200">
                            <h3 className="text-xl text-black/50">PRODUCTS</h3>
                            <button className="text-orange-700 flex gap-1 text-lg css-next items-center"
                                onClick={handleProduct}>
                                View all
                                <span>{icons.iconNext}</span>
                            </button>
                        </div>
                        <div className="grid md:grid-cols-5 gap-5">
                            {resProduct?.map(product => (
                                <div key={product.id} className="bg-white relative grid rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl "

                                >
                                    <div className="relative self-start ">
                                        <img src={product.images[0]} alt={product.title} className="relative transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70" />
                                        <div className="absolute top-[10px] left-[10px] bg-orange-700 text-white rounded-[5px] text-center py-1 px-2 text-sm ">{product.category.name}</div>
                                        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] rounded-full bg-orange-800 transition-all duration-300 ease text-white content-center opacity-0 group-hover:opacity-100 z-10"
                                            onClick={() => {
                                                navigate("/product-similar")
                                            }}
                                        >
                                            SIMILAR
                                        </button>
                                        <div className="px-3 pt-3">
                                            <p className="text-start font-bold text-lg text-black/70">{product.title}</p>
                                            <p className="text-start text-orange-700 font-bold text-xl">$ {product.price} </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between p-3 self-end gap-2">
                                        <button className="border-[1px] border-orange-700 rounded-[10px] px-4 py-2 text-orange-700"
                                            onClick={() => {
                                                handleSigleProduct(product.id)
                                            }}
                                        >{icons.iconEye}</button>
                                        <button className="bg-orange-700 text-white w-full justify-center px-4 py-2 rounded-[10px] relative flex gap-2 items-center transition-all duration-300 ease"
                                            onClick={() => {
                                                handleOrder(product.id)
                                            }}
                                        >{icons.iconCart}
                                            <p className="">Add To Card</p>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default Home