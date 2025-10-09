import React, { useEffect, useState, useRef } from "react";
import { useGlobal } from '../../context/GlobalContext';
import type { ResProduct } from "../../context/GlobalContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


import {
    getProductsPage, postProducts, putProductById,
    uploadBase64ToImgBB, getProducts,
    deltetProductById
} from "../../services/userService"
import type { SxProps, Theme } from "@mui/material/styles";

import {
    Modal,
    InputAdornment,
    Avatar,
    IconButton, Stack, Badge, styled,
    MenuItem, Select,
    Box, TextField, type SelectChangeEvent
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

    const { icons, setResProductAdmin,
        resProductAdmin,
        imgs
    } = useGlobal()

    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItem, setTotalItem] = useState<number>(0)
    const [startItem, setStartItem] = useState<number>(0)
    const [endItem, setEndItem] = useState<number>(0)
    const [disabledCheck, setDisabledCheck] = useState<boolean>(false);


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

    useEffect(() => {
        getApiProductPage(0, pageSize);
        setCurrentPage(1)
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
            console.error("Lỗi khi gọi API deleteCategoriesById", error)
            toast.error("Lỗi khi gọi API deleteCategoriesById")
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
            console.error("Lỗi khi gọi API deleteCategoriesById", error)
            toast.error("Lỗi khi gọi API deleteCategoriesById")
        }
    }

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
    }
    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
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

                        >
                            Add Product
                        </button>
                        <button
                            onClick={handleExport}
                            className="h-[40px] px-4 text-orange-700 border-[1px] shadow-lg border-orange-700 rounded-[10px]">
                            Export
                        </button>
                    </div>

                </div>
                <div className="flex flex-col gap-5">
                    <CTable bordered hover align="middle" responsive className="w-full border border-gray-300 " style={{ tableLayout: 'fixed' }}>
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[50px]">ID</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[180px]">Title</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[70px]">Price</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 min-w-[120px]">Description</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[120px]">Category</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[70px]">Image</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[100px]">Creation At</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[100px]">Update At</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[100px]">Action</CTableHeaderCell>
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
                                    <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>$ {row.price}</CTableDataCell>
                                    <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{row.description}</CTableDataCell>
                                    <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{row.category.name}</CTableDataCell>
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
                                        <div className=" flex justify-center gap-2 p-2">
                                            <button
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
                <div className="flex justify-between items-center">
                    <div className='items-center'>
                        {totalItem === 0 && (<p>No items displayed</p>)}
                        {totalItem > pageSize * currentPage && (
                            <p>Showing {(currentPage - 1) * pageSize + 1} to {currentPage * pageSize} of {totalItem} categories</p>
                        )}
                        {(totalItem <= pageSize * currentPage && totalItem > 0) && (
                            <p>Showing {(currentPage - 1) * pageSize + 1} to {totalItem} of {totalItem} categories</p>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handlePreviousPage}
                            className="h-[40px] px-4 bg-orange-700 text-white rounded-[10px] shadow-lg disabled:opacity-50"
                            disabled={currentPage === 1 || disabledCheck}
                        >
                            Previous
                        </button>

                        <span className="text-page font-medium">
                            {currentPage}/{totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            className="h-[40px] px-4 bg-orange-700 text-white rounded-[10px] shadow-lg disabled:opacity-50"
                            disabled={currentPage === totalPages || disabledCheck}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default ProductsAdmin