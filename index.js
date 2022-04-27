const mongodb = require('mongodb');
const var_dump = require('var_dump');
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://dajobeuz:eiB3bZqI2bclH1Pd@hcs.tcgbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const csv = require('csv-parser');
const fs = require('fs');

let patientsData = [];
let emails = [];
let emailList = [];

fs.createReadStream('patients.csv')
    .pipe(csv({ separator: '|' }))
    .on('data', (data) => patientsData.push(data))
    .on('end', () => {

        let curDate = new Date();
        patientsData.filter(patient => { return patient["CONSENT"] === "Y"}).forEach(filteredPatient => {

            emails.push({
                'Name': "Day 1",
                'scheduled_date': curDate.getFullYear() + '-' + curDate.getMonth() + '-' + (curDate.getDate() + 1),
                'email': filteredPatient['Email Address']
            },
            {
                'Name': "Day 2",
                'scheduled_date': curDate.getFullYear() + '-' + curDate.getMonth() + '-' + (curDate.getDate() + 2),
                'email': filteredPatient['Email Address']
            },
            {
                'Name': "Day 3",
                'scheduled_date': curDate.getFullYear() + '-' + curDate.getMonth() + '-' + (curDate.getDate() + 3),
                'email': filteredPatient['Email Address']
            },
            {
                    'Name': "Day 4",
                    'scheduled_date': curDate.getFullYear() + '-' + curDate.getMonth() + '-' + (curDate.getDate() + 4),
                    'email': filteredPatient['Email Address']
            });

        });


        //loading patient data
        MongoClient.connect(url).then(result => {
            var dbo = result.db("challenge");
            dbo.collection("Patients").insertMany(patientsData, (err, res) => {
              if (err) throw err;
              console.log(res.insertedCount);
              result.close();
            });
        }).catch(err => {
            console.log(err);
        });
      
        //loading email data
        MongoClient.connect(url).then(result => {
            var dbObject = result.db("challenge");
            dbObject.collection("Emails").insertMany(emails, (err, res) => {
                if (err) throw err;
                console.log(res.insertedCount);
                result.close();
            });

        }).catch(err => {
            console.log(err)
        });
         
});

