import { Subjects } from "../../subjects";

export interface HospitalCreatedEvent {
  subject: Subjects.HospitalCreated;
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
