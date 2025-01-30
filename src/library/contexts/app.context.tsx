'use client'

import { createContext, useContext, useState } from "react";

interface IAppContext {
    currentPage: number;
    setCurrentPage: (v: number) => void;
}

export const App = createContext<IAppContext | null>(null);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <App.Provider value={{ currentPage, setCurrentPage }}>
            {children}
        </App.Provider>
    )
};

export const useAppContext = () => useContext(App);