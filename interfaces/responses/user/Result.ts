export interface Result {
  id: string;
  name: string;
  email: string;
  image: string;
  gender: string;
  dateOfBirth: string;
  isPartner: boolean;
  partnerName?: string;
  partnerImagePath?: string;
}
