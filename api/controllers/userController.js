// 'use strict'

const mongoose = require('mongoose')


const User = mongoose.model('User')

const jwt = require('jsonwebtoken')

const secret = require('../config/credentials')



const createUser = (req, res) => {
    const user = req.body

    console.warn(`CALL TO CREATE USER. BODY ${JSON.stringify(req.body)}`)


    if (!user.email) {
        return res.status(500).json({
            errors: {
                email: 'is required'
            }
        })
    }
    User.findOne({ "email": user.email }).lean().then(alreadySaved => {
        if (alreadySaved) {
            return res.status(400).json({
                errors: {
                    message: 'User already exists.'
                }
            })
        }

        if (!user.username) {
            return res.status(500).json({
                errors: {
                    username: 'is required'
                }
            })
        }

        if (!user.birthday) {
            return res.status(500).json({
                errors: {
                    birthday: 'is required'
                }
            })
        }
        const finalUser = new User(user)

        return finalUser.save().then((newUser) => {
            const token = jwt.sign({ userId: newUser._id }, secret.crypto, { expiresIn: '24h' })
            res.json({
                success: true,
                user: { userId: newUser._id, username: newUser.username, movies: newUser.movies },
                token: token
            })
        })
    })
}

const loginUser = (req, res, next) => {
    const user = req.body

    console.warn(`CALL TO LOG THE USER IN. BODY ${JSON.stringify(req.body)}`)


    if (!user.email) {
        return res.status(500).json({
            errors: {
                email: 'is required'
            }
        })
    }
    if (!user.password) {
        return res.status(500).json({
            errors: {
                email: 'is required'
            }
        })
    }

    User.findOne({ email: user.email.toLowerCase() }).then(userProfile => {
        if (!userProfile) {
            return res.status(500).json({
                errors: {
                    user: 'not found'
                }
            })
        }
        const validPassword = userProfile.comparePassword(user.password)
        if (!validPassword) {
            return res.status(500).json({
                errors: {
                    password: 'wrong'
                }
            })
        }
        const token = jwt.sign({ userId: userProfile._id }, secret.crypto, { expiresIn: '24h' })
        res.json({
            success: true,
            user: { userId: userProfile._id, username: userProfile.username, movies: userProfile.movies },
            token: token
        })
    })

}

const vote = (req, res) => {
    const userId = req.body.userId
    const movieId = req.body.movieId
    let vote = req.body.vote

    //switching value to string, due to truthy/falsy nature of 1 and 0 in JS
    switch (vote) {
        case 0:
            vote = 'down'
            break
        case 1:
            vote: 'up'
            break
    }

    if (!movieId) {
        return res.status(500).json({
            errors: {
                movieId: 'required'
            }
        })
    }
    if (!userId) {
        return res.status(500).json({
            errors: {
                userId: 'required'
            }
        })
    }
    if (!vote) {
        return res.status(500).json({
            errors: {
                vote: 'required'
            }
        })
    }
    User.findById(userId).lean().then(user => {
        if (!user) {
            return res.status(404).json("No user found")
        }
        if (vote === 'up' && user.movies && user.movies.length === 3) {
            return res.status(500).json({
                errors: {
                    message: `You have already voted for three movies.`
                }
            })
        }
        if (vote === 'up' && (user.movies.find(result => result._id === movieId))) {
            res.status(500).json({
                error: {
                    message: `You have already voted on this movie.`
                }
            })
        } else {
            Movie.findById(movieId).lean().then(movie => {
                if (!movie) {
                    return res.status(404).json("No movie found")
                }
                if (vote === 1) {
                    movie.score++
                    if (!movie.upvoters) movie['upvoters'] = []
                    movie['upvoters'].push(user.username)
                    user.movies.push(movie)
                } else if (vote === 'down' && movie.score > 0) {
                    if (!movie.upvoters) movie['upvoters'] = []
                    movie.score--
                    movie['upvoters'] = movie['upvoters'].filter(item => item !== user.username)
                    user.movies = user.movies.filter(item => item._id !== movie._id)
                }
                User.findOneAndUpdate({ _id: user._id }, user, { new: true }).lean().then(updatedUser => {
                    Movie.findOneAndUpdate({ _id: movie._id }, movie, { new: true }).lean().then(updatedMovie => {
                        res.status(200).json({
                            message: `User ${user.username} has voted on ${movie.Title}. Its new score is ${updatedMovie.score}`,
                            user: { userId: updatedUser._id, username: updatedUser.username, movies: updatedUser.movies },
                            movie: updatedMovie
                        })
                    })
                })
            })
        }
    })
}

module.exports = {
    createUser,
    vote,
    loginUser,
}







