import type { TFunction } from "i18next";

export const emailValidation = (t: TFunction) => ({
  required: t("emailRequired"),
  pattern: {
    value: /\S+@\S+\.\S+/,
    message: t("emailInvalid"),
  },
});

export const nameValidation = (t: TFunction) => ({
  required: t("nameRequired"),
  minLength: {
    value: 2,
    message: t("nameMinLength"),
  },
});

export const passwordValidation = (t: TFunction) => ({
  required: t("passwordRequired"),
  minLength: {
    value: 6,
    message: t("passwordMinLength"),
  },
});

export const validateEmail = (email: string): boolean => {
  const emailRegex = /\S+@\S+\.\S+/;
  return emailRegex.test(email);
};

export const phoneValidation = (t: TFunction) => ({
  required: t("phoneRequired"),
  pattern: {
    value: /^[0-9]{10,11}$/,
    message: t("phoneInvalid"),
  },
});

export const confirmPasswordValidation = (password: string, t: TFunction) => ({
  required: t("confirmPasswordRequired"),
  validate: (value: string) => value === password || t("passwordsDoNotMatch"),
});
