import React, { useEffect } from "react";
import { useGlobal } from '../../context/GlobalContext';

import {
    getProductsById,
    getProductsPage,
    getFilterProductByTitle_Page,
    getFilterPriceRange_CategoryId_Page,
    getFilterPriceRange_Page,
    getCategories,
    getCategoriesById,
    getFilterProductByCategoryId_Page,
    getFilterPriceRange_Title_Page
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Categories: React.FC = () => {
    const navigate = useNavigate()
    const { icons, setResProduct, resProduct,
        setOrdersNumber, ordersNumber, setOrdersList,
        setResProductBy, setResCategories, resCategories,
        selectCateCategoryName, setSelectCateCategoryName,
        selectCateCategoryID, setSelectCateCategoryID,
        resCategoriesBy, setResCategoriesBy,
        pageSize, imgs
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

    useEffect(() => {
        getApiCategories()
    }, [])

    const handleCateGoriesById = (id: number, name: string) => {
        setSelectCateCategoryID(id)
        setSelectCateCategoryName(name)
        navigate("/products")
    }

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // tránh vòng lặp vô hạn
        e.currentTarget.src = imgs.imgDefault;//"https://placehold.co/600x400" //imgs.imgDefault; // ảnh mặc định (nên để trong public/images)
    };

    return (
        <>
            <div className='w-full px-5 bg-gray-100 sticky z-[999] md:top-[120px] max-md:top-[135px]'>
                <div className='flex gap-2 max-w-[1500px] mx-auto items-center text-orange-700 py-[10px] text-xl max-md:text-lg '>
                    <div
                        onClick={() => navigate("/")}
                        className='transition duration-300 ease css-icon'>{icons.iconHome}</div>
                    <span>{icons.iconNext}</span>
                    <div className='transition duration-300 ease css-icon'>CATEGORIES</div>
                </div>
            </div>
            <main className="bg-gray-100 min-h-[70vh]  p-5">
                {resCategories.length === 0 ?
                    <p className="text-center text-red-800">! No data</p>
                    :
                    <div className="max-w-[1500px] mx-auto grid md:grid-cols-5 gap-5">
                        {resCategories?.map(cate => (
                            <div key={cate.id} className="bg-white relative rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl">
                                <img src={cate?.image} alt={cate?.name} className="transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70" onError={handleImgError} />
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
                }
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default Categories