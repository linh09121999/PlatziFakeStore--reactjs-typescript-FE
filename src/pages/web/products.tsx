import React, { useEffect, useState, useCallback } from "react";
import { useGlobal } from '../../context/GlobalContext';
import type { ResProduct } from "../../context/GlobalContext";
import NumberTextField from "../../components/numberTextField";
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

import {
    TextField,
    InputAdornment,
    FormControl,
    Autocomplete,
    MenuItem, Menu,
    Box, Slider
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
            height: '40px',
            boxShadow: 'var(--shadow-lg)',
            border: 'none',
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

    const PaperProps: SxProps<Theme> = {
        sx: {
            borderRadius: '10px',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
            maxWidth: 'calc(100%)',
            background: 'white',
            zIndex: 100,
        },
    }

    const MenuListProps: SxProps<Theme> = {
        sx: {
            paddingY: 0.5,
        },
    }

    const sxMenuItem: SxProps<Theme> = {
        justifyContent: 'start',
        paddingY: '10px',
        paddingLeft: '20px',
        color: 'black',
        zIndex: 100,
        '&:hover': {
            backgroundColor: 'var(--color-orange-700) !important',
            color: 'white !important',
            fontWeight: 600
        },
    }

    const sxSlider: SxProps<Theme> = {
        color: "#c2410c", // tailwind orange-700
        '& .MuiSlider-thumb': {
            bgcolor: '#fff',
            border: '2px solid currentColor',
            width: 20,
            height: 20,
            boxShadow: '0 0 0 8px rgba(194,65,12,0.12)',
        },
        '& .MuiSlider-track': {
            border: 'none',
        },
        '& .MuiSlider-rail': {
            opacity: 0.5,
            backgroundColor: 'rgba(194,65,12,0.25)',
        },
        '& .MuiSlider-mark': {
            backgroundColor: 'transparent',
        }
    }

    const sxTextField: SxProps<Theme> = {
        width: "50%",
        '& .MuiOutlinedInput-root': {
            borderRadius: "10px",
            background: "var(--color-white)",
            height: '40px',
            boxShadow: 'var(--shadow-lg)',
            padding: '3px 8px',
            transition: 'all 0.3s',
            fontSize: 'var(--text-xl)',
            border: 'none',
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
        },
    }

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

    const [page, setPage] = useState(0)
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true) //CHECK OUT OF STOCK
    const [checkRangePrice, setCheckRangePrice] = useState<boolean>(false)

    const [priceMin, setPriceMin] = React.useState<number>(0);
    const [priceMax, setPriceMax] = React.useState<number>(0);

    const getApiProductPage = async (offset: number, limit: number) => {
        try {
            setLoading(true)
            setCheckRangePrice(false)
            setPriceMin(0)
            setPriceMax(0)
            const res = await getProductsPage(offset, limit)
            if (res.data.length < pageSize) {
                setHasMore(false)
            }
            setResProduct(prev => {
                // Tránh nối trùng dữ liệu
                const newItems = res.data.filter(
                    (item: ResProduct) => !prev.some(p => p.id === item.id) // check theo id hoặc unique field
                );
                return [...prev, ...newItems];
            });

            setSelectCateCategoryName("all")
        } catch (error) {
            console.error("Lỗi khi gọi API getProductsPage", error)
            toast.error("Lỗi khi gọi API getProductsPage")
        } finally {
            setLoading(false)
        }
    }

    const getApiFilterProductByTitle_Page = async (title: string, offset: number, limit: number) => {
        try {
            setLoading(true)
            setCheckRangePrice(false)
            setPriceMin(0)
            setPriceMax(0)
            const res = await getFilterProductByTitle_Page(title, offset, limit)
            if (res.data.length < pageSize) {
                setHasMore(false)
            }
            setResProduct(prev => {
                // Tránh nối trùng dữ liệu
                const newItems = res.data.filter(
                    (item: ResProduct) => !prev.some(p => p.id === item.id) // check theo id hoặc unique field
                );
                return [...prev, ...newItems];
            });

            setSelectCateCategoryName(title)
        } catch (error) {
            console.error("Lỗi khi gọi API getFilterProductByTitle_Page", error)
            toast.error("Lỗi khi gọi API getFilterProductByTitle_Page")
        } finally {
            setLoading(false)
        }
    }

    const getApiFilterProductByCategoryId_Page = async (id: number, offset: number, limit: number) => {
        try {
            setLoading(true)
            setCheckRangePrice(false)
            setPriceMin(0)
            setPriceMax(0)
            const res = await getFilterProductByCategoryId_Page(id, offset, limit)
            if (res.data.length < pageSize) {
                setHasMore(false)
            }
            setResProduct(prev => {
                // Tránh nối trùng dữ liệu
                const newItems = res.data.filter(
                    (item: ResProduct) => !prev.some(p => p.id === item.id) // check theo id hoặc unique field
                );
                return [...prev, ...newItems];
            });

        } catch (error) {
            console.error("Lỗi khi gọi API getFilterProductByCategoryId_Page", error)
            toast.error("Lỗi khi gọi API getFilterProductByCategoryId_Page")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (selectCateCategoryID === -1) {
            getApiProductPage(0, pageSize);
        } else if (selectCateCategoryID === -2) {
            getApiFilterProductByTitle_Page(selectCateCategoryName!, 0, pageSize)
        } else {
            getApiFilterProductByCategoryId_Page(selectCateCategoryID, 0, pageSize)
            getApiCategoriesById(selectCateCategoryID)
        }
        getApiCategories()
    }, [])

    useEffect(() => {
        if (selectCateCategoryID === -1) {
            getApiProductPage(0, pageSize);
        } else if (selectCateCategoryID === -2) {
            getApiFilterProductByTitle_Page(selectCateCategoryName!, 0, pageSize)
        } else {
            getApiFilterProductByCategoryId_Page(selectCateCategoryID, 0, pageSize)
            getApiCategoriesById(selectCateCategoryID)
        }
    }, [selectCateCategoryID]);

    const handleLoadMore = () => {
        if (!hasMore || loading) return
        const newPage = page + 1
        setPage(newPage)
        const offset = newPage * pageSize
        if (checkRangePrice) {
            if (selectCateCategoryID === -1) {
                getApiFilterPriceRange_Page(priceMin, priceMax, pageSize, offset)
            } else if (selectCateCategoryID === -2) {
                getApiFilterPriceRange_Title_Page(selectCateCategoryName!, priceMin, priceMax, pageSize, offset)
            } else {
                getApiFilterPriceRange_CategoryId_Page(priceMin, priceMax, selectCateCategoryID, pageSize, offset)
            }
        }
        else {
            if (selectCateCategoryID === -1) {
                getApiProductPage(offset, pageSize);
            } else if (selectCateCategoryID === -2) {
                getApiFilterProductByTitle_Page(selectCateCategoryName!, offset, pageSize)
            } else {
                getApiFilterProductByCategoryId_Page(selectCateCategoryID, offset, pageSize)
            }
        }
        setSortBy("Default")
    }

    const getApiCategoriesById = async (id: number) => {
        try {
            const res = await getCategoriesById(id)
            setResCategoriesBy(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getCategoriesById", error)
            toast.error("Lỗi khi gọi API getCategoriesById")
            setResCategoriesBy(undefined)
        }
    }

    const handleChangeSearchCategory = (_: React.SyntheticEvent | null, newValue: { id: number, name: string } | null) => {
        setResProduct([]);
        if (newValue === null) {
            setSelectCateCategoryID(-1)
        } else {
            const idCategory = newValue.id
            const nameCategory = newValue ? newValue.name : undefined
            setSelectCateCategoryID(idCategory)
            setSelectCateCategoryName(nameCategory)
            getApiFilterProductByCategoryId_Page(idCategory, 0, pageSize)
            getApiCategoriesById(idCategory)
        }
    };

    const handleSearchCategory = () => {
        setResProduct([]);
        getApiFilterProductByCategoryId_Page(selectCateCategoryID, 0, pageSize)
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

    const removeVietnameseTones = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    const [anchorElSortBy, setAnchorElSortBy] = useState<null | HTMLElement>(null);
    const openSortBy = Boolean(anchorElSortBy);
    const handleClickSortBy = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElSortBy(event.currentTarget);
    };
    const handleCloseSortBy = () => {
        setAnchorElSortBy(null);
    };

    const [sortBy, setSortBy] = useState<string>("Default")

    const handleSortDefault = () => {
        setResProduct([...resProduct].sort(
            (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        ));
        handleCloseSortBy()
        setSortBy("Default")
    }

    // giam dan
    const handleSortHigh = () => {
        setResProduct([...resProduct].sort((a, b) => b.price - a.price));
        handleCloseSortBy()
        setSortBy("Highest")
    }

    // tang dan
    const handleSordLow = () => {
        setResProduct([...resProduct].sort((a, b) => a.price - b.price));
        handleCloseSortBy()
        setSortBy("Lowest")
    }

    // Mới nhất (ngày gần nhất trước)
    const handleSortNewest = () => {
        setResProduct([...resProduct].sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ));
        handleCloseSortBy();
        setSortBy("Newest");
    };

    const getApiFilterPriceRange_Page = async (price_min: number, price_max: number, limit: number, offset: number) => {
        try {
            setLoading(true)
            setCheckRangePrice(true)

            const res = await getFilterPriceRange_Page(price_min, price_max, limit, offset)
            if (res.data.length < pageSize) {
                setHasMore(false)
            }
            setResProduct(prev => {
                // Tránh nối trùng dữ liệu
                const newItems = res.data.filter(
                    (item: ResProduct) => !prev.some(p => p.id === item.id)
                );
                return [...prev, ...newItems];
            });

            setSelectCateCategoryName("all")
        } catch (error) {
            console.error("Lỗi khi gọi API getFilterPriceRange_Page", error)
            toast.error("Lỗi khi gọi API getFilterPriceRange_Page")
        } finally {
            setLoading(false)
        }
    }

    const getApiFilterPriceRange_Title_Page = async (title: string, price_min: number, price_max: number, limit: number, offset: number) => {
        try {
            setLoading(true)
            setCheckRangePrice(true)

            const res = await getFilterPriceRange_Title_Page(title, price_min, price_max, limit, offset)
            if (res.data.length < pageSize) {
                setHasMore(false)
            }
            setResProduct(prev => {
                // Tránh nối trùng dữ liệu
                const newItems = res.data.filter(
                    (item: ResProduct) => !prev.some(p => p.id === item.id)
                );
                return [...prev, ...newItems];
            });

        } catch (error) {
            console.error("Lỗi khi gọi API getFilterPriceRange_Title_Page", error)
            toast.error("Lỗi khi gọi API getFilterPriceRange_Title_Page")
        } finally {
            setLoading(false)
        }
    }

    const getApiFilterPriceRange_CategoryId_Page = async (price_min: number, price_max: number, categoryId: number, limit: number, offset: number) => {
        try {
            setLoading(true)
            setCheckRangePrice(true)

            const res = await getFilterPriceRange_CategoryId_Page(price_min, price_max, categoryId, limit, offset)
            if (res.data.length < pageSize) {
                setHasMore(false)
            }
            setResProduct(prev => {
                // Tránh nối trùng dữ liệu
                const newItems = res.data.filter(
                    (item: ResProduct) => !prev.some(p => p.id === item.id)
                );
                return [...prev, ...newItems];
            });

        } catch (error) {
            console.error("Lỗi khi gọi API getFilterPriceRange_CategoryId_Page", error)
            toast.error("Lỗi khi gọi API getFilterPriceRange_CategoryId_Page")
        } finally {
            setLoading(false)
        }
    }

    const filterRangeProduct = (priceMin: number, priceMax: number) => {
        setResProduct([]);
        if (selectCateCategoryID === -1) {
            getApiFilterPriceRange_Page(priceMin, priceMax, pageSize, 0)
        } else if (selectCateCategoryID === -2) {
            getApiFilterPriceRange_Title_Page(selectCateCategoryName!, priceMin, priceMax, pageSize, 0)
        } else {
            getApiFilterPriceRange_CategoryId_Page(priceMin, priceMax, selectCateCategoryID, pageSize, 0)
        }
    }

    const handleChangeSliderCommitted = (event: Event | React.SyntheticEvent, newValue: number | number[]) => {
        const [min, max] = newValue as number[];
        filterRangeProduct(min, max)
    }

    const handleChangeSlider = (event: Event, newValue: number | number[]) => {
        const [min, max] = newValue as number[];
        setPriceMin(min);
        setPriceMax(max);
    };

    const handleChangeInputPriceMin = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valuePriceMin = Number(e.target.value)
        if (valuePriceMin > priceMax) return
        setPriceMin(valuePriceMin || 0)
        filterRangeProduct(valuePriceMin, priceMax)
    }

    const handleChangeInputPriceMax = (e: React.ChangeEvent<HTMLInputElement>) => {
        const valuePriceMax = Number(e.target.value)
        if (valuePriceMax < priceMin) return
        setPriceMax(valuePriceMax || 0)
        filterRangeProduct(priceMin, valuePriceMax)
    }

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // tránh vòng lặp vô hạn
        e.currentTarget.src = imgs.imgDefault;//"https://placehold.co/600x400" // // ảnh mặc định (nên để trong public/images)
    };

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
                            <div>
                                <Slider
                                    value={[priceMin, priceMax]}
                                    onChange={handleChangeSlider}
                                    onChangeCommitted={handleChangeSliderCommitted}
                                    min={0}
                                    max={1000}
                                    valueLabelDisplay="auto"
                                    sx={sxSlider}
                                />
                            </div>
                            <div className="flex justify-between gap-2 items-center">
                                <TextField
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start"
                                                >
                                                    {icons.iconDollar}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={priceMin}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onChange={handleChangeInputPriceMin}
                                />
                                <p>to</p>
                                <TextField
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start"
                                                >
                                                    {icons.iconDollar}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={priceMax}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onChange={handleChangeInputPriceMax}
                                />
                            </div>
                        </div>
                    </aside>
                    <section className="flex flex-col gap-6 ">
                        <div className="flex flex-col gap-4 ">

                            <div className="items-center pb-2 border-b-[2px] border-b-gray-200 md:flex md:justify-between">
                                <div>
                                    <h3 className="text-xl text-black">PRODUCTS</h3>
                                    <p className="text-sm text-black/50">{selectCateCategoryName === "all" ? "Show " : ""} {resProduct.length} items found for {selectCateCategoryName}</p>
                                </div>
                                <div className="self-end flex gap-2 items-center">
                                    <button className={`${openSortBy ? "border-orange-700 shadow-xl" : ""} text-black flex gap-4 justify-bettwen p-2 rounded-[10px] items-center bg-white h-[40px] shadow-lg hover:border-orange-700`}
                                        onClick={handleClickSortBy}
                                    >
                                        <p className="text-black text-lg">Price:</p>
                                        <p className="w-[120px] text-start">{sortBy}</p>
                                        <span className="transtion-all duration-300 ease">{openSortBy ? icons.iconUp : icons.iconDown}</span>
                                    </button>
                                    <Menu
                                        anchorEl={anchorElSortBy}
                                        open={openSortBy}
                                        onClose={handleCloseSortBy}
                                        PaperProps={PaperProps}
                                        MenuListProps={MenuListProps}
                                    >
                                        <MenuItem
                                            onClick={handleSortDefault}
                                            sx={sxMenuItem}
                                        >Default</MenuItem>
                                        <MenuItem
                                            onClick={handleSortHigh}
                                            sx={sxMenuItem}
                                        >Highest</MenuItem>
                                        <MenuItem
                                            onClick={handleSordLow}
                                            sx={sxMenuItem}
                                        >Lowest</MenuItem>
                                        <MenuItem
                                            onClick={handleSortNewest}
                                            sx={sxMenuItem}
                                        >Newest</MenuItem>
                                    </Menu>
                                </div>

                            </div>

                            {selectCateCategoryID >= 0 &&
                                <div className="flex rounded-[10px] bg-white overflow-hidden shadow-lg">
                                    <img src={resCategoriesBy?.image} alt={resCategoriesBy?.name} className="w-[250px] "
                                        onError={handleImgError}
                                    />
                                    <div className="">
                                        <p className="text-2xl font-bold p-5">{resCategoriesBy?.name}</p>
                                        <p></p>
                                    </div>
                                </div>
                            }
                            {resProduct.length === 0 ?
                                <p className="text-center text-red-800">! No data</p>
                                :
                                <>
                                    <div className={`grid md:grid-cols-4 gap-5`}>
                                        {resProduct?.map(product => (
                                            <div key={product.id} className="bg-white relative grid rounded-[10px] overflow-hidden shadow-lg text-center transition-all duration-300 ease group pointer hover:shadow-xl "

                                            >
                                                <div className="relative self-start ">
                                                    <img src={product.images[0]} alt={product.title} className="relative transition-all duration-300 ease group-hover:scale-105 group-hover:opacity-70"
                                                        onError={handleImgError}
                                                    />
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
                                </>
                            }
                        </div>
                        <div className="text-center">
                            {hasMore ? (
                                <button
                                    onClick={handleLoadMore}
                                    disabled={loading}
                                    className="px-4 py-2 border-[1px] border-orange-700 text-orange-700 rounded-[10px] hover:bg-orange-600 hover:text-white"
                                >
                                    {loading ? "Loading..." : "Loading more"}
                                </button>
                            ) : (
                                <p className="text-gray-500 mt-2">There are no more products</p>
                            )}
                        </div>


                    </section>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default Products