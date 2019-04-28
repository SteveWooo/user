/*
* @param appid 业务id
* @param sign 业务签名（暂时先不用，感觉作用不大）
* @param bussiness_callback_url 业务回调页面地址（最好直接拿业务页面本身咯）
* 验证appid后，让客户端跳转到payjs页面获取openid，回调给/access/payjs/callback页面。
*/
module.exports = {
	config : {
		path : '/keke/page/access/bussiness/token',
		method : 'get',
		middlewares : [],
		model : {
			status : 2000,
			mode : '',
			source : {}
		}
	},
	service : async (req, res, next)=>{
		var swc = req.swc;
		var query = req.query;

		if(!query.appid || !query.bussiness_callback_url) {
			//这里可以替换成页面
			req.response = await swc.Error(swc, {
				code : 4005,
				message : '缺少appid或callback_url'
			});
			next();
			return ;
		}

		/**
		* 先把业务回调转成base64，防止中途丢失参数
		*/
		query.bussiness_callback_url = await swc.utils.base64.encode(swc, {
			string : query.bussiness_callback_url
		})

		/**
		* 这里就是通过服务端添加一个mchid
		* 然后让payjs回调给隔壁的/access/payjs/callback
		*/
		var payjsCallbackUrl = `${swc.config.payjs.callback_url_head}/keke/api/access/payjs/callback?bussiness_callback_url=${query.bussiness_callback_url}&appid=${query.appid}`;
		var href = `https://payjs.cn/api/openid?mchid=${swc.config.payjs.mchid}&callback_url=${payjsCallbackUrl}`;

		res.redirect(302, href);
		return ;
	}
}