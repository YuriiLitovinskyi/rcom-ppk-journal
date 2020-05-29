const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Json2csvParser = require('json2csv').Parser;
const prompts = require('prompts');
const Spinner = require('cli-spinner').Spinner;
const cliSelect = require('cli-select');
const chalk = require('chalk');

const message = require('./messages.js');
 
const spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');

const url = 'mongodb://localhost:27017/DBClientsPPK';


(() => {
    MongoClient.connect(url, async (err, db) => {
        if(err) {            
            console.log('No connection to Database! Please start MongoDB service on default port 27017!\n');                       
            
            console.log(err);
            await sleep(10000);           
        } else {
            console.log('Connected to database successfully!\n'); 

            (async () => {            
                const ppkNumber = await prompts({
                    type: 'number',
                    name: 'value',
                    message: 'Enter ppk number: ',
                    validate: value => value <= 0 || value > 100000 ? `Please enter a valid ppk number from 1 to 100000` : true
                });

                console.log('Choose format and press enter:');
                const valueSelect = await cliSelect({
                    values: ['txt', 'xlsx', 'html', 'docx'],
                    valueRenderer: (value, selected) => {
                        if (selected) {
                            return chalk.green(value);
                        }
                 
                        return value;
                    },
                });
               
                getPpkData(db, ppkNumber.value, valueSelect ? valueSelect.value : 'txt', async () => {       
                    console.log(`\nJournal file for ppk number ${ppkNumber.value} was created successfully!`)             
                    console.log('Application will be closed automatically in 10 seconds');

                    db.close();    
                    await sleep(10000);
                });
            })();
        };       
    });
})();

const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);        
    });
};

const getPpkData = (db, ppkNum, format, callback) => {
    db.collection('Journal', async (err, collection) => {
        if(err) {
            console.log(err);
            db.close();
            await sleep(10000);
        };              
        spinner.start(); 
        
        try {
            const ppkDataArr = await collection.find({ppk_num: ppkNum}, {_id: 0, enabled: 0}).toArray(async (err, data) => {
            if(err) {
                spinner.stop(true);
                console.log(err);
                db.close();
                await sleep(10000);
            }; 
            
            // convert date
            // ip combine with port ?
            // tabulation
            // id and line convert to text NOT ALL
            // excel ? html txt
            // progress bar

            if(data.length === 0){
                console.log('\nNo data found...');
                console.log('Application will be closed in 10 seconds!');
                spinner.stop(true);               
                db.close();
                await sleep(10000);
                return null;
            }

            data.forEach(ppkData => {             
                ppkData.date_time ? ppkData.date_time = convertUTCDateToLocalDate(new Date(ppkData.date_time.toLocaleString())) : null
                ppkData.id_msg = message.convertIdMessage(ppkData.id_msg);
                ppkData.line = message.convertLineMessage(ppkData.line, ppkData.model);
            });

            const json2csvParser = new Json2csvParser({ header: true, delimiter: '\t', quote: '' });
            const csvData = json2csvParser.parse(data);

            fs.writeFile(`PPK number ${ppkNum} journal.${format}`, csvData, "utf8", (err) => {
                if (err) throw err; 
                db.close();            
            });

            //console.log(data);
            spinner.stop(true);
            callback(); 
        });
            
        } catch (err) {
            spinner.stop(true);
            console.log(err);
            db.close();
            await sleep(10000);
        }
    
        
    });
    // spinner.stop(true);

    // console.log('\nppkDataArr.length', ppkDataArr.length);
    // callback();    
};

const convertUTCDateToLocalDate = (date) => {
    const newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);

    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;   
};


