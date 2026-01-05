export interface Client {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  birthDate?: string;
  nif: string;
  clientNumber: number;
  planning?: string;
  archived: boolean;
}

export interface ClientForm {
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  birthDate: Date | null;
  nif: string | null;
}

export type ClientCreate = Omit<ClientForm, 'birthDate'> & { birthDate?: number };
