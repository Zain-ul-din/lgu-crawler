interface TimetableLectureTime {
    hours: number;
    minutes: number;
}
 
export interface TimetableData {
    subject: string;
    roomNo: string;
    teacher: string;
    startTime: TimetableLectureTime;
    endTime: TimetableLectureTime;
    class?: string | undefined
 }
 
 export interface TimetableResponseType {
    Monday?: Array<TimetableData>;
    Tuesday?: Array<TimetableData>;
    Wednesday?: Array<TimetableData>;
    Thursday?: Array<TimetableData>;
    Friday?: Array<TimetableData>;
    Saturday?: Array<TimetableData>;
    Sunday?: Array<TimetableData>;
 }
 
 export interface TimetableDocType {
    timetable: TimetableResponseType;
    updatedAt: string;
 }
 