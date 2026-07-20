import { AuthFormState } from "@/types/auth";
import { ResetPasswordForm } from "@/validations/auth-validation";

export const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

export const INITIAL_STATE_LOGIN_FORM = {
  status: "idle",
  errors: {
    email: [],
    password: [],
    _form: [],
  },
};

export const INITIAL_FORGOT_PASSWORD_FORM = {
  email: "",
};

export const INITIAL_STATE_FORGOT_PASSWORD_FORM: AuthFormState = {
  status: "idle",
  errors: {
    email: [],
    _form: [],
  },
};

export const INITIAL_RESET_PASSWORD_FORM: ResetPasswordForm = {
  password: "",
  confirmPassword: "",
};

export const INITIAL_STATE_RESET_PASSWORD_FORM: AuthFormState = {
  status: "idle",
  errors: {
    password: [],
    confirmPassword: [],
    _form: [],
  },
};

export const INITIAL_STATE_EDIT_PROFILE_FORM: AuthFormState = {
  status: "idle",
  errors: {
    username: [],
    avatar: [],
    _form: [],
  },
};