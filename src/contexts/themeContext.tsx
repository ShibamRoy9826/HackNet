import { catppuccinMocha, defaultTheme, lightTheme } from "@utils/themes";
import React, { createContext, useContext, useState } from "react";

type themeContextType = {
    colors: {
        primary: string;
        activated: string;
        secondary: string;
        background: string;
        secondaryBackground: string;
        darkBackground: string;
        border: string;
        muted: string;
        disabled: string;
        text: string;
        smallText: string;
    },
    setTheme: (a: "default" | "light" | "catppuccin") => void
}
const ThemeContext = createContext<themeContextType | null>(null);

const themes = {
    "default": defaultTheme.colors,
    "light": lightTheme.colors,
    "catppuccin": catppuccinMocha.colors
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [currTheme, setCurrTheme] = useState<"default" | "light" | "catppuccin">("default")


    return (
        <ThemeContext.Provider value={
            {
                colors: themes[currTheme],
                setTheme: setCurrTheme
            }
        }>
            {children}
        </ThemeContext.Provider>
    )
}


export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useUser must be used within a ThemeProvider");
    }
    return context;
}