import { useAuth } from "../auth/AuthProvider";
// import { useNavigate } from "react-router-dom";
import ResponsiveAppBar from "../components/ResponsiveAppBar";

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div>
      <ResponsiveAppBar />
      Welcome {currentUser?.name}
    </div>
  )
}

export default Dashboard;