export interface Coach {
  id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  expertise: string;
  color: string;
}

export type CoachUpSert = Omit<Coach, 'id' | 'color'>;

export interface CoachForm {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  expertise: string | null;
  color: string | null;
}
