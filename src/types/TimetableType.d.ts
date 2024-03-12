interface TimetableType {
  [weekName: string]: {
    class?: string;
    subject: string;
    roomNo: string;
    teacher: string;
    startTime: {
      hours: number;
      minutes: number;
    };
    endTime: {
      hours: number;
      minutes: number;
    };
  }[];
}

export default TimetableType;
