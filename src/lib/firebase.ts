import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

/// Summary:
///     writes meta data to firebase store
/// Params:
///     meta_data: any
export async function write_metadata(meta_data: any) {
    const metadata_col = collection(firebase_store, 'meta_data');

    for (let [key, val] of Object.entries(meta_data))
        await setDoc(
            doc(metadata_col, (key as string).replace('/', '-')),
            { [key]: val },
            { merge: true }
        );
}

export async function writeTimetableData(timetable_data: any, id: string) {
    const timetable_col = collection(firebase_store, 'timetable');

    console.log ("id: ", id);
    
    await setDoc(doc(timetable_col, id.replace (/\//g, "-")), {
        timetable: timetable_data,
        updatedAt: new Date().toString()
    }, { merge: true});
}

