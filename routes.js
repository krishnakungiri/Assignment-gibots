
module.exports = (app) => {
    const {
        addUser,
        userdata,
        userReport
    } = require('./controller')
    //to add the user details to database
    app.post('/addUser', addUser)

    //to fetch the user report 
    app.get('/userdata', userdata)

    //to display the users summery on web page 
    app.get('/', userReport)
}