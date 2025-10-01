import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";


export interface GlobalState {
    text: string | null;
    setText: (user: string | null) => void;
}


const GlobalContext = createContext<GlobalState | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [text, setText] = useState<string | null>("Hello");

    const value = {
        text, setText
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