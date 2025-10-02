import React from "react";
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
    const { icons, setResProduct, resProduct } = useGlobal()

    return (
        <>
            <main className="bg-gray-100 min-h-[70vh]">
                <div className="max-w-[1500px] mx-auto p-5 flex flex-col">
                    {resProduct === undefined ?
                        <p className="text-center text-red-800">! No data</p>
                        :
                        <>
                        </>
                    }
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default Products