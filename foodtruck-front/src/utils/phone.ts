export function isValidPhoneNumber(value: string) {
  if(!value) return true;

  return /^01[016789]\d{7,8}$/.test(value);
}