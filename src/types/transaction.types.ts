export interface Transaction {
  payment_reference: string;
  transaction_date: number;
  transaction_date_formatted?: string;
  terminal_name: string;
  operator_code: string;
  transaction_amount: number;
  bolt_driver_uuids: string;
  driver_names?: string[];
}

export interface UnaccountedTransactionsResponse {
  transactions: Transaction[];
  driver_options: { uuid: string; name: string }[];
}
