import { createContext, PropsWithChildren, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query"; 
import axiosInstance from "../api/axiosInstance";
import Order from "../models/order"


interface AdminContext {
    orders: Order[] | undefined;
    sidebar: boolean;
    setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminContext = createContext<AdminContext | undefined>(undefined);

type AdminContextProviderProps = PropsWithChildren;

export default function AdminContextProvider({ children }: AdminContextProviderProps) {
    const [ sidebar, setSidebar ] = useState(false);
    const { data: orders } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/getAllOrders');
            console.log(response.data.data);
            return response.data.data as Order[];
        }
    })

    return <AdminContext.Provider value={{ orders, sidebar, setSidebar }}>
        { children }
    </AdminContext.Provider>
}

export function useAdminContext() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdminContext must be used within an AdminContextProvider");
    }
    return context;
}