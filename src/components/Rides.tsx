import { useAdminContext } from "../contexts/AdminContextProvider";
// import { useAuth } from "../auth/AuthProvider";


const Rides = () => {
    const { rides } = useAdminContext();


  return (
    <div>
        <h1>Rides</h1>
        <ul>
            {rides?.map((ride) => (
                <li key={ride.id}>
                    <p>Id: {ride.id}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default Rides