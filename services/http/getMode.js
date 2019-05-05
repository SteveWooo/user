/*
* @param 返回当前服务器环境
*/
module.exports = {
	config : {
		path : '/keke/api/p/mode/get',
		method : 'get',
		middlewares : ['authAdmin'],
		model : {
			status : 2000,
			mode : '',
			source : {}
		}
	},
	service : async (req, res, next)=>{
		req.response.mode = req.swc.mode;
		next();
	}
}