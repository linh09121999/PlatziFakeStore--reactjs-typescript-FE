import React, { useEffect } from "react";
import {
    getProductsPage,
    getCategories,
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { useGlobal } from '../../context/GlobalContext';

const Home: React.FC = () => {
    const navigate = useNavigate()
    const { icons, imgs, setResProduct, resProduct, setResCategories, resCategories,
        setOrdersList, setOrdersNumber, ordersNumber, isTable
    } = useGlobal()


    const getApiCategories = async () => {
        try {
            const res = await getCategories()
            setResCategories(res.data)
        } catch (error: any) {
            console.error("Lỗi khi gọi API getCategories", error)
            toast.error(error.response?.data?.message || "Lỗi khi gọi API getCategories")
            setResCategories([])
        }
    }

    const getApiProductPage = async (offset: number, limit: number) => {
        try {
            const res = await getProductsPage(offset, limit)
            setResProduct(res.data)
            console.log(res.data)
        } catch (error: any) {
            console.error("Lỗi khi gọi API getProductsPage", error)
            toast.error(error.response?.data?.message || "Lỗi khi gọi API getProductsPage")
            setResProduct([])
        }
    }

    useEffect(() => {
        getApiCategories()
        getApiProductPage(0, 10)
    }, [])

    const handleProduct = () => {
        navigate("/products", {
            state: { id: -1, name: "all" }
        })
        setResProduct([])
    }

    const handleSigleProduct = (id: number) => {
        navigate("/product-detail", {
            state: { idProduct: id }
        })
    }

    const handleOrder = (id: number) => {
        setOrdersNumber(ordersNumber + 1)
        const productToAdd = resProduct.find(product => product.id === id)
        if (!productToAdd) return;
        setOrdersList(prev => [...prev, productToAdd]);
    }

    const handleCateGoriesById = (id: number, name: string) => {
        navigate("/products", {
            state: { id, name }
        })
        setResProduct([])
    }

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // tránh vòng lặp vô hạn
        e.currentTarget.src = imgs.imgDefault;//"https://placehold.co/600x400" //imgs.imgDefault; // ảnh mặc định (nên để trong public/images)
    };

    return (
        <>
            <main className="bg-gray-100 min-h-[75vh] p-5">
                <div className="max-w-[1500px] mx-auto flex flex-col gap-10">
                    <section className="flex justify-between bg-gradient-to-r to-orange-600 from-orange-700 py-5 px-20 rounded-[10px] gap-10 max-md:hidden">
                        <div className="flex flex-col gap-5 self-center">
                            <h1 className="text-8xl font-bold text-white max-xl:text-7xl">Platzi Fake Store</h1>
                            <p className="text-xl text-white/70 max-xl:text-lg">Stop waiting. Start shopping. Platzi Fake Store provides a fast, smooth, and engaging online shopping experience. Featuring an optimized interface, a smart search system, and lightning-fast order processing, Platzi Fake Store is the go-to for smart shoppers who appreciate efficiency and class.</p>
                            <button onClick={handleProduct}
                                className="px-4 py-1 css-next bg-white rounded-[10px] max-xl:text-lg text-xl font-600 flex gap-2 items-center w-fit text-orange-700">BY NOW
                                <span>{icons.iconNext}</span>
                            </button>
                        </div>
                        <img src={imgs.imgBanner1} alt='banner' className="max-lg:hidden " onError={handleImgError} />
                    </section>
                    <section className=" flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-2 border-b-[2px] border-b-gray-200">
                            <h3 className="text-xl">CATEGORIES</h3>
                            <button className="text-orange-700 flex gap-1 text-lg css-next items-center"
                                onClick={() => {
                                    navigate("/categories")
                                }}>
                                View all
                                <span>{icons.iconNext}</span>
                            </button>
                        </div>
                        {/* flex wrap justify-center */}
                        <div className="grid lg:grid-cols-5 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2">
                            {resCategories?.slice(0, isTable ? 6 : 5).map(cate => (
                                <div key={cate.id} className="bg-white relative rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl">
                                    <button onClick={() => {
                                        handleCateGoriesById(cate.id, cate.name)
                                    }}>
                                        <img src={cate?.image} alt={cate?.name} className="transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70" onError={handleImgError} />
                                        <h3 className="p-3 text-lg text-black/70 font-bold group-hover:opacity-70">{cate?.name}</h3>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] rounded-full bg-orange-800 transition-all duration-300 ease text-white content-center opacity-0 group-hover:opacity-100 z-10">DETAIL</div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className=" flex flex-col gap-4">
                        <div className="flex justify-between items-center pb-2 border-b-[2px] border-b-gray-200">
                            <h3 className="text-xl">PRODUCTS</h3>
                            <button className="text-orange-700 flex gap-1 text-lg css-next items-center"
                                onClick={handleProduct}>
                                View all
                                <span>{icons.iconNext}</span>
                            </button>
                        </div>
                        <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-5">
                            {resProduct?.map(product => (
                                <div key={product.id} className="bg-white relative grid rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl "

                                >
                                    <div className="relative self-start ">
                                        <button onClick={() => {
                                            handleSigleProduct(product.id)
                                        }}>
                                            <img src={product.images[0]} alt={product.title} onError={handleImgError} className="relative transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70" />
                                            <div className="absolute top-[10px] left-[10px] bg-orange-700 text-white rounded-[5px] text-center py-1 px-2 text-sm group-hover:opacity-70">{product.category.name}</div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90px] h-[90px] rounded-full bg-orange-800 transition-all duration-300 ease text-white content-center opacity-0 group-hover:opacity-100 z-10">DETAIL</div>
                                        </button>
                                        <div className="px-3 pt-3">
                                            <p className="text-start font-bold text-lg text-black/70">{product.title}</p>
                                            <p className="text-start text-orange-700 font-bold text-xl">$ {product.price} </p>
                                        </div>
                                    </div>
                                    <div className="flex p-3 self-end gap-2">
                                        <button className="bg-orange-700 text-white w-full justify-center px-4 py-2 rounded-[8px] relative flex gap-2 items-center transition-all duration-300 ease"
                                            onClick={() => {
                                                handleOrder(product.id)
                                            }}
                                        >
                                            {icons.iconCart}
                                            <p>Add To Card</p>
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