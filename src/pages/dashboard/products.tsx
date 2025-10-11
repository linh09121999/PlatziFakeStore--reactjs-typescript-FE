import React, { useEffect, useState } from "react";
import { useGlobal } from '../../context/GlobalContext';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


import {
    getProductsPage, postProducts, putProductById,
    uploadBase64ToImgBB, getProducts,
    deltetProductById, getCategories
} from "../../services/userService"
import type { SxProps, Theme } from "@mui/material/styles";

import {
    Modal,
    InputAdornment,
    MenuItem, Select, TextField, type SelectChangeEvent
} from '@mui/material';


import {
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';
import { ToastContainer, toast } from 'react-toastify';

const ProductsAdmin: React.FC = () => {
    const sxSelectTB: SxProps<Theme> = {
        borderRadius: "10px",
        height: '40px',
        '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgb(210, 134, 26, 0.5) !important',
            boxShadow: "0 0 0 0.25rem rgb(210, 134, 26, 0.2)"
        },
    }

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            },
            sx: {
                maxWidth: 'calc(50% - 32px)',
                '& .MuiMenuItem-root': {
                    whiteSpace: 'normal',
                    wordBreak: 'wordBreak',
                    minHeight: '30px',
                },
                '& .MuiMenuItem-root:hover': {
                    backgroundColor: 'rgb(210, 134, 26, 0.1)'
                }
            }
        },
    };

    const sxTextField: SxProps<Theme> = {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            borderRadius: "10px",
            background: "var(--color-white)",
            height: '40px',
            // boxShadow: 'var(--shadow-lg)',
            padding: '3px 8px',
            transition: 'all 0.3s',
            fontSize: 'var(--text-xl)',
            border: '1px solid var(--color-gray-200)',
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

    const sxTextFieldMulti: SxProps<Theme> = {
        width: '100%',
        '& .MuiOutlinedInput-root': {
            borderRadius: "10px",
            background: "var(--color-white)",
            minHeight: '40px',
            // boxShadow: 'var(--shadow-lg)',
            padding: '3px 8px',
            transition: 'all 0.3s',
            fontSize: 'var(--text-xl)',
            border: '1px solid var(--color-gray-200)',
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

    const { icons, setResProductAdmin,
        resProductAdmin,
        imgs, setSelectPage, setResCategoriesAdmin, resCategoriesAdmin,
        isMobile
    } = useGlobal()

    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItem, setTotalItem] = useState<number>(0)
    const [startItem, setStartItem] = useState<number>(0)
    const disabledCheck = false


    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const getApiProductPage = async (offset: number, limit: number) => {
        try {
            const res = await getProductsPage(offset, limit)
            setResProductAdmin(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getProductsPage", error)
            toast.error("Lỗi khi gọi API getProductsPage")
        }
    }

    const getApiCategories = async () => {
        try {
            const res = await getCategories()
            setResCategoriesAdmin(res.data)
        } catch (error) {
            console.error("Lỗi khi gọi API getCategories", error)
            toast.error("Lỗi khi gọi API getCategories")
            setResCategoriesAdmin([])
        }
    }

    useEffect(() => {
        getApiProductPage(0, pageSize);
        setCurrentPage(1)
        setSelectPage("Products")
        getApiCategories()
    }, [])


    const handleNextPage = () => {
        let prevPage = 1
        if (currentPage < totalPages) {
            prevPage = currentPage + 1;
            setCurrentPage(prevPage)
        }
        const offetNew = (prevPage - 1) * pageSize + 1
        setStartItem(offetNew)
        getApiProductPage(offetNew, pageSize);
    }

    const handlePreviousPage = () => {
        let prevPage = 1
        if (currentPage > 1) {
            prevPage = currentPage - 1;
            setCurrentPage(prevPage)

        }
        const offetNew = (prevPage - 1) * pageSize + 1
        setStartItem(offetNew)
        getApiProductPage(offetNew, pageSize);
    }

    const deleteApiProductBy = async (id: number) => {
        try {
            const res = await deltetProductById(id)
            if (res.data === true) {
                toast.success("Delete success")
                getApiProductPage(startItem, pageSize);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API deltetProductById", error)
            toast.error("Lỗi khi gọi API deltetProductById")
        }
    }

    const handleDeleteProduct = (id: number) => {
        deleteApiProductBy(id)
    }

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // tránh vòng lặp vô hạn
        e.currentTarget.src = imgs.imgDefault;//"https://placehold.co/600x400" // // ảnh mặc định (nên để trong public/images)
    };

    const convertDateToVn = (date: string) => {
        return new Date(date).toLocaleDateString('en-US')
    }

    const handleChangePageSize = (e: SelectChangeEvent<number>) => {
        setResProductAdmin([])
        setPageSize(e.target.value)
        setCurrentPage(1);
        getApiProductPage(0, e.target.value);
    }

    const getApiAllProduct = async () => {
        try {
            const res = await getProducts()
            if (res.data.length > 0) {
                setTotalItem(res.data.length)
                const pages = Math.ceil(res.data.length / pageSize);
                setTotalPages(pages);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API getProducts", error)
            toast.error("Lỗi khi gọi API getProducts")
        }
    }

    useEffect(() => {
        getApiAllProduct()
    }, [])

    const handleExport = async () => {
        try {
            const res = await getProducts()
            if (res.data.length > 0) {
                const ws = XLSX.utils.json_to_sheet(res.data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Products");

                const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

                const file = new Blob([excelBuffer], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });
                saveAs(file, `resProduct_${new Date().toISOString().slice(0, 10)}.xlsx`)
            }
            else {
                toast.error("There is no data to export to Excel!");
                return;
            }
        } catch (error) {
            console.error("Lỗi khi gọi API getProducts", error)
            toast.error("Lỗi khi gọi API getProducts")
        }
    }

    const [title, setTitle] = useState<string>("")
    const [price, setSpice] = useState<number>(0)
    const [description, setDescription] = useState<string>("")
    const [selectCateCategoryID, setSelectCateCategoryID] = useState<number>(0)
    const [listImages, setListImages] = useState<string[]>([])

    const [openAddProduct, setOpenAddProduct] = useState(false);
    const handleOpenAddProduct = () => {
        setOpenAddProduct(true)
        setTitle("")
        setSpice(0)
        setDescription("")
        setSelectCateCategoryID(0)
        setListImages([])
    };

    const handleCloseAddProduct = () => setOpenAddProduct(false);

    const handleSelectCate = (e: SelectChangeEvent<number>) => {
        setSelectCateCategoryID(Number(e.target.value))
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files || files.length === 0) {
            setErrorImage("Please choose at least one image");
            return;
        }

        setErrorImage(""); // clear error
        const readers: Promise<string>[] = [];

        Array.from(files).forEach((file) => {
            readers.push(
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (e: ProgressEvent<FileReader>) => {
                        if (e.target?.result) {
                            resolve(e.target.result as string);
                        } else {
                            reject("Failed to read file");
                        }
                    };
                    reader.readAsDataURL(file);
                })
            );
        });

        Promise.all(readers)
            .then((results) => setListImages(results))
            .catch(() => setError("Error reading one or more files"));
    };


    const [error, setError] = useState<string>('');
    const [errorImage, setErrorImage] = useState<string>('');

    const uploadMultipleBase64ToImgBB = async (
        base64List: string[]
    ): Promise<string[]> => {
        try {
            const uploadPromises = base64List.map((base64) => uploadBase64ToImgBB(base64));
            const urls = await Promise.all(uploadPromises);
            return urls; // trả về danh sách URL ảnh
        } catch (error) {
            console.error("Upload multiple images failed:", error);
            throw error;
        }
    };

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setErrorImage("");
        if (!listImages.length) {
            setErrorImage('Please choose a representative photo');
            return;
        }

        const images = await uploadMultipleBase64ToImgBB(listImages);
        const categoryId = selectCateCategoryID

        try {
            const res = await postProducts({ title, price, description, categoryId, images })
            if (res.data.title === title) {
                handleCloseAddProduct()
                getApiProductPage(0, pageSize)
                setTitle("")
                setSpice(0)
                setDescription("")
                setSelectCateCategoryID(0)
                setListImages([])
            } else {
                setError("Add false")
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Add false")
        }

    }

    const [openEditProduct, setOpenEditProduct] = useState(false);
    const [selectIdProduct, setSelectedIdProduct] = useState<number | undefined>(undefined)
    const handleOpenEditProduct = (id: number) => {
        const product = resProductAdmin.find((item) => item.id === id); // ✅ tìm theo id
        setTitle(product?.title!)
        setSpice(product?.price!)
        setSelectedIdProduct(id)
        setOpenEditProduct(true)
    };
    const handleCloseEditProduct = () => {
        setOpenEditProduct(false)
        setSelectedIdProduct(undefined)
    };
    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await putProductById(selectIdProduct!, { title, price })
            if (res.data.id === selectIdProduct) {
                handleCloseEditProduct()
                getProductsPage(0, pageSize)
            } else {
                setError("Edit false")
            }
        } catch (error) {
            console.error('Error:', error);
            setError("Edit false")
        }
    }

    return (
        <>
            <main className="min-h-[77.5vh] p-5 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">Show
                        <Select value={pageSize} onChange={handleChangePageSize}
                            className=' w-full'
                            sx={sxSelectTB}
                            MenuProps={MenuProps}>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={15}>15</MenuItem>
                            <MenuItem value={20}>20</MenuItem>
                        </Select>
                        products
                    </div>
                    <div className="ml-auto flex gap-2">
                        <button className="h-[40px] px-4 bg-orange-700 text-white shadow-lg rounded-[10px]"
                            onClick={handleOpenAddProduct}
                        >
                            {isMobile ? icons.iconAdd : 'Add Product'}
                        </button>
                        <Modal
                            open={openAddProduct}
                            onClose={handleCloseAddProduct}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div className="absolute top-1/2 left-1/2 flex flex-col gap-4 -translate-x-1/2 -translate-y-1/2 sm:w-[400px] w-[320px] bg-white shadow-lg rounded-[10px] p-5 ">
                                <h3 className="text-orange-700 text-3xl text-center">Add Product</h3>
                                <div className="w-full h-[2px] bg-gray-300"></div>
                                {error && (
                                    <div className="bg-orange-700/20 border-[1px] border-orange-700/50 shadow-lg items-center mb-3 text-orange-700 text-lg py-1 rounded-[5px]">
                                        {/* <span>{icons.iconError}</span> */}
                                        <p className="text-center ">
                                            {error} !
                                        </p>
                                    </div>
                                )}
                                <form className="space-y-4" onSubmit={handleSubmitAdd}>
                                    <div className=" flex flex-col gap-3">
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="title" className="block text-xl font-medium text-gray-700">
                                                Title
                                            </label>
                                            <TextField
                                                type="text"
                                                required
                                                autoComplete="title"
                                                placeholder="title"
                                                name="title"
                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                {icons.iconTag}
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                                value={title}
                                                variant="outlined"
                                                sx={sxTextField}
                                                onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="price" className="block text-xl font-medium text-gray-700">
                                                Price
                                            </label>
                                            <TextField
                                                type="number"
                                                required
                                                autoComplete="price"
                                                placeholder="Price"
                                                name="price"
                                                slotProps={{
                                                    input: {
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                {icons.iconDollar}
                                                            </InputAdornment>
                                                        ),
                                                    },
                                                }}
                                                value={price}
                                                variant="outlined"
                                                sx={sxTextField}
                                                onChange={(e) => setSpice(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="description" className="block text-xl font-medium text-gray-700">
                                                Description
                                            </label>
                                            <TextField
                                                type="text"
                                                required
                                                autoComplete="description"
                                                placeholder="Description"
                                                name="description"
                                                value={description}
                                                variant="outlined"
                                                sx={sxTextFieldMulti}
                                                multiline
                                                minRows={2}
                                                maxRows={Infinity}
                                                onChange={(e) => setDescription(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="category" className="block text-xl font-medium text-gray-700">
                                                Categpry
                                            </label>
                                            <Select
                                                onChange={handleSelectCate}
                                                sx={sxSelectTB}
                                                MenuProps={MenuProps}
                                                value={selectCateCategoryID}
                                            >
                                                {resCategoriesAdmin.map(cate => (
                                                    <MenuItem key={cate.id} value={cate.id.toString()}>
                                                        {cate.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label htmlFor="image" className="block text-xl font-medium text-gray-700">
                                                Image
                                            </label>
                                            <div className="flex items-center w-full relative">
                                                <label htmlFor="product_file" className="div-upload-file h-[40px] flex gap-4 items-center justify-center border-[1px] rounded-[10px] border-dashed border-orange-700 cursor-pointer w-full" >
                                                    <svg className="w-8 h-8 text-orange-700" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                                    </svg>
                                                    <span className="text-orange-700">Upload file </span>
                                                    <input
                                                        id="product_file"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                    />
                                                </label>
                                            </div>

                                            {errorImage && <p style={{ color: "red" }}>{errorImage}</p>}

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: 10,
                                                    marginTop: 20,
                                                }}
                                            >
                                                {listImages.map((url, index) => (
                                                    <img
                                                        key={index}
                                                        src={url}
                                                        alt={`preview-${index}`}
                                                        style={{
                                                            width: 120,
                                                            height: 120,
                                                            objectFit: "cover",
                                                            borderRadius: 8,
                                                            border: "1px solid #ddd",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-[10px] shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Modal>
                        <button
                            onClick={handleExport}
                            className="h-[40px] px-4 text-orange-700 border-[1px] shadow-lg border-orange-700 rounded-[10px]">
                            {isMobile ? icons.iconExcel : 'Export'}
                        </button>
                    </div>

                </div>
                <div className="grid">
                    <div className="w-full overflow-x-auto scroll-x">
                        <CTable bordered hover align="middle" responsive className="w-full border border-gray-300 " style={{ tableLayout: 'fixed' }}>
                            <CTableHead color="light">
                                <CTableRow>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[50px]">ID</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[180px] max-lg:w-[120px]">Title</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[70px]">Price</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 max-xl:w-[200px]">Description</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[110px]">Category</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[70px]">Image</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[110px]">Creation At</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[110px]">Update At</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[100px] max-lg:w-[70px]">Action</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                {resProductAdmin.map((row, index) => (
                                    <CTableRow className="table-body-row-mucluc" key={row.id || index}
                                        onClick={() => {
                                            setSelectedRow(index);
                                        }} onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault(); // Ngăn xuống dòng nếu cần
                                                setSelectedRow(null); // Thoát khỏi select
                                            }
                                        }}
                                        style={{
                                            border: index === selectedRow ? '2px dashed rgb(92, 0, 0)' : '',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{row.id}</CTableDataCell>
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{row.title}</CTableDataCell>
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>
                                            <span className="text-orange-700  font-bold border-[1px] border-orange-700/20 p-1 bg-orange-700/10 rounded-full">$ {row.price}</span>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200 text-justify'>{row.description}</CTableDataCell>
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200 break-all'>{row.category.name}</CTableDataCell>
                                        <CTableDataCell className='p-3 border-[1px] border-gray-200 w-fit'>
                                            <div className="grid gap-2 justify-center w-fit">
                                                {row.images.map((image, id) => (
                                                    <img key={id} src={image} onError={handleImgError} className="w-12 h-12 object-cover rounded" alt={`category ${row.id}`} />
                                                ))}
                                            </div>
                                        </CTableDataCell>
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{convertDateToVn(row.creationAt)}</CTableDataCell>
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'> {convertDateToVn(row.updatedAt)}
                                        </CTableDataCell>

                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>
                                            <div className=" flex justify-center max-lg:grid gap-2 p-2">
                                                <button
                                                    onClick={() => {
                                                        handleOpenEditProduct(row.id)
                                                    }}
                                                    className="px-2 py-2 bg-blue-500 text-white shadow-lg transition-all duration-300 ease rounded-[5px] hover:bg-blue-600 hover:shadow-xl"
                                                >
                                                    {icons.iconEdit}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDeleteProduct(row.id)
                                                    }}
                                                    className="px-2 py-2 bg-red-500 text-white shadow-lg transition-all duration-300 ease rounded-[5px] hover:bg-red-600 hover:shadow-xl"
                                                >
                                                    {icons.iconDelete}
                                                </button>
                                            </div>
                                        </CTableDataCell>
                                    </CTableRow>
                                ))}
                            </CTableBody>
                        </CTable>
                    </div>
                    <Modal
                        open={openEditProduct}
                        onClose={handleCloseEditProduct}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <div className="absolute top-1/2 left-1/2 flex flex-col gap-4 -translate-x-1/2 -translate-y-1/2 sm:w-[400px] w-[320px] bg-white shadow-lg rounded-[10px] p-5 ">
                            <h3 className="text-orange-700 text-3xl text-center">Edit Product</h3>
                            <div className="w-full h-[2px] bg-gray-300"></div>
                            {error && (
                                <div className="bg-orange-700/20 border-[1px] border-orange-700/50 shadow-lg items-center mb-3 text-orange-700 text-lg py-1 rounded-[5px]">
                                    {/* <span>{icons.iconError}</span> */}
                                    <p className="text-center ">
                                        {error} !
                                    </p>
                                </div>
                            )}
                            <form className="space-y-4" onSubmit={handleSubmitEdit}>
                                <div className=" flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="title" className="block text-xl font-medium text-gray-700">
                                            Title
                                        </label>
                                        <TextField
                                            type="text"
                                            required
                                            autoComplete="title"
                                            placeholder="title"
                                            name="title"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            {icons.iconTag}
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            value={title}
                                            variant="outlined"
                                            sx={sxTextField}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="price" className="block text-xl font-medium text-gray-700">
                                            Price
                                        </label>
                                        <TextField
                                            type="number"
                                            required
                                            autoComplete="price"
                                            placeholder="Price"
                                            name="price"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            {icons.iconDollar}
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            value={price}
                                            variant="outlined"
                                            sx={sxTextField}
                                            onChange={(e) => setSpice(Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-[10px] shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal>
                </div>
                <div className="flex justify-between max-sm:grid gap-2 max-sm:justify-center items-center">
                    <div className='items-center'>
                        {totalItem === 0 && (<p>No items displayed</p>)}
                        {totalItem > pageSize * currentPage && (
                            <p>Showing {(currentPage - 1) * pageSize + 1} to {currentPage * pageSize} of {totalItem} categories</p>
                        )}
                        {(totalItem <= pageSize * currentPage && totalItem > 0) && (
                            <p>Showing {(currentPage - 1) * pageSize + 1} to {totalItem} of {totalItem} categories</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 max-sm:justify-center">
                        <button
                            onClick={handlePreviousPage}
                            className="h-[40px] px-2 md:p-4 bg-orange-700 text-white rounded-[10px] shadow-lg disabled:opacity-50"
                            disabled={currentPage === 1 || disabledCheck}
                        >
                            {isMobile ? icons.iconPrev : 'Previous'}
                        </button>

                        <span className="text-page font-medium">
                            {currentPage}/{totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            className="h-[40px] px-2 md:p-4 bg-orange-700 text-white rounded-[10px] shadow-lg disabled:opacity-50"
                            disabled={currentPage === totalPages || disabledCheck}
                        >
                            {isMobile ? icons.iconNext : 'Next'}
                        </button>
                    </div>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default ProductsAdmin