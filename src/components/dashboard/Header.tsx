import React from 'react';

type propsLogOut = {
    onLogout: () => void
}


const HeaderAdmin: React.FC<propsLogOut> = ({ onLogout }) => {
    return (
        <>
            <button className='px-2 css-icon' onClick={onLogout}>Logout</button>

        </>
    )
}

export default HeaderAdmin