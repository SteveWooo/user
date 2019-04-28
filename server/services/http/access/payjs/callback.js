/*
* @param openid payjs会回调一个openid回来
* @param appid 透传一个appid回来
* @param bussiness_callback_url 业务原本的URL和参数
*/

//test url : 
//http://localhost:81/keke/api/access/payjs/callback?appid=test&openid=123&bussiness_callback_url=/
module.exports = {
	config : {
		path : '/keke/api/access/payjs/callback',
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

		var userid = await swc.objects.user.getWXUserid(swc, {
			openid : query.openid,
			appid : query.appid
		});

		// req.response.user_id = userid;
		var href = await swc.utils.base64.decode(swc, {
			base64String : query.bussiness_callback_url
		});

		if(href.indexOf('?') < 0){
			href = href + '?userid=' + userid;
		} else {
			href = href + '&userid=' + userid;
		}

		res.redirect(302, href);
		return ;
	}
}