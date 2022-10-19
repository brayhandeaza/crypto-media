import { createContext, useEffect, useState } from "react";

export const ThemeContex = createContext()


const ThemeProvider = ({ children }) => {
    const savedTheme = localStorage.getItem("theme")
    const [theme, setTheme] = useState(savedTheme || "light")

    useEffect(() => {
        localStorage.setItem("theme", theme)
    }, [theme])

    return (
        <ThemeContex.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContex.Provider>
    )
}


export default ThemeProvider;

