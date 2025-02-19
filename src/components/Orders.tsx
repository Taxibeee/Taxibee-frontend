import { useAdminContext } from "../contexts/AdminContextProvider";
// import { useAuth } from "../auth/AuthProvider";


const Rides = () => {
    const { orders } = useAdminContext();


  return (
    <div>
        <h1>Orders</h1>
        <ul>
            {Array.isArray(orders) && orders?.map((order) => (
                <li key={order.id}>
                    <p>{order.id}</p>
                </li>
            ))}
        </ul>
    </div>
  )
}

export default Rides;