import Dashboard from "../pages/Dashboard"
import { useAuth } from "../auth/AuthProvider";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Sidebar from "../components/Sidebar";
export interface SidebarItem {
  id: number;
  title: string;
  customFunc: () => void;
  icon?: React.ReactNode;
}



const AdminView = () => {
  const { currentUser } = useAuth();
  const driverSidebarItems: SidebarItem[] = [
      {
        id: 1,
        title: 'Rides',
        customFunc: () => {
          console.log('Rides');
        },
      },
      {
        id: 2,
        title: 'Statistics',
        customFunc: () => {
          console.log('Profile');
        },
      },
    ];
  
    const adminSidebarItems: SidebarItem[] = [
      {
        id: 1,
        title: 'Orders',
        customFunc: () => {
          console.log('Rides');
        },
        icon: <></>
      },
      {
        id: 2,
        title: 'Statistics',
        customFunc: () => {
          console.log('Profile');
        },
        icon: <></>
      },
      {
        id: 3,
        title: 'Users',
        customFunc: () => {
          console.log('Profile');
        },
        icon: <></>
      },
    ] 
  return (
    <div>
      <ResponsiveAppBar />
      <div className="flex">
        <Sidebar 
          items={currentUser?.role === 'driver' ? driverSidebarItems : adminSidebarItems}
          />
        </div>
      <Dashboard />
    </div>
  )
}

export default AdminView;