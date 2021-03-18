import { Subjects } from "../../subjects";

export interface HospitalUpdatedEvent {
  subject: Subjects.HospitalUpdated;
  data: {
    id: string;
    hospitalName: string;
    location: string;
    hospitalType: string;
    size: string;
    beds: number;
    phoneNumber: string;
    emergencyHotline: string;
    contactPerson: string;
    description: string;
    userId: string;
    version: number;
  };
}
