const mongoose = require('mongoose')
const Promo = mongoose.model('Promo')
const moment = require('moment')


var weatherCtrl = require('../controllers/weatherController');

//Route for creating promo code
const createCode = (req, res) => {
    const newPromoCode = new Promo(req.body)

    return newPromoCode.save().then(() => {
        res.status(200).json({
            success: true,
            code: createdPromo,
        })
    }).catch(error => {
        res.status(500).json({
            promocode_name: req.body.promocode_name,
            status: "denied",
            errorBody:error.errmsg
        })
    })
}

//Route for applying promo code
const validateCode = (req, res) => {
    const body = req.body
    let error = ''
    Promo.findOne({ name: req.body.promocode_name }).lean().then(savedPromo => {
        if (savedPromo) {
            weatherCtrl.getWeather(body.arguments.meteo.town).then(weatherData => {
                if (rules(weatherData, savedPromo.restrictions, body)) {
                    console.log(`\n\n\n\n${rules(weatherData, savedPromo.restrictions, body)} \n\n\n\n`)
                    res.status(200).json({
                        promocode_name: req.body.promocode_name,
                        status: "accepted",
                        avantage: savedPromo.avantage
                    })
                } else {
                    res.status(500).json({
                        promocode_name: req.body.promocode_name,
                        status: "denied",
                        error
                    })
                }
            })
        } else throw ('Couldn\'t find Promo code')
    }).catch(error => {
        res.status(500).json({
            promocode_name: req.body.promocode_name,
            status: "denied",
            error
        })

    })

}
// Rudimentary rules engine
const rules = (weather, savedPromo, arguments) => {
    try {

        let orRules
        let orRulesResultList = []
        let orRulesResult

        let andRules
        let andRulesResultList = []
        let andRulesResult

        let datesOk


        const currentTemp = weather.main.temp
        const currentWeather = weather.weather[0].main.toLowerCase()
        const currentDate = moment().unix()
        const reg = /cloud/gmi

        let targetTemp
        let targetWeather
        let targetAge
        let targetDates

        if (arguments.age) targetAge = arguments.age

        if (savedPromo['@or']) orRules = savedPromo['@or']
        if (savedPromo['@and']) orRules = savedPromo['@and']

        if (savedPromo['@date']) {
            targetDates = {
                before: moment(savedPromo['@date'].before).unix(),
                after: moment(savedPromo['@date'].after).unix(),
            }
        }

        if (savedPromo['@meteo'].is) targetWeather = savedPromo['@meteo'].is
        if (savedPromo['@meteo'].temp) targetTemp = savedPromo['@meteo'].temp

        if (orRules.length !== 0) {
            orRules.forEach(item => {
                switch (item) {
                    case '@age':
                        if (item['@age']) {
                            for (let key of item['@age']) {
                                switch (key) {
                                    case 'eq':
                                        if (targetAge === item['@age'].eq) orRulesResultList.push(true)
                                        else orRulesResultList.push(false)
                                        break
                                    case 'lt':
                                        if (targetAge < item['@age'].eq) orRulesResultList.push(true)
                                        else orRulesResultList.push(false)
                                        break
                                    case 'gt':
                                        if (targetAge > item['@age'].eq) orRulesResultList.push(true)
                                        else orRulesResultList.push(false)

                                        break
                                }
                            }
                        }
                }
            })
            if (orRulesResultList.includes(true)) orRulesResult = true
            else orRulesResult = false
        }
        if (andRules.length !== 0) {
            andRules.forEach(item => {
                switch (item) {
                    case '@age':
                        if (item['@age']) {
                            for (let key of item['@age']) {
                                switch (key) {
                                    case 'eq':
                                        if (targetAge === item['@age'].eq) andRulesResultList.push(true)
                                        else andRulesResultList.push(false)
                                        break
                                    case 'lt':
                                        if (targetAge < item['@age'].eq) andRulesResultList.push(true)
                                        else andRulesResultList.push(false)
                                        break
                                    case 'gt':
                                        if (targetAge > item['@age'].eq) andRulesResultList.push(true)
                                        else andRulesResultList.push(false)

                                        break
                                }
                            }
                        }
                }
            })
            if (orRulesResultList.includes(false)) orRulesResult = false
            else orRulesResult = true
        }

        if (
            currentTemp > targetTemp &&
            reg.test(currentWeather) &&
            (!orRulesResult || orRulesResult === true) &&
            (!andRulesResult || andRulesResult === true)
        ) {
            return true
        } else return false

    } catch (error) {
        console.log(error)
        return false

    }
}



module.exports = {
    createCode,
    validateCode
}
