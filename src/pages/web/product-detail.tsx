import React, { useEffect, useState } from "react";
import {
    getProductsById,
    getProductsRelatedById
} from "../../services/userService"

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

import { useGlobal } from '../../context/GlobalContext';

const ProductDetail: React.FC = () => {
    const navigate = useNavigate()
    const { icons, imgs, setResProduct, resProduct, setResCategories, resCategories, setResProductBy,
        ordersList, setOrdersList, setOrdersNumber, ordersNumber,
        resCategoriesBy, setResCategoriesBy,
        selectCateCategoryName, setSelectCateCategoryName,
        selectCateCategoryID, setSelectCateCategoryID,
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
        if (idProduct === -1) {
            navigate("/")
        }
        else {
            getApiSigleProduct(idProduct)
            setSelectProductId(idProduct)
            getApiProductsRelatedById(idProduct)
        }
    }, [])

    return (
        <>
            <div className='w-full px-5 bg-gray-100 sticky z-[999] md:top-[120px] max-md:top-[135px]'>
                <div className='flex gap-2 max-w-[1500px] mx-auto items-center text-orange-700 py-[10px] text-xl max-md:text-lg '>
                    <div
                        onClick={() => navigate("/")}
                        className='transition duration-300 ease css-icon'>{icons.iconHome}</div>
                    <span>{icons.iconNext}</span>
                    <div
                        onClick={() => navigate("/products")}
                        className='transition duration-300 ease css-icon'>PRODUCTS</div>
                    <span>{icons.iconNext}</span>
                    <div className='transition duration-300 ease css-icon'>DETAIL</div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default ProductDetail