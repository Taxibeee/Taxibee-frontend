export interface Contact {
  name: string;
  email: string;
  phone: string;
  tag: string;
}

export interface ContactResponse {
  data: Contact[];
}
