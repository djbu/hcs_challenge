const mongodb = require('mongodb'); 
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://dajobeuz:eiB3bZqI2bclH1Pd@hcs.tcgbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const csv = require('csv-parser');
const fs = require('fs');

describe('Automaton and Test Suite', () => {

    test('Verify the data in flat file matches the data in Patients collection.', () => {
        let patientsData = [];

        fs.createReadStream('patients.csv')
        .pipe(csv({ separator: '|' }))
        .on('data', (data) => patientsData.push(data))
        .on('end', () => {
            MongoClient.connect(url).then(result => {
                
                let dbObject = result.db("challenge");
                dbObject.collection("Patients").find({}).toArray((error, resultPatients) => {
                    if (error) throw error;
                    result.close();
                    expect(resultPatients).toEqual(patientsData);
                    
                });

               
            }).catch(error => {
                throw error;
            });         
        });
    });

    test('Verify Emails were created in Emails Collection for patients who have CONSENT as Y.', () => {
        MongoClient.connect(url).then(result => {
            let dbObject = result.db("challenge");
            let totalEmails = 0;
            let totalPatientsTimesFour = 0;
            dbObject.collection("Patients").find({'CONSENT' : {$eq: 'Y' }}).toArray((err, resultPatients) => {
                if (err) throw err;
                totalPatientsTimesFour = resultPatients.length * 4;
            });

            dbObject.collection("Emails").find({}).toArray((err2, resultEmails) => {
                if (err2) throw err2;
                totalEmails = resultEmails.length;
             });

             result.close();

             expect(totalPatientsTimesFour).toEqual(totalEmails);
           
           
        }).catch(error => {
            throw error;
        });
    });

    test('Verify emails for each patient are scheduled correctly.', () => {
      MongoClient.connect(url).then(result => {
        let dbObject = result.db("challenge");
        dbObject.collection("Emails").find({}, { projection: { _id: 0, 'scheduled_date': 1 } }).toArray((error, resultDates) => {
          if (error) throw error;
          result.close();
         
          let formattedDates = resultDates.map(date => {
            let splittedDate = date['scheduled_date'].split('-');
            return splittedDate[2];
          });
          
          let curDate = new Date();
          let expectedDates = [
            (curDate.getDate() + 1).toString(),
            (curDate.getDate() + 2).toString(),
            (curDate.getDate() + 3).toString(),
            (curDate.getDate() + 4).toString(),
          ];

          expect(formattedDates).toEqual(
            expect.arrayContaining(expectedDates),
          );

        });

      }).catch(error => {
        throw error
      });
       
    });

});
