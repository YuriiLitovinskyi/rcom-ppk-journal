const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const Json2csvParser = require('json2csv').Parser;
const prompts = require('prompts');
const Spinner = require('cli-spinner').Spinner;
const cliSelect = require('cli-select');
const chalk = require('chalk');
const { jsonToHTMLTable, jsonToExcel } = require('nested-json-to-table');
const format = require("node.date-time");


const message = require('./messages.js');
const { convertIdMessage, convertLineMessage, enabledStatus } = message;
 
const spinner = new Spinner('processing.. %s');
spinner.setSpinnerString('|/-\\');

const url = 'mongodb://localhost:27017/DBClientsPPK';


(() => {
    MongoClient.connect(url, async (err, db) => {
        if(err) {            
            console.log(chalk.red('No connection to Database! Please start MongoDB service on default port 27017!\n'));                       
            
            console.log(err);
            await sleep(10000);           
        } else {
            console.log(chalk.green('Connected to database successfully!\n')); 

            (async () => {            
                const ppkNumber = await prompts({
                    type: 'number',
                    name: 'value',
                    message: 'Enter ppk number: ',
                    validate: value => value <= 0 || value > 100000 ? `Please enter a valid ppk number from 1 to 100000` : true
                });

                console.log('Choose format and press enter:');
                const valueSelect = await cliSelect({
                    values: ['txt', 'xlsx', 'html'],
                    valueRenderer: (value, selected) => {
                        if (selected) {
                            return chalk.black.bgYellow(value);
                        }                 
                        return value;
                    },
                });
               
                getPpkData(db, ppkNumber.value, valueSelect ? valueSelect.value : 'txt', async () => {       
                    console.log(`\nJournal file for ppk number ${ppkNumber.value} was created successfully!`)             
                    console.log(chalk.magenta('Application will be closed automatically in 10 seconds'));

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

const getPpkData = (db, ppkNum, formatDoc, callback) => {
    db.collection('Journal', async (err, collection) => {
        if(err) {
            console.log(err);
            db.close();
            await sleep(10000);
        };              
        spinner.start(); 
        
        try {
            await collection.find({ppk_num: ppkNum}, {_id: 0}).toArray(async (err, data) => {
                if(err) {
                    spinner.stop(true);
                    console.log(err);
                    db.close();
                    await sleep(10000);
                };             

                if(data.length === 0){
                    spinner.stop(true);
                    console.log('\nNo data found...');
                    console.log(chalk.magenta('Application will be closed in 10 seconds!'));                               
                    db.close();
                    await sleep(10000);
                    return null;
                };         

                data.forEach(ppkData => {            
                    ppkData.date_time ? ppkData.date_time = new Date(ppkData.date_time).format("Y-MM-dd HH:mm:SS") : '';             
                    ppkData.id_msg = convertIdMessage(ppkData.id_msg);
                    ppkData.line = convertLineMessage(ppkData.line, ppkData.model);
                    ppkData.enabled = enabledStatus(ppkData.enabled);
                });

                if(formatDoc === 'html'){            
                    const tableHTML = jsonToHTMLTable(data)

                    fs.writeFile(`PPK number ${ppkNum} journal.html`, tableHTML, "utf8", (err) => {
                        if (err) throw err; 
                        db.close();
                        spinner.stop(true); 
                        callback();           
                    });
                } else if(formatDoc === 'xlsx'){
                    const tableExcel = jsonToExcel(data);

                    fs.writeFile(`PPK number ${ppkNum} journal.xlsx`, tableExcel, "utf8", (err) => {
                        if (err) throw err; 
                        db.close();
                        spinner.stop(true); 
                        callback();           
                    });
                
                } else {
                    const fields = ['date_time', 'id_msg', 'line', 'enabled', 'model', 'ppk_num', 'address', 'port'];
                    const json2csvParser = new Json2csvParser({ fields, header: true, delimiter: '\t', quote: '' });
                    const csvData = json2csvParser.parse(data);
        
                    fs.writeFile(`PPK number ${ppkNum} journal.txt`, csvData, "utf8", (err) => {
                        if (err) throw err; 
                        db.close(); 
                        spinner.stop(true);  
                        callback();         
                    });
            }
        });
            
        } catch (err) {
            spinner.stop(true);
            console.log(err);
            db.close();
            await sleep(10000);
        }    
    });   
};

    
