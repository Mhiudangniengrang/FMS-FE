export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: "Email is invalid",
  },
};

export const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 6,
    message: "Password must be at least 6 characters",
  },
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

export const phoneValidation = {
  required: "Phone number is required",
  pattern: {
    value: /^[0-9]{10,11}$/,
    message: "Phone number is invalid",
  },
};

export const confirmPasswordValidation = (password: string) => ({
  required: "Please confirm your password",
  validate: (value: string) => value === password || "Passwords do not match",
});
