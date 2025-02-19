import { createContext, PropsWithChildren, useContext } from "react";
import { useQuery } from "@tanstack/react-query"; 
import axiosInstance from "../api/axiosInstance";
import Ride from "../models/models"


interface AdminContext {
    rides: Ride[] | undefined;
}

const AdminContext = createContext<AdminContext | undefined>(undefined);

type AdminContextProviderProps = PropsWithChildren;

export default function AdminContextProvider({ children }: AdminContextProviderProps) {
    const { data: rides } = useQuery({
        queryKey: ['rides'],
        queryFn: async () => {
            const response = await axiosInstance.get('/admin/getAllOrders');
            console.log(response.data);
            return response.data as Ride[];
        }
    })

    return <AdminContext.Provider value={{ rides }}>
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