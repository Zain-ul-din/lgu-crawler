import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import metaDataRoute from './scrapper/meta_data';
import timetableRouter from './scrapper/timetable';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// cross origin resource sharing
app.use(cors({ origin: '*' }));

// parse application/json
app.use(bodyParser.json());

app.use('/scrap/', metaDataRoute);
app.use('/scrap/', timetableRouter);

app.listen(3000, () => {
    console.log('app is running on port' + 3000);
});
