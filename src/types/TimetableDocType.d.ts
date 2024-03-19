import TimetableType from "./TimetableType";

interface TimetableDocType {
  updatedAt: Date;
  uid: string;
  payload?: {semester: string; program: string; section: string};
  timetable: TimetableType;
}

export default TimetableDocType;
