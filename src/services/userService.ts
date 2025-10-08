import api from "./api";
import axios from "axios";

export const getUsers = () => api.get("/api/v1/users");
export const postUsers = (data: { name: string, email: string, password: string, avatar: string }) => {
    return api.post("/api/v1/users", data)
};
export const getUserById = (id: number) => api.get(`/api/v1/users/${id}`)
export const putUserById = (id: number, data: { email: string, name: string }) => {
    return api.put(`/api/v1/users/${id}`, data)
};
export const deleteUserById = (id: number) => api.delete(`/api/v1/users/${id}`)
export const postCheckMailAvailable = (data: { email: string }) => {
    return api.post("/api/v1/users/is-available", data)
};

export const postLogin = (data: { email: string; password: string }) => {
    return api.post(`/api/v1/auth/login`, data);
};
export const getProfile = () => api.get(`/api/v1/auth/profile`)
export const postRefreshToken = (data: { refreshToken: string }) => {
    return api.post(`/api/v1/auth/refresh-token`, data)
}

export const getProducts = () => api.get(`/api/v1/products`) // lấy tất cả sp
export const getProductsById = (id: number) => api.get(`/api/v1/products/${id}`) // lấy 1 sp theo id
export const getProductsBySlug = (slug: string) => api.get(`/api/v1/products/slug/${slug}`) //  lấy sp theo slug
export const postProducts = (data: { title: string, price: number, description: string, categoryId: string, images: string[] }) => {
    return api.post(`/api/v1/products`, data)
} //thêm sp
export const putProductById = (id: number, data: { title: string, price: number }) => {
    return api.put(`/api/v1/products/${id}`, data)
} //sửa sp
export const deltetProductById = (id: number) => api.delete(`/api/v1/products/${id}`) //xoa 
export const getProductsPage = (offset: number, limit: number) => api.get(`/api/v1/products?offset=${offset}&limit=${limit}`) //vd 0-10, 11-20(0,11: offset)
export const getProductsRelatedById = (id: number) => api.get(`/api/v1/products/${id}/related`) //lấy các sản phẩm liên quan với sp có id...
export const getProductsRelatedBySlug = (slug: string) => api.get(`/api/v1/products/${slug}/related`) //lấy các sản phẩm liên quan với sp có slug...

export const getProductsByCategories_Id = (id: number) => api.get(`/api/v1/categories/${id}/products`)

export const getFilterProductByTitle = (title: string) => api.get(`/api/v1/products/?title=${title}`) //tìm kiến theo title
export const getFilterProductByTitle_Page = (title: string, offset: number, limit: number) => api.get(`/api/v1/products/?title=${title}&offset=${offset}&limit=${limit}`)
export const getFilterProductByPrice = (price: number) => api.get(`/api/v1/products/?price=${price}`) //tìm kiến theo price
export const getFilterProductByPriceRange = (price_min: number, price_max: number) => api.get(`/api/v1/products/?price_min=${price_min}&price_max=${price_max}`) //tìm kiếm theo khoản giá
export const getFilterProductByCategoryId = (categoryId: number) => api.get(`/api/v1/products/?categoryId=${categoryId}`) //tìm kiến theo categoryId
export const getFilterProductByCategoryId_Page = (categoryId: number, offset: number, limit: number) => api.get(`/api/v1/products/?categoryId=${categoryId}&offset=${offset}&limit=${limit}`)
export const getFilterProductByCategorySlug = (categorySlug: string) => api.get(`/api/v1/products/?categorySlug=${categorySlug}`) //tìm kiến theo categorySlug
export const getFillterProductTitle_PriceRange_CategoryId = (title: string, price_min: number, price_max: number, categoryId: number) => api.get(`/api/v1/products/?title=${title}&price_min=${price_min}&price_max=${price_max}&categoryId=${categoryId}`)
export const getFilterPriceRange_CategoryId_Page = (price_min: number, price_max: number, categoryId: number, limit: number, offset: number) => api.get(`/api/v1/products/?price_min=${price_min}&price_max=${price_max}&categoryId=${categoryId}&limit=${limit}&offset=${offset}`)
export const getFilterPriceRange_Page = (price_min: number, price_max: number, limit: number, offset: number) => api.get(`/api/v1/products/?price_min=${price_min}&price_max=${price_max}&limit=${limit}&offset=${offset}`)
export const getFilterPriceRange_CategoryId = (price_min: number, price_max: number, categoryId: number) => api.get(`/api/v1/products/?price_min=${price_min}&price_max=${price_max}&categoryId=${categoryId}`)
export const getFilterPriceRange_Title_Page = (title: string, price_min: number, price_max: number, limit: number, offset: number) => api.get(`/api/v1/products/?title=${title}&price_min=${price_min}&price_max=${price_max}&limit=${limit}&offset=${offset}`)

export const getCategories = () => api.get(`/api/v1/categories`) //list chu de
export const getCategoriesById = (id: number) => api.get(`/api/v1/categories/${id}`) //1 chu de theo id
export const getCategoriesBySlug = (slug: string) => api.get(`/api/v1/categories/slug/${slug}`) //1 chu de theo slug
export const postCategories = (data: { name: string, image: string }) => {
    return api.post(`/api/v1/categories`, data)
} //add 
export const putCategoriesById = (id: number, data: { name: string, image: string }) => {
    return api.put(`/api/v1/categories/${id}`, data)
} // edit
export const deleteCategoriesById = (id: number) => api.delete(`/api/v1/categories/${id}`) //delete
export const getCategoriesPage = (offset: number, limit: number) => api.get(`/api/v1/categories/?offset=${offset}&limit=${limit}`)

export const getLocations = () => api.get(`/api/v1/locations`)
export const getLocationsByOrigin = (origin: number[]) => api.get(`/api/v1/locations?origin=${origin}`) //vd origin:6.2071641,-75.5720321
export const getLocationsLimit = (size: string) => api.get(`/api/v1/locations?size=${size}`) // lay so luong diem
export const getLocationsRadius = (origin: number[], radius: number) => api.get(`/api/v1/locations?origin=${origin}&radius=${radius}`)

export const postUploadFile = () => api.post(`/api/v1/files/upload`)
export const getFile = (fileName: string) => api.get(`/api/v1/files/${fileName}`)

const keyApiImgBB = "dbf390df03ec1e2e1081837821efff52"

export const uploadBase64ToImgBB = async (base64: string) => {
    const apiKey = keyApiImgBB; // đăng ký miễn phí tại imgbb.com
    const formData = new FormData();
    formData.append("image", base64.split(",")[1]); // chỉ phần base64

    const res = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
    return res.data.data.url; // URL https://...
};

