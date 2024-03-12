import TimetableType from "./TimetableType";

interface TimetableDocType {
  updatedAt: Date;
  uid: string;
  timetable: TimetableType;
}

export default TimetableDocType;
