import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../services/userService';
import { useGlobal } from '../../context/GlobalContext';
import { Menu, MenuItem } from '@mui/material'
import type { SxProps, Theme } from "@mui/material/styles";
import type { propsLogOut} from '../../context/GlobalContext';

const HeaderAdmin: React.FC<propsLogOut> = ({ onLogout }) => {
    const navigate = useNavigate()
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

    const { icons, ordersNumber,
        imgs, setResProfile, resProfile, sidebarOpen, setSidbarOpen,
        selectPage
    } = useGlobal()



    const getApiProfile = async () => {
        try {
            const res = await getProfile();
            setResProfile(res.data)
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
    };

    useEffect(() => {
        getApiProfile()
    }, [])

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            <header className={`sticky top-0 flex w-full bg-white z-99 lg:border-b}`} >
                <div className='flex justify-between p-5 w-full'>
                    <div className='flex gap-4 items-center text-3xl max-md:text-2xl '>
                        <button className='border-[1px] border-black/50 p-1 text-black/50 rounded-[10px] hover:border-orange-700 hover:text-orange-700'
                            onClick={() => {
                                setSidbarOpen(!sidebarOpen);
                            }}
                        >{icons.iconMenu}</button>
                        <p className=''>{selectPage}</p>
                    </div>
                    <button className='flex gap-4 items-center'
                        onClick={handleClick}
                    >
                        <img className='w-[50px] rounded-full' src={resProfile?.avatar} alt={resProfile?.name} />
                        <div>
                            <p className='text-lg'>{resProfile?.email}</p>
                            <p className='text-sm bg-orange-700/10 text-orange-700 w-fit px-4 py-1 rounded-full border-[1px] border-orange-700/20'>{resProfile?.role}</p>
                        </div>
                        <span>{open ? icons.iconUp : icons.iconDown}</span>
                    </button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={PaperProps}
                        MenuListProps={MenuListProps}
                    >
                        <MenuItem onClick={() => {
                            navigate("/admin/setting", { state: { data: resProfile } })
                            handleClose()
                        }}
                            sx={sxMenuItem}
                        >
                            <div className='flex text-lg items-center gap-2'><span className=' text-xl'>{icons.iconEditUser}</span> Edit profile</div>
                        </MenuItem>
                        <MenuItem onClick={onLogout}
                            sx={sxMenuItem}
                        >
                            <div className='flex text-lg items-center gap-2'><span className='rotate-[180deg] text-xl'>{icons.iconLogout}</span> Logout</div>
                        </MenuItem>
                    </Menu>
                </div>
            </header>

        </>
    )
}

export default HeaderAdmin