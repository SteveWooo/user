/**
* @param swc_session，微信前端用户唯一标识
*/

async function auth(req, res, next){
	var query;
	if(req.method == "GET"){
		query = req.query
	} else {
		query = req.body;
	}
	
	next();
}

module.exports = auth;