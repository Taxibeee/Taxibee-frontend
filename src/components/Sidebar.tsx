
import React from "react";
import { SidebarItem } from "../pages/Dashboard";
import { Box } from "@mui/material";

interface SidebarProps {
    items: SidebarItem[];
}

  const Sidebar: React.FC<SidebarProps> = ({ items }) => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '280px' }}>
        {items.map(item => (
          <div key={item.id} onClick={item.customFunc}>
            {item.title}
          </div>
        ))}
      </Box>
    );
  };

export default Sidebar