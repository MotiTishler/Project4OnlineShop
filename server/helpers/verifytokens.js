const jwt = require('jsonwebtoken')

module.exports = {
	onlyAdmins: (req, res, next) => {
		jwt.verify(
			req.headers['authorization'],
			process.env.TOKEN_SECRET,
			(error, payload) => {
				if (error) {
					res.status(401).json({ err: true, error })
				} else {
					//console.log(payload)
					if (!payload.is_admin) {
						res.status(401).json({ err: true, msg:'admin only!' })
					} else {
						req.user = payload
						next()
					}
				}
			}
		)
	},
	onlyUsers: (req, res, next) => {
		//console.log(req.headers)
		jwt.verify(
			req.headers['authorization'],
			process.env.TOKEN_SECRET,
			(error, payload) => {
				if (error) {
					console.log('Error at onlyUsers->verify')
					console.log(error)
					res.status(401).json({ err: true, error })
				} else {
					//console.log(payload)
					if (payload.is_admin) {
						res.status(401).json({ err: true, msg:"admin can't do that!" })
					} else {
						req.user = payload
						next()
					}
				}
			}
		)
	},
	hasToken: (req, res, next) => {
		jwt.verify(
			req.headers['authorization'],
			process.env.TOKEN_SECRET,
			(error, payload) => {
				if (error) {
					res.status(401).json({ err: true, error })
				} else {
					req.user = payload
					next()
				}
			}
		)
	},
}
