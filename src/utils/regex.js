export const checkPasswordValidation = value => {
  // cek spasi
  const isWhiteSpace = /^(?=.*\s)/;
  if (isWhiteSpace.test(value)) {
    // return "Password must not contain Whitespaces.";
    return "Password tidak boleh mengandung spasi";
  }

  // cek 1 karakter huruf besar
  const isContainsUppercase = /^(?=.*[A-Z])/;
  if (!isContainsUppercase.test(value)) {
    // return "Password must have at least one Uppercase Character.";
    return "Password harus memiliki setidaknya 1 karakter huruf besar";
  }

  // cek 1 karakter huruf kecil
  const isContainsLowercase = /^(?=.*[a-z])/;
  if (!isContainsLowercase.test(value)) {
    // return "Password must have at least one Lowercase Character.";
    return "Password harus memiliki setidaknya 1 karakter huruf kecil";
  }

  // cek 1 karakter angka
  const isContainsNumber = /^(?=.*[0-9])/;
  if (!isContainsNumber.test(value)) {
    // return "Password must contain at least one Digit.";
    return "Password harus mengandung setidaknya 1 digit angka";
  }

  // cek 1 karakter simbol
  const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
  if (!isContainsSymbol.test(value)) {
    // return "Password must contain at least one Special Symbol.";
    return "Password harus mengandung setidaknya 1 karakter spesial";
  }

  //   cek panjang karakter min 10 & max 16
  const isValidLength = /^.{10,16}$/;
  if (!isValidLength.test(value)) {
    // return "Password must be 10-16 Characters Long.";
    return "Password harus terdiri dari 10 - 16 karakter";
  }

  return null;
};
