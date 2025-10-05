import React, { useEffect, useState } from "react";
import {
    getProductsById
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
        selectProductID, setSelectProductId
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

    const location = useLocation();
    const { idProduct } = location.state || {};

    useEffect(() => {
        if (idProduct === -1) {
            navigate("/")
        }
        else {
            getApiSigleProduct(idProduct)
            setSelectProductId(idProduct)
        }
    }, [])

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default ProductDetail