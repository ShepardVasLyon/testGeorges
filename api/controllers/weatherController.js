const mongoose = require('mongoose')
const Promo = mongoose.model('Promo')

const rp = require('request-promise')


const getWeather = (cityname) => {
    let options = {
        uri: 'https://api.openweathermap.org/data/2.5/weather?q=' + cityname + '&units=metric&appid=d0562f476913da692a065c608d0539f6',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    return rp.get(options)
}


module.exports = {
    getWeather
}