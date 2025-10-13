import React, { useEffect, useState, useRef } from "react";
import { useGlobal } from '../../context/GlobalContext';
import type { Category } from "../../context/GlobalContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
    getCategories, deleteCategoriesById, putCategoriesById, postCategories,
    uploadBase64ToImgBB
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

const StyledBadge = styled(Badge)(({ theme }) => ({
    width: '150px',
    height: '150px',
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));

const CategoriesAdmin: React.FC = () => {

    const sxBox: SxProps<Theme> = {
        position: "relative",
        width: '150px',
        height: '150px',
        "&:hover .overlay": { opacity: 1 },
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-gray-100)',
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "pointer",
    }

    const sxAvata: SxProps<Theme> = { width: "100%", height: "100%" }
    const sxBoxHover: SxProps<Theme> = {
        position: "absolute",
        top: '50%',
        left: 0,
        width: "100%",
        height: "50%",
        bgcolor: "rgba(0,0,0,0.4)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "opacity 0.3s",
    }
    const sxIconButton: SxProps<Theme> = { color: "white" }

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

    const { icons,
        resCategoriesAdmin,
        setResCategoriesAdmin,
        imgs, setSelectPage, isMobile
    } = useGlobal()

    const getApiCategories = async () => {
        try {
            const res = await getCategories()
            setResCategoriesAdmin(res.data)
        } catch (error: any) {
            console.error("Lỗi khi gọi API getCategories", error)
            toast.error(error.response?.data?.message ||"Lỗi khi gọi API getCategories")
            setResCategoriesAdmin([])
        }
    }

    const [displayedCategory, setDisplayedCategory] = useState<Category[]>([]);

    useEffect(() => {
        getApiCategories()
        setSelectPage("Categories")
    }, [])

    const handleImgError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.onerror = null; // tránh vòng lặp vô hạn
        e.currentTarget.src = imgs.imgDefault;//"https://placehold.co/600x400" // // ảnh mặc định (nên để trong public/images)
    };

    const convertDateToVn = (date: string) => {
        return new Date(date).toLocaleDateString('en-US')
    }

    const [selectedRow, setSelectedRow] = useState<number | null>(null);

    const disabledCheck = false;
    const [pageSize, setPageSize] = useState<number>(10)
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalItem, setTotalItem] = useState<number>(0)

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
                getApiCategories()
            }
        } catch (error:any) {
            console.error("Lỗi khi gọi API deleteCategoriesById", error)
            toast.error(error.response?.data?.message ||"Lỗi khi gọi API deleteCategoriesById")
        }
    }

    const handleDeleteCategory = (id: number) => {
        deleteApiCategoryBy(id)

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
        } else {
            setDisplayedCategory([]);
            setTotalItem(0);
        }
    }, [resCategoriesAdmin, pageSize, currentPage]);


    const [openAddCategory, setOpenAddCategory] = useState(false);
    const handleOpenAddCategory = () => {
        setOpenAddCategory(true);
        setAvatarUrl(""),
            setName("")
    }
    const handleCloseAddCategory = () => setOpenAddCategory(false);
    const [name, setName] = useState<string>("")

    const [error, setError] = useState<string>('');
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [errorAvatar, setErrorAvatar] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setError('Please choose a representative photo');
        } else {

            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target?.result) {
                    setAvatarUrl(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClickImage = () => inputRef.current?.click();

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setErrorAvatar("")

        if (!inputRef.current?.files?.length) {
            setErrorAvatar('Please choose a representative photo');
            return;
        }

        const image = await uploadBase64ToImgBB(avatarUrl);
        try {
            const res = await postCategories({ name, image })
            if (res.data.name === name) {
                handleCloseAddCategory()
                getApiCategories()
                setAvatarUrl("")
                setName("")
            } else {
                setError("Add false")
            }
        } catch (error:any) {
            console.error('Error:', error);
            setError(error.response?.data?.message ||"Add false")
        }
    }

    const [openEditCategory, setOpenEditCategory] = useState(false);
    const [selectIdCategory, setSelectedIdCategory] = useState<number | undefined>(undefined)
    const handleOpenEditCategory = (id: number) => {
        const category = resCategoriesAdmin.find((item) => item.id === id); // ✅ tìm theo id
        setAvatarUrl(category?.image!)
        setName(category?.name!)
        setSelectedIdCategory(id)
        setOpenEditCategory(true)
    };
    const handleCloseEditCategory = () => {
        setOpenEditCategory(false)
        setSelectedIdCategory(undefined)
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setErrorAvatar("")

        if (!inputRef.current?.files?.length) {
            setErrorAvatar('Please choose a representative photo');
            return;
        }
        const image = await uploadBase64ToImgBB(avatarUrl);
        try {
            const res = await putCategoriesById(selectIdCategory!, { name, image })
            if (res.data.id === selectIdCategory) {
                handleCloseEditCategory()
                getApiCategories()
                setAvatarUrl("")
                setName("")
            } else {
                setError("Edit false")
            }
        } catch (error:any) {
            console.error('Error:', error);
            setError(error.response?.data?.message ||"Edit false")
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
                        categories
                    </div>
                    <div className="ml-auto flex gap-2">
                        <button className="h-[40px] px-4 bg-orange-700 text-white shadow-lg rounded-[10px]"
                            onClick={handleOpenAddCategory}
                        >
                            {isMobile ? icons.iconAdd : 'Add Category'}
                        </button>
                        <Modal
                            open={openAddCategory}
                            onClose={handleCloseAddCategory}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <div className="absolute top-1/2 left-1/2 flex flex-col gap-4 -translate-x-1/2 -translate-y-1/2 sm:w-[400px] w-[320px] bg-white shadow-lg rounded-[10px] p-5 ">
                                <h3 className="text-orange-700 text-3xl text-center">Add Category</h3>
                                <div className="w-full h-[2px] bg-gray-300"></div>
                                {error && (
                                    <div className="bg-orange-700/20 border-[1px] border-orange-700/50 shadow-lg items-center justify-center mb-3 text-orange-700 text-lg py-1 rounded-[5px]">
                                        {/* <span>{icons.iconError}</span> */}
                                        <p className="text-center ">
                                            {error} !
                                        </p>
                                    </div>
                                )}
                                <form className="space-y-4" onSubmit={handleSubmitAdd}>
                                    {/* Name Field */}
                                    <div className="justify-self-center mx-auto flex flex-col gap-3">
                                        <Stack direction="row" spacing={2}>
                                            <StyledBadge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                variant="dot"
                                            >
                                                <Box
                                                    sx={sxBox}
                                                    onClick={handleClickImage}
                                                >
                                                    <Avatar
                                                        src={avatarUrl}
                                                        alt="category"
                                                        sx={sxAvata}
                                                    />
                                                    <Box
                                                        className="overlay"
                                                        sx={sxBoxHover}
                                                    >
                                                        <IconButton sx={sxIconButton}>
                                                            {icons.iconCamera}
                                                        </IconButton>
                                                    </Box>
                                                    <input
                                                        alt="category"
                                                        type="file"
                                                        accept="image/*"
                                                        ref={inputRef}
                                                        name="category"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                    />
                                                </Box>
                                            </StyledBadge >
                                        </Stack>
                                        <div className="w-full pt-[10px]">
                                            <label htmlFor="avataInput" className=" transition-all duration-300 ease cursor-pointer border-[1px] border-orange-700 text-orange-700 px-7 py-2 rounded-full hover:text-orange-600 hover:border-orange-600 hover:shadow-lg">Upload categate</label>
                                            <input
                                                id="avataInput"
                                                alt="category"
                                                type="file"
                                                name="category"
                                                accept="image/*"
                                                ref={inputRef}
                                                className="hidden"
                                                onChange={handleFileChange}
                                            // required
                                            />
                                        </div>
                                    </div>
                                    {errorAvatar &&
                                        <p className="text-sm text-orange-700">
                                            {errorAvatar} !
                                        </p>
                                    }

                                    <div className="flex flex-col gap-1">
                                        <label htmlFor="name" className="block text-xl font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <TextField
                                            type="text"
                                            required
                                            autoComplete="name"
                                            placeholder="Category name"
                                            name="name"
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            {icons.iconUser}
                                                        </InputAdornment>
                                                    ),
                                                },
                                            }}
                                            value={name}
                                            variant="outlined"
                                            sx={sxTextField}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-[10px] shadow-sm text-lg font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-200"
                                        >
                                            add
                                        </button>
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
                                    <CTableHeaderCell className="w-[50px] text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200">ID</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 max-md:w-[130px]">Name</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[70px]">Image</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[110px]">Creation At</CTableHeaderCell>
                                    <CTableHeaderCell className="text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200 w-[110px]">Update At</CTableHeaderCell>
                                    <CTableHeaderCell className="w-[100px] text-center bg-orange-200 p-3 text-orange-700 border-[1px] border-gray-200">Action</CTableHeaderCell>
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
                                    >
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200'>{row.id}</CTableDataCell>
                                        <CTableDataCell className='text-center p-3 border-[1px] border-gray-200 break-all'>{row.name}
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
                                                    handleOpenEditCategory(row.id)

                                                }}
                                                    className="px-2 py-2 bg-blue-500 text-white shadow-lg transition-all duration-300 ease rounded-[5px] hover:bg-blue-600 hover:shadow-xl"
                                                >
                                                    {icons.iconEdit}
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
                    </div>
                </div>
                <Modal
                    open={openEditCategory}
                    onClose={handleCloseEditCategory}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <div className="absolute top-1/2 left-1/2 flex flex-col gap-4 -translate-x-1/2 -translate-y-1/2 sm:w-[400px] w-[320px] bg-white shadow-lg rounded-[10px] p-5 ">
                        <h3 className="text-orange-700 text-3xl text-center">Edit Category</h3>
                        <div className="w-full h-[2px] bg-gray-300"></div>
                        {error && (
                            <div className="bg-orange-700/20 border-[1px] border-orange-700/50 shadow-lg items-center justify-center mb-3 text-orange-700 text-lg py-1 rounded-[5px]">
                                {/* <span>{icons.iconError}</span> */}
                                <p className="text-center ">
                                    {error} !
                                </p>
                            </div>
                        )}
                        <form className="space-y-4" onSubmit={handleSubmitEdit}>
                            {/* Name Field */}
                            <div className="justify-self-center mx-auto flex flex-col gap-3">
                                <Stack direction="row" spacing={2}>
                                    <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                    >
                                        <Box
                                            sx={sxBox}
                                            onClick={handleClickImage}
                                        >
                                            <Avatar
                                                src={avatarUrl}
                                                alt="category"
                                                sx={sxAvata}
                                            />
                                            <Box
                                                className="overlay"
                                                sx={sxBoxHover}
                                            >
                                                <IconButton sx={sxIconButton}>
                                                    {icons.iconCamera}
                                                </IconButton>
                                            </Box>
                                            <input
                                                alt="category"
                                                type="file"
                                                accept="image/*"
                                                ref={inputRef}
                                                name="category"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </Box>
                                    </StyledBadge >
                                </Stack>
                                <div className="w-full pt-[10px]">
                                    <label htmlFor="avataInput" className=" transition-all duration-300 ease cursor-pointer border-[1px] border-orange-700 text-orange-700 px-7 py-2 rounded-full hover:text-orange-600 hover:border-orange-600 hover:shadow-lg">Upload categate</label>
                                    <input
                                        id="avataInput"
                                        alt="category"
                                        type="file"
                                        name="category"
                                        accept="image/*"
                                        ref={inputRef}
                                        className="hidden"
                                        onChange={handleFileChange}
                                    // required
                                    />
                                </div>
                            </div>
                            {errorAvatar &&
                                <p className="text-sm text-orange-700">
                                    {errorAvatar} !
                                </p>
                            }

                            <div className="flex flex-col gap-1">
                                <label htmlFor="name" className="block text-xl font-medium text-gray-700">
                                    Name Category
                                </label>
                                <TextField
                                    type="text"
                                    required
                                    autoComplete="name"
                                    placeholder="Name Category"
                                    name="name"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {icons.iconUser}
                                                </InputAdornment>
                                            ),
                                        },
                                    }}
                                    value={name}
                                    variant="outlined"
                                    sx={sxTextField}
                                    onChange={(e) => setName(e.target.value)}
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
                        </form>
                    </div>
                </Modal>
                <div className="flex justify-between items-center max-sm:grid gap-2 max-sm:justify-center">
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
                            className="h-[40px] p-2 md:px-4 bg-orange-700 text-white rounded-[10px] shadow-lg disabled:opacity-50"
                            disabled={currentPage === 1 || disabledCheck}
                        >
                            {isMobile ? icons.iconPrev : 'Previous'}
                        </button>

                        <span className="text-page font-medium">
                            {currentPage}/{totalPages}
                        </span>

                        <button
                            onClick={handleNextPage}
                            className="h-[40px] p-2 md:px-4 bg-orange-700 text-white rounded-[10px] shadow-lg disabled:opacity-50"
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

export default CategoriesAdmin