export default interface Order {
    id: number;
    order_reference: string;
    driver_name?: string;
    driver_uuid?: string;
    partner_uuid?: string;
    driver_phone?: string;
    payment_method?: string;
    order_status?: string;
    vehicle_model?: string;
    vehicle_license_plate?: string;
    price_review_reason?: string;
    pickup_address?: string;
    order_stops?: OrderStop; // Equivalent to Json type, could be more specific based on your needs
    payment_confirmed_timestamp?: string; // ISO datetime string
    order_created_timestamp?: string;
    order_accepted_timestamp?: string;
    order_pickup_timestamp?: string;
    order_drop_off_timestamp?: string;
    order_finished_timestamp?: string;
    ride_distance?: string;
    ride_price?: string;
    booking_fee?: string;
    toll_fee?: string;
    cancellation_fee?: string;
    tip?: string;
    net_earnings?: string;
    cash_discount?: string;
    in_app_discount?: string;
    commission?: string;
    timezone?: string;
}

interface OrderStop {
    pickup?: Pickup;
    dropoff?: Dropoff;
}

interface Pickup {
    latitude?: number;
    longitude?: number;
    real_latitude?: number;
    real_longitude?: number;
    type?: string;
}

interface Dropoff {
    latitude?: number;
    longitude?: number;
    real_latitude?: number;
    real_longitude?: number;
    type?: string;
}