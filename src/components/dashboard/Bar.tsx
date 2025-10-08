import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../../context/GlobalContext';
import type { propsLogOut } from '../../context/GlobalContext';

const BarAdmin: React.FC<propsLogOut> = ({ onLogout }) => {
    const navigate = useNavigate()
    const { imgs, sidebarOpen, setSidbarOpen, listPagesDashboard,
        selectPage, setSelectPage, icons
    } = useGlobal()

    return (
        <>
            <aside className={` ${sidebarOpen ? "w-[90px]" : "w-[280px]"}  fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 -translate-x-full lg:translate-x-0`}>
                <div className='py-8 flex justify-start items-end gap-2'>
                    <img alt='logo' className='h-10 max-md:h-8' src={imgs.logoColor} />
                    <p className={`${sidebarOpen ? "hidden" : ""} text-3xl text-orange-700 font-bold max-md:text-2xl transition-all duration-300 ease-in-out`}>SPEE</p>
                </div>
                <div className='flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar'>
                    <nav className='mb-6'>
                        <div className='flex flex-col gap-4 overflow-x-hidden'>
                            <ul className='flex flex-col gap-4'>
                                {listPagesDashboard.map(page => (
                                    <li key={page.id}>
                                        <button className={`${selectPage === page.title ? "bg-orange-700 text-white" : "text-black/70"} ${sidebarOpen ? "justify-center" : ""} px-4 h-[50px] transition-all duration-300 ease-in-out relative flex w-full items-center gap-4 rounded-[10px] font-600 group menu-item-inactive cursor-pointer`}
                                            onClick={() => {
                                                setSelectPage(page.title)
                                                navigate(page.path)
                                            }}
                                        >
                                            <span className='text-2xl'>{page.icon}</span>
                                            <span className={`${sidebarOpen ? "hidden" : ""}  text-xl transition-all duration-300 ease-in-out`}>{page.title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className='w-full h-[2px] bg-gray-300'></div>
                            <ul className='flex flex-col gap-4'>
                                <li>
                                    <button className={`${selectPage === "Setting" ? "bg-orange-700 text-white" : ""} ${sidebarOpen ? "justify-center" : ""} px-4 h-[50px] transition-all duration-300 ease-in-out relative flex w-full items-center gap-4 rounded-[10px] font-600 group menu-item-inactive cursor-pointer`}
                                        onClick={() => {
                                            setSelectPage("Setting")
                                            navigate("/admin/setting")
                                        }}
                                    >
                                        <span className='text-2xl'>{icons.iconSetting}</span>
                                        <span className={`${sidebarOpen ? "hidden" : ""}  text-xl transition-all duration-300 ease-in-out`}>Setting</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className={`${selectPage === "Logout" ? "bg-orange-700 text-white" : ""} ${sidebarOpen ? "justify-center" : ""} px-4 h-[50px] transition-all duration-300 ease-in-out relative flex w-full items-center gap-4 rounded-[10px] font-600 group menu-item-inactive cursor-pointer`}
                                        onClick={onLogout}
                                    >
                                        <span className='text-2xl rotate-[180deg]'>{icons.iconLogout}</span>
                                        <span className={`${sidebarOpen ? "hidden" : ""}  text-xl transition-all duration-300 ease-in-out`}>Logout</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </aside>
        </>
    )
}

export default BarAdmin