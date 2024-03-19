import initLocalDB from "./initDB";
import {writeDB} from "./writeDB";
import {readDB} from "./readDB";

initLocalDB();

export {writeDB, readDB};
