/*
* @param token 用户token
* 验证appid后，让客户端跳转到payjs页面获取openid，回调给/access/payjs/callback页面。
*/
module.exports = {
	config : {
		path : '/api/access/bussiness/user_token',
		method : 'get',
		middlewares : ['authBussiness'],
		model : {
			status : 2000,
			user : ''
		}
	},
	service : async (req, res, next)=>{
		var swc = req.swc;
		var query = req.query;
		if(!query.token){
			req.response = await swc.Error(swc, {
				code : 4005,
				message : '缺少token参数'
			});
			next();
			return ;
		}

		var user = await swc.dao.models.users.findAndCountAll({
			where : {
				token : query.token
			}
		})

		if(user.count == 0){
			req.response = await swc.Error(swc, {
				code : 4007,
				message : 'token无效'
			});
			next();
		}

		req.response.user = user.rows[0];
		
		next();
		return ;
	}
}