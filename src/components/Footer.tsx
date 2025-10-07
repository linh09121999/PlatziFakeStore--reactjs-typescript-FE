import React from 'react';

const Footer: React.FC = () => {
    const year = new Date().getFullYear()
    return (
        <footer className='p-5 bg-orange-100 border-t-[3px] border-t-orange-700'>
            <div className="max-w-[1500px] mx-auto flex flex-col gap-4">
                <p className='text-center'>Data provided by <a className='text-orange-700' href="https://fakeapi.platzi.com">Pratzi Fake Store API</a></p>
                <p className='text-center'>&copy; {year} sppee. All the rights are reserved.</p>
            </div>
        </footer>
    )
}

export default Footer;