import React, { createContext, useContext, useState } from "react";
import type { JSX, ReactNode } from "react";
import { useMediaQuery } from "@mui/material"
import {
    FaHome,
    FaUser,
    FaMapMarkerAlt,
    FaAngleDoubleUp,
    FaChevronDown,
    FaChevronUp,
    FaEye, FaEyeSlash,
    FaDollarSign,
    FaLock
} from "react-icons/fa";
import { FaCalendarDays, FaCartShopping, FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";
import { CgMenu } from "react-icons/cg";
import { BsTrash3Fill } from "react-icons/bs";
import {
    IoClose,
} from "react-icons/io5";
import {
    MdNavigateNext, MdHorizontalRule
} from "react-icons/md";
import { LuSettings2 } from "react-icons/lu";
import { IoMdSearch, IoMdMail } from "react-icons/io";
import { RiAddFill } from "react-icons/ri";

import imgBanner1 from "../assets/img/banner.png"
import imgDefault from "../assets/img/no_img.png"
import logo from "../assets/logoHeader.png"
import logoColor from "../assets/logo.png"
import imgNoItem from "../assets/img/no-items-in-cart.png"

export interface Image {
    imgBanner1: string;
    imgDefault: string;
    logo: string;
    imgNoItem: string;
    logoColor: string;
}

const defaultImage: Image = {
    imgBanner1: imgBanner1,
    imgDefault: imgDefault,
    logo: logo,
    imgNoItem: imgNoItem,
    logoColor: logoColor
}

export interface Icons {
    iconMenu: JSX.Element;
    iconClose: JSX.Element;
    iconBackToTop: JSX.Element;
    iconMap: JSX.Element;
    iconNext: JSX.Element;
    iconUser: JSX.Element;
    iconCalendar: JSX.Element;
    iconUp: JSX.Element;
    iconDown: JSX.Element;
    iconEye: JSX.Element;
    iconEyeSlash: JSX.Element;
    iconHome: JSX.Element;
    iconSetting: JSX.Element;
    iconSearch: JSX.Element;
    iconCart: JSX.Element;
    iconSortUp: JSX.Element;
    iconSortDown: JSX.Element;
    iconDollar: JSX.Element;
    iconIncrease: JSX.Element;
    iconDecrease: JSX.Element;
    iconDelete: JSX.Element;
    iconLock: JSX.Element;
    iconMail: JSX.Element;
}

const defaultIcons: Icons = {
    iconMenu: <CgMenu />,
    iconClose: <IoClose className=" mx-auto" />,
    iconBackToTop: <FaAngleDoubleUp />,
    iconMap: <FaMapMarkerAlt size={30} />,
    iconNext: <MdNavigateNext size={24} />,
    iconUser: <FaUser />,
    iconCalendar: <FaCalendarDays />,
    iconUp: <FaChevronUp size={14} />,
    iconDown: <FaChevronDown size={14} />,
    iconEye: <FaEye className="mx-auto" />,
    iconEyeSlash: <FaEyeSlash className="mx-auto" />,
    iconHome: <FaHome />,
    iconSetting: <LuSettings2 className="mx-auto" />,
    iconSearch: <IoMdSearch className="mx-auto" />,
    iconCart: <FaCartShopping />,
    iconSortUp: <FaArrowUpLong />,
    iconSortDown: <FaArrowDownLong />,
    iconDollar: <FaDollarSign />,
    iconIncrease: <RiAddFill className="mx-auto" />,
    iconDecrease: <MdHorizontalRule className="mx-auto" />,
    iconDelete: <BsTrash3Fill />,
    iconLock: <FaLock />,
    iconMail: <IoMdMail />
}

export interface Category {
    id: number;
    name: string;
    image: string;
    slug: string;
    creationAt: string;
    updatedAt: string;
}

export interface ResProduct {
    id: number;
    title: string;
    slug: string;
    price: number;
    description: string;
    category: Category;
    images: string[];
    creationAt: string;
    updatedAt: string;
}

export interface ResAddProduct extends ResProduct {
    creationAt: string;
    updatedAt: string
}

export interface ResUser {
    id: number;
    email: string;
    password: string;
    name: string;
    role: string;
    avatar: string;
}

export interface ResJWT {
    access_token: string;
    refresh_token: string;
}

export interface ResLocations {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number
}

export interface ResUploadFile {
    originalname: string;
    filename: string;
    location: string;
}

export interface GlobalState {
    icons: Icons;
    imgs: Image;

    resProduct: ResProduct[];// dùng cho list, filter
    setResProduct: React.Dispatch<React.SetStateAction<ResProduct[]>>;

    resProductBy: ResProduct | undefined;// dùng cho 1 sản phẩm, add, edit;
    setResProductBy: React.Dispatch<React.SetStateAction<ResProduct | undefined>>;

    resProductRelateBy: ResProduct[];// dùng cho list, filter
    setResProductRelateBy: React.Dispatch<React.SetStateAction<ResProduct[]>>;

    resAddProduct: ResAddProduct | undefined; //khi xem các sp đã thêm
    setResAddProduct: React.Dispatch<React.SetStateAction<ResAddProduct | undefined>>;

    resCategories: Category[];// dung cho list
    setResCategories: React.Dispatch<React.SetStateAction<Category[]>>;

    resCategoriesBy: Category | undefined;// dung cho 1 cate.., add, edit
    setResCategoriesBy: React.Dispatch<React.SetStateAction<Category | undefined>>;

    resUser: ResUser[]; //list
    setResUser: React.Dispatch<React.SetStateAction<ResUser[]>>;

    resUserBy: ResUser | undefined; //1 user, add, edit
    setResUserBy: React.Dispatch<React.SetStateAction<ResUser | undefined>>;

    resJWT: ResJWT | undefined;
    setResJWT: React.Dispatch<React.SetStateAction<ResJWT | undefined>>;

    resProfile: ResUser | undefined;
    setResProfile: React.Dispatch<React.SetStateAction<ResUser | undefined>>;

    resRefreshToken: ResJWT | undefined;
    setResRefrshToken: React.Dispatch<React.SetStateAction<ResJWT | undefined>>;

    resLocations: ResLocations[];
    setResLocations: React.Dispatch<React.SetStateAction<ResLocations[]>>;

    resUploadFile: ResUploadFile | undefined;
    setResUploadFile: React.Dispatch<React.SetStateAction<ResUploadFile | undefined>>;

    ordersList: ResProduct[];

    setOrdersList: React.Dispatch<React.SetStateAction<ResProduct[]>>;

    isMobile: boolean;
    isTable: boolean;
    ordersNumber: number;
    setOrdersNumber: (orders: number) => void;

    selectCateCategoryName: string | undefined;
    setSelectCateCategoryName: (select: string | undefined) => void;
    selectCateCategoryID: number;
    setSelectCateCategoryID: (select: number) => void;
    pageSize: number;
    selectProductID: number;
    setSelectProductId: (select: number) => void;
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    token: string;
    setToken: (token: string) => void;
}

const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const isMobile = useMediaQuery("(max-width:768px)");
    const isTable = useMediaQuery("(max-width:1024px)")
    const [resProduct, setResProduct] = useState<ResProduct[]>([]);
    const [resProductBy, setResProductBy] = useState<ResProduct>();
    const [resProductRelateBy, setResProductRelateBy] = useState<ResProduct[]>([])
    const [resAddProduct, setResAddProduct] = useState<ResAddProduct>();
    const [resCategories, setResCategories] = useState<Category[]>([]);
    const [resCategoriesBy, setResCategoriesBy] = useState<Category>();
    const [resUser, setResUser] = useState<ResUser[]>([]);
    const [resUserBy, setResUserBy] = useState<ResUser>();
    const [resJWT, setResJWT] = useState<ResJWT>();
    const [resProfile, setResProfile] = useState<ResUser>();
    const [resRefreshToken, setResRefrshToken] = useState<ResJWT>();
    const [resLocations, setResLocations] = useState<ResLocations[]>([]);
    const [resUploadFile, setResUploadFile] = useState<ResUploadFile>();

    const [ordersNumber, setOrdersNumber] = useState<number>(0)

    const [ordersList, setOrdersList] = useState<ResProduct[]>([])

    const [selectCateCategoryID, setSelectCateCategoryID] = useState<number>(-1)
    const [selectCateCategoryName, setSelectCateCategoryName] = useState<string | undefined>("");
    const [selectProductID, setSelectProductId] = useState<number>(-1)

    const pageSize = 12

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [token, setToken] = useState<string>("")

    const value = {
        icons: defaultIcons,
        isMobile, isTable,
        resProduct, setResProduct,
        resProductBy, setResProductBy,
        resAddProduct, setResAddProduct,
        resCategories, setResCategories,
        resCategoriesBy, setResCategoriesBy,
        resUser, setResUser,
        resUserBy, setResUserBy,
        resJWT, setResJWT,
        resProfile, setResProfile,
        resRefreshToken, setResRefrshToken,
        resLocations, setResLocations,
        resUploadFile, setResUploadFile,
        ordersNumber, setOrdersNumber,
        ordersList, setOrdersList,
        imgs: defaultImage,
        selectCateCategoryName, setSelectCateCategoryName,
        selectCateCategoryID, setSelectCateCategoryID,
        selectProductID, setSelectProductId,
        pageSize,
        resProductRelateBy, setResProductRelateBy,
        email, setEmail, password, setPassword, token, setToken
    }

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

// Custom hook for convenience
export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used within a GlobalProvider");
    }
    return context;
};