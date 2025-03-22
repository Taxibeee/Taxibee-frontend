export const formatPhone = (phone: string) => {
  const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
  return formattedPhone;
};
