/**
* 前置请求定义，注入模型
* @param.config 业务配置
*/
module.exports = async (swc, options)=>{
	return async function(req, res){
		try{
			if(req.responseType === 'json'){
				if(!req.responseHeaders || !('Content-Type' in req.responseHeaders)){
					res.header("Content-Type", "application/json; charset=utf-8")
				}
				for(var i in req.responseHeaders){
					res.header(i, req.responseHeaders[i]);
				}
				res.send(JSON.stringify(req.response));
				return ;
			}

			if(req.responseType === 'html'){
				//text/html;charset=UTF-8
				if(!req.responseHeaders || !('Content-Type' in req.responseHeaders)){
					res.header("Content-Type", "text/html;charset=UTF-8")
				}
				for(var i in req.responseHeaders){
					res.header(i, req.responseHeaders[i]);
				}
				res.send(req.response);
				return ;
			}
			
			res.sendStatus(200);
		}catch(e){
			console.log(e)
		}
	}
}