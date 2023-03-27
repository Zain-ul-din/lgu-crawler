import express from 'express';
import metaDataRoute from './scrapper/meta_data';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use('/scrap/', metaDataRoute);

app.listen(3000, () => {
    console.log('app is running on port' + 3000);
});
