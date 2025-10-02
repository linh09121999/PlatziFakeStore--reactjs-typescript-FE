import React, { useEffect, useState } from "react";
import {
    getProducts,
    getProductsById,
    getProductsBySlug,
    getProductsPage,
    getProductsRelatedById,
    getProductsRelatedBySlug,
    getProductsByCategories_Id,
    getFilterProductByTitle,
    getFilterProductByPrice,
    getFilterProductByPriceRange,
    getFilterProductByCategoryId,
    getFilterProductByCategorySlug,
    getFllterProductTitle_PriceRange_CategoryId,
    getFilterPriceRange_CategoryId_Page,
    getFilterPriceRange_Page,
    getCategories,
    getCategoriesById,
    getCategoriesBySlug,
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useGlobal } from '../../context/GlobalContext';
import { read } from "fs";

const Home: React.FC = () => {
    const navigate = useNavigate()
    const { icons, setResProduct, resProduct, setResCategories, resCategories, setResProductBy } = useGlobal()


    const getApiCategories = async () => {
        try {
            const res = await getCategories()
            setResCategories(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getFilterProductByTitle", error)
            toast.error("")
            setResCategories([])
        }
    }

    const getApiProduct = async (offset: number, limit: number) => {
        try {
            const res = await getProductsPage(offset, limit)
            setResProduct(res.data)
            console.log(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getFilterProductByTitle", error)
            toast.error("")
            setResProduct([])
        }
    }

    const getApiProductById = async (id: number) => {
        try {
            const res = await getProductsById(id)
            setResProductBy(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getFilterProductByTitle", error)
            toast.error("")
            setResProductBy(undefined)
        }
    }


    useEffect(() => {
        getApiCategories()
        getApiProduct(0, 10)
    }, [])

    const handleSigleProduct = (id: number) => {
        getApiProductById(id)
        navigate("/product-detail")
    }

    return (
        <>
            <main className="bg-gray-100 min-h-[70vh] p-5">
                <div className="max-w-[1500px] mx-auto flex flex-col gap-10">
                    <section></section>
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
                                <div key={cate.id} className="bg-white rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl">
                                    <img src={cate?.image} alt={cate?.name} className="transition-all duration-300 ease group-hover:scale-105" />
                                    <h3 className="p-5 text-lg font-bold">{cate?.name}</h3>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className=" flex flex-col gap-4">
                        <div className="md:flex md:justify-between items-center pb-2 border-b-[2px] border-b-gray-200">
                            <h3 className="text-xl text-black/50">PRODUCTS</h3>
                            <button className="text-orange-700 flex gap-1 text-lg css-next items-center"
                                onClick={() => {
                                    navigate("/products")
                                }}>
                                View all
                                <span>{icons.iconNext}</span>
                            </button>
                        </div>
                        <div className="grid md:grid-cols-5 gap-5">
                            {resProduct?.map(product => (
                                <div key={product.id} className="bg-white rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl"
                                    onClick={()=>{
                                        handleSigleProduct(product.id)
                                    }}
                                >
                                    <div className="relative">
                                        <img src={product.images[0]} alt={product.title} className="relative transition-all duration-300 ease group-hover:scale-105 " />
                                        <div className="absolute top-[10px] left-[10px] bg-orange-700 text-white rounded-[5px] text-center py-1 px-2 text-sm">{product.category.name}</div>
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