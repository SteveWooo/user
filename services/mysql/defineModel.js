const Sequelize = require("sequelize");
exports.defineModel = async function defineModel(swc){
	swc.dao.models.users = swc.dao.seq.define("users", {
		openid : {type : Sequelize.STRING(32)},
		userid : {type : Sequelize.STRING(32)}, //唯一ID
		nick_name : {type : Sequelize.STRING()}, //昵称
		avatar_url : {type : Sequelize.STRING()}, //头像
		appid : {type : Sequelize.STRING(32)}, // 业务id

		token : {type : Sequelize.STRING(32)}, //用户登陆凭证

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})

	return swc;
}

exports.defineIndex = async function defineIndex(swc){
	// swc.dao.models.demos.belongsTo(swc.dao.models.admins, {
	// 	foreignKey : 'create_by', //多的一个数据实体
	// 	targetKey : 'admin_id', //少的一个数据实体
	// 	as : 'admin'
	// })
	swc.log.info('载入:数据索引');
	return swc;
}