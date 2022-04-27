const mongodb = require('mongodb'); 
const MongoClient = mongodb.MongoClient;
const url = 'mongodb+srv://dajobeuz:eiB3bZqI2bclH1Pd@hcs.tcgbp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

MongoClient.connect(url).then(result => {
    let dbObject = result.db("challenge");
    dbObject.collection("Patients").find({ 'First Name': {$eq: ''} }).toArray((error, resultPatients) => {
        let idsFirstNamMeMissing = resultPatients.map(element => {
            return element._id
        }).join(', ');
        result.close();
        console.info('Print ID were first name is empty', idsFirstNamMeMissing);
    });
}).catch(error => {
    throw error;
}); 

MongoClient.connect(url).then(result  => {
        
    let dbObject = result.db("challenge");
    dbObject.collection("Patients").find({ 'Email Address': {$eq: ''} }, { 'CONSENT': {$eq: 'Y'} } ).toArray((error, resultPatients) => {
    if (error) throw error;
    let idWithNoEmailButConsent = resultPatients.map(element => {
        return element._id
    }).join(', ');

    console.info('Priting ID with no email but consent is Y: ', idWithNoEmailButConsent);
    result.close();
});
}).catch(error => {
    throw error;
});

