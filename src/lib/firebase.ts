import { initializeApp } from 'firebase/app';
import { getDocs, getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
};

export const firebase_app = initializeApp(firebaseConfig);
export const firebase_store = getFirestore(firebase_app);

import { setDoc, collection, doc } from 'firebase/firestore';
import { TimetableData, TimetableDocType, TimetableResponseType } from '../types/TimetableTypes';
import { replaceAll } from './util';

// collections
export const metadata_col = collection(firebase_store, 'meta_data');
export const timetable_col = collection(firebase_store, 'timetable');
export const teachers_timetable_col = collection(firebase_store, 'teachers_timetable');
export const past_papers_input_col = collection(firebase_store, "past_papers_input");

/// Summary:
///     writes meta data to firebase store
/// Params:
///     meta_data: any
export async function write_metadata(meta_data: any) {
    for (let [key, val] of Object.entries(meta_data))
        await setDoc(
            doc(metadata_col, (key as string).replace('/', '-')),
            { [key]: val },
            { merge: true }
        );
}

/// summary:
///     write timetable data to firebase store
/// params:
///     id: string
///     timetable_data: any
export async function writeTimetableData(timetable_data: any, id: string) {
    await setDoc(
        doc(timetable_col, id.replace(/\//g, '-')),
        {
            timetable: timetable_data,
            updatedAt: new Date().toString()
        },
        { merge: true }
    );
}

interface TimetableDoc extends TimetableDocType {
    id: string;
    department: string;
    semester: string;
}

/// summary:
///     calculates teachers timetable and write it to firestore
/// params:
///     NONE
export async function calculateTeachersTimetable() {
    const timetable_docs = await getDocs(timetable_col);

    const res: Array<TimetableDocType> = timetable_docs.docs.map((doc) =>
        doc.data()
    ) as Array<TimetableDocType>;

    const filterQuery = res
        .map((timetableData) =>
            Object.entries(timetableData.timetable)
                .map(([_, val]: [string, Array<TimetableData>]) => val.map((data) => data.teacher))
                .reduce((acc, curr) => acc.concat(curr), [])
        )
        .reduce((acc, curr) => acc.concat(curr), []);

    /**@ts-ignore */
    const teachers = [...new Set(filterQuery)];

    for (let teacher of teachers) {
        const newDoc = doc(teachers_timetable_col, replaceAll(teacher, "/", "-"));

        const timetable: TimetableDocType = {
            updatedAt: '',
            timetable: {
                Monday: [],
                Friday: [],
                Thursday: [],
                Saturday: [],
                Sunday: [],
                Tuesday: [],
                Wednesday: []
            }
        };
        
        const data = timetable_docs.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
        })) as Array<TimetableDoc>;

        data.forEach((d) => {
            Object.entries(d.timetable).forEach(
                ([day, lectures]: [string, Array<TimetableData>]) => {
                    lectures.forEach((lecture) => {
                        if (lecture.teacher == teacher)
                            timetable.timetable[day as keyof TimetableResponseType]?.push({
                                class: d.id,
                                ...lecture
                            });
                    });
                }
            );
        });
        
        timetable.updatedAt = (new Date()).toString();

        await setDoc(newDoc, timetable, { merge: true });
    }
}

interface PastPapersInputDocType 
{
    [department:string]: Array<string>
}

export async function calculatePastTimetableInputOptions ()
{
    
    const timetable_docs = await getDocs(timetable_col);

    const res: Array<TimetableDocType> = timetable_docs.docs.map((doc) =>
        doc.data()
    ) as Array<TimetableDocType>;

    const data = timetable_docs.docs.map((doc) => ({
        id: doc.id,
        department: (doc.id.split(/[0-9]/g).at(-1) as string).split('Sec')[0].trim(),
        ...doc.data()
    })) as Array<TimetableDoc>;


    // payload
    var input_metadata: PastPapersInputDocType = {};

    data.forEach((d) => {
        Object.entries(d.timetable).forEach(
            ([_, lectures]: [string, Array<TimetableData>]) => {
                lectures.forEach((lecture) => {
                    if (!input_metadata[d.department]) input_metadata[d.department] = []
                    input_metadata[d.department].push(lecture.subject);
                });
            }
        );
    });

    input_metadata = Object.entries(input_metadata).map (([key, val])=> {
        return {key, val: val.filter ((curr_val, idx, self)=> idx == self.indexOf(curr_val))}
    }).reduce((acc,curr )=> {
        return { [curr.key]: curr.val, ...acc }
    }, {})

    const past_paper_input_doc = doc(past_papers_input_col, "subjects");
    await setDoc(past_paper_input_doc, { data:  input_metadata}, { merge: true})
}



