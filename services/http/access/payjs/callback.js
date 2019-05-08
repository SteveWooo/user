/*
* @param openid payjs会回调一个openid回来
* @param appid 透传一个appid回来
* @param bussiness_callback_url 业务原本的URL和参数
*/
const crypto = require('crypto');
/**
* @param userid
* @param openid
* @param token
* @param now
*/
async function updateUserToken(swc, options){
	var user = await swc.dao.models.users.findAndCountAll({
		where : {
			userid : options.userid,
			appid : options.appid
		}
	})

	if(user.count == 0){
		//创建用户
		var user = {
			openid : 'none',
			userid : options.userid,
			token : options.token,
			appid : options.appid,

			create_at : options.now,
			update_at : options.now,
			create_by : 'self',
			update_by : 'self'
		}

		var result = await swc.dao.models.users.create(user);
		return result;
	} else {
		user.rows[0].update({
			update_at : options.now,
			token : options.token
		})
		return user.rows[0];
	}
}

/**
* @param userid
* @param appid
* @param now
*/
async function createUserToken(swc, options){
	var source = [
		options.appid,
		options.now,
		options.userid,
		swc.config.server.public_salt,
	].join('&');

	var userToken = crypto.createHash('md5').update(source).digest('hex');
	return userToken;
}

/**
* @param openid
* @param bussiness_callback_url
* @param appid
*/
module.exports = {
	config : {
		path : '/api/access/payjs/callback',
		method : 'get',
		middlewares : [],
		model : {
			status : 2000,
			user_id : ''
		}
	},
	service : async (req, res, next)=>{
		var swc = req.swc;
		var query = req.query;
		
		if(!query.appid || !query.bussiness_callback_url){
			req.response = await swc.Error(swc, {
				code : 4005
			});
			next();
			return ;
		}

		if(!(query.appid in swc.config.bussiness.apps)){
			req.response = await swc.Error(swc, {
				code : 4006
			});
			next();
			return ;
		}

		var now = +new Date();
		//生成用户id
		var userid = await swc.models.user.getWXUserid(swc, {
			openid : query.openid,
			appid : query.appid
		});

		//生成用户token
		var userToken = await createUserToken(swc, {
			openid : query.openid,
			userid : userid,
			now : now,
		});

		//更新用户token
		var user ;
		try{
			user = await updateUserToken(swc, {
				openid : query.openid,
				appid : query.appid,
				userid : userid,
				token : userToken,
				now : now
			});
		}catch(e){
			console.log(e);
			req.response.message = e.message;
			next();
			return ;
		}

		//出口，重定向回业务回调页面去。
		var href = await swc.utils.base64.decode(swc, {
			base64String : query.bussiness_callback_url
		});

		if(href.indexOf('?') < 0){
			href = href + '?token=' + userToken;
		} else {
			href = href + '&token=' + userToken;
		}

		res.redirect(302, href);
		return ;
	}
}