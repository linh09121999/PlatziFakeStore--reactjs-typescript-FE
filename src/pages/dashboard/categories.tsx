import React, { useEffect, useState, useRef } from "react";
import { useGlobal } from '../../context/GlobalContext';
import type { Category } from "../../context/GlobalContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
    getCategories, deleteCategoriesById, putCategoriesById, postCategories
} from "../../services/userService"
import type { SxProps, Theme } from "@mui/material/styles";

import {
    InputLabel, MenuItem, FormControl, Select, OutlinedInput, Radio, RadioGroup, FormControlLabel, FormLabel,
    Box, TextField, ListItemText, Checkbox, FormHelperText, type SelectChangeEvent
} from '@mui/material';
import {
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

const CategoriesAdmin: React.FC = () => {
    const sxFormControlTB: SxProps<Theme> = {
        minWidth: 70,
        margin: '0px !important',
        '& .MuiFormControl-root': {
            margin: '0px !important',
        }
    }

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

    const navigate = useNavigate()

    const { icons,
        resCategoriesAdmin,
        setResCategoriesAdmin,
        imgs
    } = useGlobal()

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

    const [displayedCategory, setDisplayedCategory] = useState<Category[]>([]);

    useEffect(() => {
        getApiCategories()
    }, [])

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // tránh vòng lặp vô hạn
        e.currentTarget.src = imgs.imgDefault;//"https://placehold.co/600x400" // // ảnh mặc định (nên để trong public/images)
    };

    const convertDateToVn = (date: string) => {
        return new Date(date).toLocaleDateString('en-US')
    }

    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const wrapperRef = useRef(null);

    const [disabledCheck, setDisabledCheck] = useState<boolean>(false);
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItem, setTotalItem] = useState<number>(0)
    const [startItem, setStartItem] = useState<number>(0)
    const [endItem, setEndItem] = useState<number>(0)

    const handleChangePageSize = (e: SelectChangeEvent<number>) => {
        setPageSize(e.target.value)
        setCurrentPage(1);
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };


    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    const deleteApiCategoryBy = async (id: number) => {
        try {
            const res = await deleteCategoriesById(id)
            if (res.data === true) {
                toast.success("Delete success")
            }
        } catch (error) {
            console.error("Lỗi khi gọi API deleteCategoriesById", error)
            toast.error("Lỗi khi gọi API deleteCategoriesById")
        }
    }

    const handleEditCategory = (id: number) => {

    }

    const handleDeleteCategory = (id: number) => {
        deleteApiCategoryBy(id)
        getApiCategories()
    }

    const handleExport = () => {
        if (!resCategoriesAdmin || resCategoriesAdmin.length === 0) {
            toast.error("There is no data to export to Excel!");
            return;
        }

        const ws = XLSX.utils.json_to_sheet(resCategoriesAdmin);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Categories");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });

        const file = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(file, `resCategory_${new Date().toISOString().slice(0, 10)}.xlsx`);
    }

    useEffect(() => {
        if (resCategoriesAdmin && resCategoriesAdmin.length > 0) {
            const total = resCategoriesAdmin.length;
            setTotalItem(total);
            const pages = Math.ceil(total / pageSize);
            setTotalPages(pages);

            // Xác định index bắt đầu / kết thúc
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = Math.min(startIndex + pageSize, total);

            // Cắt dữ liệu hiển thị
            const sliced = resCategoriesAdmin.slice(startIndex, endIndex);
            setDisplayedCategory(sliced);

            setStartItem(startIndex + 1);
            setEndItem(endIndex);
        } else {
            setDisplayedCategory([]);
            setTotalItem(0);
        }
    }, [resCategoriesAdmin, pageSize, currentPage]);

    return (
        <>
            <main className="min-h-[77.5vh] p-5 flex flex-col">
                <div className="flex flex-col gap-5">
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
                            categories
                        </div>
                        <div className="ml-auto flex gap-2">
                            <button className="h-[40px] px-4 bg-orange-700 text-white shadow-lg rounded-[10px]"
                            >
                                Add Category
                            </button>
                            <button
                                onClick={handleExport}
                                className="h-[40px] px-4 text-orange-700 border-[1px] shadow-lg border-orange-700 rounded-[10px]">
                                Export
                            </button>
                        </div>
                    </div>
                    <CTable bordered hover align="middle" responsive className="w-full border border-gray-300 " style={{ tableLayout: 'fixed' }}>
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200">ID</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200">Name</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200">Image</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200">Creation At</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200">Update At</CTableHeaderCell>
                                <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200">Action</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {displayedCategory.map((row, index) => (
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
                                    ref={selectedRow === index ? wrapperRef : null}
                                >
                                    <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{row.id}</CTableDataCell>
                                    <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{row.name}
                                    </CTableDataCell>
                                    <CTableDataCell className='p-3 border-[1px] border-gray-200'>
                                        <img src={row.image} onError={handleImgError} className="w-12 h-12 object-cover rounded mx-auto" alt={`category ${row.id}`} />
                                    </CTableDataCell>
                                    <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{convertDateToVn(row.creationAt)}</CTableDataCell>
                                    <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'> {convertDateToVn(row.updatedAt)}
                                    </CTableDataCell>

                                    <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>
                                        <div className=" flex justify-center gap-2 p-2">
                                            <button onClick={() => {
                                                handleEditCategory(row.id)
                                            }}
                                                className="px-2 py-2 bg-blue-500 text-white shadow-lg transition-all duration-300 ease rounded-[5px] hover:bg-blue-600 hover:shadow-xl"
                                            >
                                                {icons.iconEditUser}
                                            </button>
                                            <button onClick={() => {
                                                handleDeleteCategory(row.id)
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
                                Trang trước
                            </button>

                            <span className="text-page font-medium">
                                {currentPage}/{totalPages}
                            </span>

                            <button
                                onClick={handleNextPage}
                                className="h-[40px] px-4 bg-orange-700 text-white rounded-[10px] shadow-lg disabled:opacity-50"
                                disabled={currentPage === totalPages || disabledCheck}
                            >
                                Trang sau
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    )
}

export default CategoriesAdmin