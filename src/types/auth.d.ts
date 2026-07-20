export type AuthFormState = {
  status?: string;
  errors?: {
    email?: string[];
    password?: string[];
    username?: string[];
    confirmPassword?: string[];
    profile?: string[];
    avatar?: string[];
    _form?: string[];
  };
};

export type Profile = {
  id?: string;
  name?: string;
};
