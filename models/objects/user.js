const crypto = require('crypto');

/**
* @param openid
* @param appid
*/
exports.getWXUserid = async function(swc, options){
	if(!options.openid || !options.appid){
		throw await swc.Error(swc, {
			code : 4003,
			message : '缺少openid或者appid'
		});
		return ;
	}

	var source = [
		options.appid,
		options.openid,
		swc.config.server.public_salt
	].join('&');
	var userid = crypto.createHash('md5').update(source).digest('hex');
	return userid
}