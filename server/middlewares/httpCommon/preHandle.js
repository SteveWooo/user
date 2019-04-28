/**
* 前置请求定义，注入模型
* @param.config 业务配置
*/
module.exports = async (swc, options)=>{
	return async function(req, res, next){
		req.swc = swc;
		if(options.config.model){
			req.response = options.config.model;
		} else {
			req.response = {
				source : {
					wechat : {},
					admin : {},
				},
				responseHeaders : {},
				status : 2000,
				data : {},
				error_message : ''
			}
		}
		next();
	}
}