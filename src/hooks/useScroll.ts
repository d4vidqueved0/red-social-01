import { useState, useEffect } from "react";

export function useScroll() {
    const [scroll, setScroll] = useState(() => {
        return window.scrollY >= 200 ? true : false;
    });

    const handleScroll = () => {
        setScroll(window.scrollY >= 200 ? true : false);
    };
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return { scroll }
}