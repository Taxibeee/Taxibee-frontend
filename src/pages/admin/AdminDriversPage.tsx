import React, { use, useState } from 'react';
import {
    Typography,
    Box
} from '@mui/material';
import { useAdminQueries } from '../../hooks';
import { sideBarItemsAdmin } from './AdminSidebar';
import { DashboardLayout } from '../../components';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';

const AdminDriversPage: React.FC = () => {
    const [ searchTerm, setSearchTerm ] = useState<string>('');
    const { useAllDrivers, useUpdateDriversTable } = useAdminQueries();
    const { data, isLoading, isError, refetch } = useAllDrivers();
    const updateDriversMutation = useUpdateDriversTable();

    const handleUpdateDrivers = () => {
        updateDriversMutation.mutate();
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredDrivers = data?.data.filter(driver => {
        if(!searchTerm) return true;

        const term = searchTerm.toLowerCase();
        return (
            driver.full_name.toLowerCase().includes(term) ||
            driver.email.toLowerCase().includes(term) ||
            driver.phone.toLowerCase().includes(term) ||
            (driver.exact_debnr && driver.exact_debnr.toLowerCase().includes(term))
        );
    });

    return (
        <DashboardLayout menuItems={sideBarItemsAdmin}>
            <Box>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Drivers
                </Typography>
            </Box>
        </DashboardLayout>
    )


}