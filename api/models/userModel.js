
//PLUGINS
var mongoose = require('mongoose')
var Schema = mongoose.Schema

const moment = require('moment')
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    birthday: String,
    movies: [Object],
    creationDate: {
        type: String,
        default: moment().unix()
    }
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('password'))
        return next()   

    bcrypt.hash(this.password, null, null, (err, hash) => {
        if (err) return next(err)
        this.password = hash
        next()
    })
})

UserSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)