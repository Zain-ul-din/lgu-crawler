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

// collections
export const metadata_col = collection(firebase_store, 'meta_data');
export const timetable_col = collection(firebase_store, 'timetable');
export const teachers_timetable_col = collection(firebase_store, "teachers_timetable")

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
    await setDoc(doc(timetable_col, id.replace (/\//g, "-")), {
        timetable: timetable_data,
        updatedAt: new Date().toString()
    }, { merge: true});
}

interface TimetableDoc extends TimetableDocType
{
    id: string
}

/// summary:
///     calculates teachers timetable and write it to firestore
/// params:
///     NONE
export async function calculateTeachersTimetable ()
{
    const timetable_docs = await getDocs(timetable_col);

    const res: Array<TimetableDocType> = timetable_docs.docs.map(doc => doc.data()) as Array<TimetableDocType>;
    
    const filterQuery =res
    .map(timetableData => Object.entries(timetableData.timetable)
        .map(([_, val]: [string, Array<TimetableData>])=> val
        .map (data => data.teacher)
        ).reduce((acc, curr)=> acc.concat(curr),[])
    ).reduce((acc, curr)=> acc.concat(curr),[])
     
    /**@ts-ignore */
    const teachers = [... new Set(filterQuery)]
    
    for (let teacher of teachers)
    {
        const newDoc = doc(teachers_timetable_col, teacher);
        
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
        }

        const data = timetable_docs.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Array<TimetableDoc>
        
        data.forEach(d => {
            Object.entries(d.timetable).forEach(([day, lectures]: [string, Array<TimetableData>])=> {
                lectures.forEach(lecture => {
                    if (lecture.teacher == teacher)
                        timetable.timetable[day as keyof TimetableResponseType]?.push({class: d.id,...lecture});
                })
            })
       })
       
       timetable.updatedAt = data[0].updatedAt;
       
       await setDoc(newDoc, timetable, { merge: true});
    }
}
