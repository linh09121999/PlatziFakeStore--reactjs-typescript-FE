import React, { useState, useEffect } from "react";
import { useGlobal } from "../context/GlobalContext";
import { CircularProgress, Box } from '@mui/material';

const BackToTop: React.FC = () => {
    const { icons } = useGlobal()

    const [isVisible, setIsVisible] = useState<boolean>(false);

    const [scrollPercent, setScrollPercent] = useState<number>(0);

    useEffect(() => {

        const toggleVisibility = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (scrollTop / docHeight) * 100;
            setScrollPercent(scrolled);

            if (window.pageYOffset > 120) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="shadow-lg backdrop-blur-[10px] transition-all duration-300 fixed bottom-[24px] right-[30px] text-white rounded-full flex items-center justify-center z-10 css-icon"

                >
                    <CircularProgress variant="determinate" value={scrollPercent} size="50px" sx={{ color: "var(--color-white)" }} />
                    <Box
                        sx={{
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: "var(--color-white)",
                        }}
                    >
                        {icons.iconBackToTop}
                    </Box>
                </button>
            )}
        </>
    )
}

export default BackToTop