import React, { useEffect, useState, useCallback } from "react";
import { useGlobal } from '../../context/GlobalContext';
import type { ResProduct } from "../../context/GlobalContext";
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

import {
    TextField,
    InputAdornment,
    FormControl,
    Autocomplete,
    MenuItem, Menu
} from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";

import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Products: React.FC = () => {
    const sxFormControl = {
        minWidth: 250,
        margin: 0
    }

    const componentsProps: SxProps<Theme> = {
        paper: {
            sx: {
                background: 'white',
                zIndex: 100,
                '& .MuiAutocomplete-option': {
                    minHeight: '30px !important',
                    color: 'var(--color-orange-700)',
                },
                '& .MuiAutocomplete-option:hover': {
                    backgroundColor: 'var(--color-orange-700) !important',
                    color: 'white !important',
                    fontWeight: 600
                },
                '& .MuiAutocomplete-option[aria-selected="true"]': {
                    backgroundColor: 'var(--color-orange-700) !important',
                    color: 'white !important',
                    fontWeight: 600
                }
            }
        }
    }

    const sxText: SxProps<Theme> = {
        '& .MuiOutlinedInput-root': {
            backdropFilter: 'blur(10px)',
            borderRadius: '10px',
            background: 'white',
            color: 'var(--color-orange-700)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            height: '40px',
            boxShadow: 'var(--shadow-lg)'
        },
        '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
            // border: '1px solid rgba(255, 255, 255, 0.4) !important',
            border: 'none',
            boxShadow: 'var(--shadow-xl)'
        },
    }

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

    const [selectCateCategoryName, setSelectCateCategoryName] = useState<string | undefined>("");
    const [selectCateCategoryID, setSelectCateCategoryID] = useState<number>(-1)

    const handleChangeSearchCategory = (_: React.SyntheticEvent | null, newValue: { id: number, name: string } | null) => {
        console.log("🔥 onChange fired:", newValue);
        if (newValue === null) {
            console.log("👉 Clear selection, call getApiProductPage");
            setResProduct([]);
            setSelectCateCategoryID(-1)
            // getApiProductPage(0, pageSize)
        } else {
            const idCategory = newValue.id
            const nameCategory = newValue ? newValue.name : undefined
            setSelectCateCategoryID(idCategory);
            getApiProductsByCategories_Id(idCategory)
            setSelectCateCategoryName(nameCategory)

        }
    };

    const handleSearchCategory = () => {
        getApiProductsByCategories_Id(selectCateCategoryID!)
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 1. Ngăn Menu “ăn” phím
        e.stopPropagation();
        // 2. Nếu bạn có logic riêng (Enter để search…) thì giữ lại:
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchCategory();
        }
    };


    const [page, setPage] = useState(0)
    const pageSize = 12
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true) //CHECK OUT OF STOCK

    const getApiProductPage = async (offset: number, limit: number) => {
        try {
            setLoading(true)
            // Nếu đang filter theo category thì KHÔNG gọi API getProductPage
            if (selectCateCategoryID !== -1) return;

            const res = await getProductsPage(offset, limit) // gọi API của bạn
            if (res.data.length < pageSize) {
                // ✅ nếu số sản phẩm trả về ít hơn pageSize -> hết sản phẩm
                setHasMore(false)
            }
            // Nối thêm dữ liệu mới (lazy load)
            // setResProduct(prev => [...prev, ...res.data])
            setResProduct(prev => {
                // Tránh nối trùng dữ liệu
                const newItems = res.data.filter(
                    (item: ResProduct) => !prev.some(p => p.id === item.id) // check theo id hoặc unique field
                );
                return [...prev, ...newItems];
            });

        } catch (error) {
            console.error("Lỗi khi gọi API getProductsPage", error)
            toast.error("Lỗi khi gọi API getProductsPage")
        } finally {
            setLoading(false)
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

    useEffect(() => {
        // getApiProductPage(0, pageSize)
        getApiCategories()
    }, [])

    useEffect(() => {
        if (selectCateCategoryID === -1) {
            getApiProductPage(0, pageSize);
        }
    }, [selectCateCategoryID]);

    const handleLoadMore = () => {
        if (!hasMore || loading) return
        const newPage = page + 1
        setPage(newPage)
        const offset = newPage * pageSize
        getApiProductPage(offset, pageSize)
    }

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

    const removeVietnameseTones = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

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
            <main className="bg-gray-100 min-h-[70vh]  p-5">
                <div className="max-w-[1500px] mx-auto grid md:grid-cols-[1fr_4fr] gap-5">
                    <aside className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <div className="items-center pb-2 border-b-[2px] border-b-gray-200">
                                <h3 className="text-xl text-black">CATEGORIES</h3>
                                <p className="text-sm text-black/50">{selectCateCategoryID === -1 ? "All" : selectCateCategoryName}</p>
                            </div>
                            <FormControl className="w-full" sx={sxFormControl} size="small">
                                <Autocomplete
                                    // disableClearable
                                    noOptionsText="There is no category"
                                    options={resCategories}
                                    componentsProps={componentsProps}
                                    getOptionLabel={(option) => option.name}
                                    filterOptions={(options, { inputValue }) =>
                                        options.filter((option) =>
                                            removeVietnameseTones(option.name).toLowerCase().includes(
                                                removeVietnameseTones(inputValue).toLowerCase()
                                            )
                                        )
                                    }
                                    value={
                                        selectCateCategoryID >= 0
                                            ? resCategories.find((c) => c.id === selectCateCategoryID) ?? undefined
                                            : undefined
                                    }
                                    onChange={(handleChangeSearchCategory)}
                                    renderInput={(params) => (
                                        <TextField  {...params}
                                            type="search"
                                            placeholder="Search for categories..."
                                            sx={sxText}
                                            onKeyDown={handleKeyPress}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <InputAdornment position="end" sx={{ marginRight: '-20px', color: 'var(--color-oảnge-700)' }}>
                                                        <button className='btn-merge'
                                                            onClick={handleSearchCategory}
                                                        >
                                                            {icons.iconSearch}
                                                        </button>
                                                    </InputAdornment>
                                                ),
                                            }}

                                        />
                                    )}
                                />
                            </FormControl>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="items-center pb-2 border-b-[2px] border-b-gray-200">
                                <h3 className="text-xl text-black">PRICE RANGE</h3>
                            </div>
                            
                        </div>
                    </aside>
                    <section className="flex flex-col gap-4 ">
                        <div className="items-center pb-2 border-b-[2px] border-b-gray-200">

                            {selectCateCategoryID === -1 ?
                                <>
                                    <div>
                                        <h3 className="text-xl text-black">PRODUCTS</h3>
                                        <p className="text-sm text-black/50">Show {resProduct.length} items found for all</p>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="">
                                        <h3 className="text-xl text-black">{selectCateCategoryName?.toUpperCase()}</h3>
                                        <p className="text-sm text-black/50">{resProduct.length} items found for "{selectCateCategoryName}"</p>
                                    </div>
                                </>
                            }

                        </div>
                        {resProduct.length === 0 ?
                            <p className="text-center text-red-800">! No data</p>
                            :
                            <>
                                <div className="grid md:grid-cols-4 gap-5">
                                    {resProduct?.map(product => (
                                        <div key={product.id} className="bg-white relative grid rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl "

                                        >
                                            <div className="relative self-start ">
                                                <img src={product.images[0]} alt={product.title} className="relative transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70" />
                                                <div className="absolute top-[10px] left-[10px] bg-orange-700 text-white rounded-[5px] text-center py-1 px-2 text-sm group-hover:opacity-70">{product.category.name}</div>
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
                                {selectCateCategoryID === -1 && (
                                    <div className="text-center mt-4">
                                        {hasMore ? (
                                            <button
                                                onClick={handleLoadMore}
                                                disabled={loading}
                                                className="px-4 py-2 bg-orange-700 text-white rounded hover:bg-orange-600"
                                            >
                                                {loading ? "Loading..." : "Loading more"}
                                            </button>
                                        ) : (
                                            <p className="text-gray-500 mt-2">There are no more products</p>
                                        )}
                                    </div>
                                )}
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