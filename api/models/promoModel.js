
//PLUGINS
var mongoose = require('mongoose')
var Schema = mongoose.Schema

const moment = require('moment')

// const Restriction = new Schema(
//         {
//             "@age": {  }
//         }
//     )

const PromoSchema = new Schema({
    name: { type: String, required: true, unique: true },
    avantage: { type: { percent: Number }, required: true },
    restrictions: {
        type: {
            "@or": Array,
            "@date": {
                after: String,
                before: String
            },
            "@meteo": {
                is: String,
                "temp": {
                    gt: { type: String, required: false },
                    lt: { type: String, required: false }
                }
            }
        }
    },
    creationDate: {
        type: String,
        default: moment().unix()
    }
});

module.exports = mongoose.model('Promo', PromoSchema)