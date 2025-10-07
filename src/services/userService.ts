import api from "./api";

export const getUsers = () => api.get("/api/v1/users"); //Danh sách user
export const postUsers = () => api.post("/api/v1/users")  //thêm user
export const getUserById = (id: number) => api.get(`/api/v1/users/${id}`) //user theo id
export const putUserById = (id: number) => api.put(`/api/v1/users/${id}`) //sửa user theo id
export const deleteUserById = (id: number) => api.delete(`/api/v1/users/${id}`) //xóa user theo id
export const postCheckMailAvailable = () => api.post("/api/v1/is-available"); //check mail có tồn tại k(dành lúc đky tài khoản)

export const postLogin = (data: { email: string; password: string }) => {
    return api.post(`/api/v1/auth/login`, data);
};
export const getProfile = () => api.get(`/api/v1/auth/profile`)
export const postRefreshToken = () => api.post(`/api/v1/auth/refresh-token`)

export const getProducts = () => api.get(`/api/v1/products`) // lấy tất cả sp
export const getProductsById = (id: number) => api.get(`/api/v1/products/${id}`) // lấy 1 sp theo id
export const getProductsBySlug = (slug: string) => api.get(`/api/v1/products/slug/${slug}`) //  lấy sp theo slug
export const postProducts = () => api.post(`/api/v1/products`) //thêm sp
export const putProductById = (id: number) => api.put(`/api/v1/products/${id}`) //sửa sp
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
export const postCategories = () => api.post(`/api/v1/categories`) //add 
export const putCategoriesById = (id: number) => api.put(`/api/v1/categories/${id}`) // edit
export const deleteCategoriesById = (id: number) => api.delete(`/api/v1/categories/${id}`) //delete
export const getCategoriesPage = (offset: number, limit: number) => api.get(`/api/v1/categories/?offset=${offset}&limit=${limit}`)

export const getLocations = () => api.get(`/api/v1/locations`)
export const getLocationsByOrigin = (origin: number[]) => api.get(`/api/v1/locations?origin=${origin}`) //vd origin:6.2071641,-75.5720321
export const getLocationsLimit = (size: string) => api.get(`/api/v1/locations?size=${size}`) // lay so luong diem
export const getLocationsRadius = (origin: number[], radius: number) => api.get(`/api/v1/locations?origin=${origin}&radius=${radius}`)

export const postUploadFile = () => api.post(`/api/v1/files/upload`)
export const getFile = (fileName: string) => api.get(`/api/v1/files/${fileName}`)



