import type { SignupRequest } from "@/types/auth/auth.dto";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RegisterStep = "FORM" | "EMAIL_SENT" | "VERIFIED";

interface RegisterState {
  step: RegisterStep;
  form: SignupRequest;

  setStep: (step: RegisterStep) => void;
  setField: (key: keyof SignupRequest, value: string) => void;
  reset: () => void;
}

const initialForm: SignupRequest = {
  name: "",
  loginId: "",
  password: "",
  confirmPassword: "",
  email: "",
  phone: ""
}

export const useRegisterStore = create(
  persist<RegisterState> (
    (set) => ({
      step: "FORM",
      form: initialForm,

      setStep: (step) => set({step}),
      setField: (key, value) =>
        set((state) => ({
          form: {...state.form, [key]: value},
        })),
        reset: () => 
          set({
            step: "FORM",
            form: initialForm,
          }),
    }),
    {name: "register-store"}
  )
);