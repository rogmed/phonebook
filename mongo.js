const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://rogeliomdn:${password}@cluster0.q3gg1qn.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
const connection = mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
    console.log('Phonebook:');
    connection.then(() => {
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
        })
    });
}

if (process.argv.length > 3) {
    const newName = process.argv[3];
    const newNumber = process.argv[4] || '';

    const person = new Person({
        name: newName,
        number: newNumber
    });
    
    connection.then(() => {
        person.save().then(result => {
            console.log(`Added ${result.name} number ${result.number} to phonebook.`);
            mongoose.connection.close();
        })
    })
}
