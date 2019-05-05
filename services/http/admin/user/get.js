module.exports = {
	config : {
		path : '/api/w/user/get',
		method : 'get',
		middlewares : ['authAdmin'],
		model : {
			status : 2000,
			source : {},
		}
	},
	service : async function(req, res, next){
		next();
	}
}