export type TruckStatus =
  "ACTIVE" | "INACTIVE" | "SUSPENDED";

  export interface TruckFormData {
    name: string;
    cuisine?: string;
  }