const request = require('request')
const User = require('./models/user.model')

exports.addUser = (req, res) => {
    try {
        request('https://randomuser.me/api', { json: true }, (err, body) => {
            if (err) {
                return console.log(err);
            } else {
                let data = body.body.results[0]
                const user = new User({
                    gender: data.gender,
                    name: data.name,
                    location: data.location,
                    email: data.email,
                    login: data.login,
                    dob: data.dob,
                    registered: data.registered,
                    phone: data.phone,
                    cell: data.cell,
                    id: data.id,
                    picture: data.picture,
                    nat: data.nat,
                });
                user.save()
                    .then(response => {
                        res.status(200).send({ status: true, message: "User added", data: response })
                    })
            }
        });
    } catch (err) {
        res.status(500).send({ status: false, message: "Error", errorMessage: err })
    }
}

exports.userdata = async (req, res) => {
    try {
        var userInfo = await User.aggregate([
            {
                "$project": {
                    "age": "$dob.age",
                    "gender": "$gender",
                    nat: "$nat",
                }
            }, {
                "$group": {
                    _id: {
                        nat: "$nat",
                        age: {
                            "$concat": [
                                { "$cond": [{ "$and": [{ "$gte": ["$age", 0] }, { "$lt": ["$age", 30] }] }, "zerothirty", ""] },
                                { "$cond": [{ "$and": [{ "$gte": ["$age", 30] }, { "$lt": ["$age", 50] }] }, "thirtyfifty", ""] },
                                { "$cond": [{ "$gte": ["$age", 50] }, "overfifty", ""] },
                            ]
                        }, gender: {
                            "$concat": [
                                { "$cond": [{ "$eq": ["$gender", "male"] }, "male", ""] },
                                { "$cond": [{ "$eq": ["$gender", "female"] }, "female", ""] }
                            ]
                        }
                    },
                    count: { $sum: 1 }
                }
            }])
        var male = []
        var female = []
        if (userInfo.length > 0) {
            userInfo.forEach(element => {
                var json = {
                    nat: '',
                    'zerothirty': 0,
                    'thirtyfifty': 0,
                    'overfifty': 0
                }
                if (element._id.gender == 'male') {
                    if (element._id.age == 'zerothirty') {
                        json['nat'] = element._id.nat
                        json['zerothirty'] = element.count
                    } else if (element._id.age == 'thirtyfifty') {
                        json['nat'] = element._id.nat
                        json['thirtyfifty'] = element.count
                    } else {
                        json['nat'] = element._id.nat
                        json['overfifty'] = element.count
                    }
                    male.push(json)
                } else {
                    if (element._id.age == 'zerothirty') {
                        json['nat'] = element._id.nat
                        json['zerothirty'] = element.count
                    } else if (element._id.age == 'thirtyfifty') {
                        json['nat'] = element._id.nat
                        json['thirtyfifty'] = element.count
                    } else {
                        json['nat'] = element._id.nat
                        json['overfifty'] = element.count
                    }
                    female.push(json)
                }
            });
        } else {
            res.status(200).send({ status: true, message: "Users report", data: { male, female } })
        }
        res.status(200).send({ status: true, message: "Users report", data: { male, female } })
    }
    catch (err) {
        res.status(500).send({ status: false, message: "Error", errorMessage: err })
    }
}

exports.userReport = (req, res) => {
    try {
        request('http://localhost:3000/userdata', { json: true }, (err, body) => {
            if (err) {
                res.status(500).send({ status: false, message: "Error", errorMessage: err })
            } else {
                res.render('index', { male: body.body.data.male, female: body.body.data.male })
            }
        })
    } catch (err) {
        res.status(500).send({ status: false, message: "Error", errorMessage: err })
    }
}

