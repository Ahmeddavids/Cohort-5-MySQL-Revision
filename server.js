const express = require('express');
const sequelize = require('./database/sequelize');
const userRouter = require('./routes/userRouter');
const libraryRouter = require('./routes/libraryRouter');

const PORT = 1042;
const app = express();
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/book', libraryRouter);

app.use('/', (req, res) => {
    res.send('Welcome Cohort 5 revision Class')
})

app.use((error, req, res, next) => {
    if(error){
       return res.status(400).json({message:  error.message})
    }
    next()
})

const server = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
};

server();

app.listen(PORT, () => {
    console.log(`Server is listening to PORT: ${PORT}`)
});
