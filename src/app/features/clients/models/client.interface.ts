export interface Client {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate: string;
}

export interface ClientForm {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  birthDate: Date | null;
}

export type ClientCreate = Omit<ClientForm, 'birthDate'> & { birthDate: string | null };
