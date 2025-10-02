import React, { useEffect, useState } from "react";
import { useGlobal } from '../../context/GlobalContext';
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

const Products: React.FC = () => {
    const navigate = useNavigate()
    const { icons, setResProduct, resProduct,
        setOrdersNumber, ordersNumber, setOrdersList,
        setResProductBy, setResCategories, resCategories
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

    const getApiProduct = async (offset: number, limit: number) => {
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

    const getApiProductById = async (id: number) => {
        try {
            const res = await getProductsById(id)
            setResProductBy(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getProductsById", error)
            toast.error("Lỗi khi gọi API getProductsById")
            setResProductBy(undefined)
        }
    }

    const getApiProductsByCategories_Id = async (id: number) => {
        try {
            const res = await getProductsByCategories_Id(id)
            setResProduct(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getApiProductsByCategories_Id", error)
            toast.error("Lỗi khi gọi API getApiProductsByCategories_Id")
            setResProduct([])
        }
    }

    const [pageSize, setPageSize] = useState<number>(10)
    const [offset, setOffset] = useState<number>(0)
    const [limit, setLimit] = useState<number>(10)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        getApiProduct(offset, limit)
        getApiCategories()
    }, [])

    const handleOrder = (id: number) => {
        setOrdersNumber(ordersNumber + 1)
        const productToAdd = resProduct.find(product => product.id === id)
        if (!productToAdd) return;
        setOrdersList(prev => [...prev, productToAdd]);
    }

    const handleSigleProduct = (id: number) => {
        getApiProductById(id)
        navigate("/product-detail")
    }

    const handleProductByCatecory = (id: number) => {
        getApiProductsByCategories_Id(id)
    }

    const [selectCate, setSelectCate] = useState<number>(0)

    return (
        <>
            <div className='w-full px-5 bg-gray-100 sticky z-[999] md:top-[120px] max-md:top-[135px]'>
                <div className='flex gap-2 max-w-[1500px] mx-auto items-center text-orange-700 py-[10px] text-xl max-md:text-lg '>
                    <div
                        onClick={() => navigate("/")}
                        className='transition duration-300 ease css-icon'>{icons.iconHome}</div>
                    <span>{icons.iconNext}</span>
                    <div className='transition duration-300 ease css-icon'>PRODUCTS</div>
                </div>
            </div>
            <main className="bg-gray-100 min-h-[70vh] ">
                <div className="max-w-[1500px] mx-auto grid md:grid-cols-[1fr_4fr] gap-5 p-5">
                    <section className="flex flex-col">
                        <div className="items-center pb-2 border-b-[2px] border-b-gray-200">
                            <h3 className="text-xl text-black/50">CATEGORIES</h3>
                        </div>
                        <div className={`${selectCate === -1 ? "bg-orange-700 text-white font-bold" : ""} text-xl transition-all duration-300 ease cursor-pointer hover:bg-orange-700 hover:text-white hover:font-bold active:bg-orange-700 active:text-white active:font-bold`}
                            onClick={() => {
                                getApiProduct(offset, limit)
                                setSelectCate(-1)
                            }}
                        >
                            <p className="py-1 px-2">All</p>
                        </div>
                        {resCategories.map(cate => (
                            <div key={cate.id} className={`${selectCate === cate.id ? "bg-orange-700 text-white font-bold" : ""} flex gap-2 text-xl transition-all duration-300 ease cursor-pointer hover:bg-orange-700 hover:text-white hover:font-bold`}
                                onClick={() => {
                                    handleProductByCatecory(cate.id)
                                    setSelectCate(cate.id)
                                }}
                            >
                                <p className="py-1 px-2">{cate.name}</p>
                            </div>
                        ))}
                    </section>
                    <section className="  flex flex-col">
                        {resProduct === undefined ?
                            <p className="text-center text-red-800">! No data</p>
                            :
                            <>
                                <div className="grid md:grid-cols-4 gap-5">
                                    {resProduct?.map(product => (
                                        <div key={product.id} className="bg-white relative grid rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl "

                                        >
                                            <div className="relative self-start ">
                                                <img src={product.images[0]} alt={product.title} className="relative transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70" />
                                                <div className="absolute top-[10px] left-[10px] bg-orange-700 text-white rounded-[5px] text-center py-1 px-2 text-sm ">{product.category.name}</div>
                                                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] rounded-full bg-orange-800 transition-all duration-300 ease text-white content-center opacity-0 group-hover:opacity-100 z-100"
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
                            </>
                        }
                    </section>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default Products