import { useAuth } from "../auth/AuthProvider";
import Orders from "../components/Orders";


const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
      <div className="min-h-screen text-white" style={{ width: '60vw' }}>
        Welcome To the {currentUser?.role}'s panel, {currentUser?.name}
        <Orders />
      </div>
  )
}

export default Dashboard;