export interface Coach {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  expertise: string;
  color: string;
  nif: string;
  professionalCardNumber: string;
  civilInsurance: string;
  workInsurance: string;
  address: string;
  employeeNumber: number;
}

export interface CoachForm {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  expertise: string | null;
  nif: string | null;
  professionalCardNumber: string | null;
  civilInsurance: string | null;
  workInsurance: string | null;
  address: string | null;
  color: string | null;
}
