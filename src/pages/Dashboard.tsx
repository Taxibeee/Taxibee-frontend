import { useAuth } from "../auth/AuthProvider";
// import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";
import Rides from "../components/Rides";
import Sidebar from "../components/Sidebar";



export interface SidebarItem {
  id: number;
  title: string;
  customFunc: () => void;
}

const Dashboard = () => {
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
    {
      id: 3,
      title: 'Users',
      customFunc: () => {
        console.log('Profile');
      },
    },
  ]

  return (
    <div>
      <ResponsiveAppBar />
      <div className="flex">
        <Sidebar 
          items={currentUser?.role === 'driver' ? driverSidebarItems : adminSidebarItems}
          />
      <div className=" min-h-screen">
        Welcome To the {currentUser?.role}'s panel, {currentUser?.name}
        <Rides />
      </div>

      </div>
    </div>
  )
}

export default Dashboard;