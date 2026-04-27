import { useEffect, useState } from "react";

export function useMobile() {
    const [isMobile, setMobile] = useState(() => {
        return window.innerWidth < 768 ? true : false;
    });

    const handleMobile = () => {
        setMobile(window.innerWidth < 768 ? true : false);
    };

    useEffect(() => {
        window.addEventListener("resize", handleMobile);

        return () => {
            window.removeEventListener("resize", handleMobile);
        };
    }, []);

    return { isMobile }
}