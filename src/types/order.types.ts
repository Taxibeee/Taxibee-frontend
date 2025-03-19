
export interface Order {
    order_reference: string;
    driver_name: string | null;
    driver_uuid: string | null;
    payment_method: string | null;
    order_status: string | null;
    vehicle_model: string | null;
    vehicle_license_plate: string | null;
    terminal_name: string | null;
    pickup_address: string | null;
    ride_distance: number | null;
    payment_confirmed_timestamp: number | null;
    order_created_timestamp: number | null;
    order_accepted_timestamp: number | null;
    order_pickup_timestamp: number | null;
    order_dropoff_timestamp: number | null;
    order_finished_timestamp: number | null;
    ride_price: number | null;
    booking_fee: number | null;
    toll_fee: number | null;
    tip: number | null;
    cash_discount: number | null;
    commission: number | null;
    in_app_discount: number | null;
    net_earnings: number | null;
    cancellation_fee: number | null;
}

export interface OrdersResponse {
    data: Order[];
    total_count: number;
    page: number;
    page_size: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
}
