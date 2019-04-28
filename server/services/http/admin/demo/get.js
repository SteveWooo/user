/*
* @param page item_per_page | order_id
*/
const crypto = require("crypto");
module.exports = {
	config : {
		path : '/keke/api/m/demo/get',
		method : 'get',
		middlewares : [],
		model : {
			status : 2000,
			error_message : '',
			data : {}
		}
	},
	service : async (req, res, next)=>{
		var query = req.query;
		var swc = req.swc;

		if(query.order_id && query.order_id.length == 32){
			var result = await swc.dao.models.demos.findAndCountAll({
				where : {
					order_id : query.order_id
				}
			})

			if(result.count == 0){
				req.response.status = 4004;
				req.response.error_message = "找不到该通知";
				next();
				return ;
			}

			req.response.data = result;
			next();
			return ;
		}

		if(!query.item_per_page){
			query.item_per_page = 10;
		}

		if(!query.page){
			query.page = 1;
		}

		if(parseInt(query.page) != query.page || parseInt(query.item_per_page) != query.item_per_page){
			req.response.status = 4005;
			req.response.error_message = "参数错误:page or item_per_page";
			next();
			return ;
		}
		query.item_per_page = parseInt(query.item_per_page);
		var condition = {};

		if(query.status && (query.status == 1 || query.status ==2 || query.status == 3)){
			condition.status = query.status;
		}

		if(query.status == 13){
			condition.status = {
				[swc.dao.seq.Op.or] : ['1', '3'], //待评价或已完成
			};
		}

		try{
			var result = await swc.dao.models.demos.findAndCountAll({
				where : condition,
				include : [{
					as : "admin",
					model : swc.dao.models.admins
				}],
				order : [["create_at", "DESC"]],
				limit : query.item_per_page,
				offset : (query.page - 1) * query.item_per_page
			})

			req.response.data = result;

			next();
		}catch(e){
			req.response.status = 5000;
			req.response.error_message = e.message;
			next();
			return ;
		}
	}
}