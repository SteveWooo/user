/**
* options no param,直接原路返回swc
* )需要先定义数据模型，同步到数据库，才能定义索引关系
*/

const Sequelize = require("sequelize");
async function defineModel(swc){
	swc.dao.models.users = swc.dao.seq.define("users", {
		openid : {type : Sequelize.STRING(32)},
		user_id : {type : Sequelize.STRING(32)}, //唯一ID
		nick_name : {type : Sequelize.STRING()}, //昵称
		avatar_url : {type : Sequelize.STRING()}, //头像

		mobile : {type : Sequelize.TEXT()},
		name : {type : Sequelize.TEXT()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.dao.models.demos = swc.dao.seq.define("demos", {
		demo_id : {type : Sequelize.STRING(32)},
		name : {type : Sequelize.TEXT()},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})
	swc.dao.models.admins = swc.dao.seq.define("admins", {
		admin_id : {type : Sequelize.STRING(32)},
		account : {type : Sequelize.STRING()},
		password : {type : Sequelize.STRING(32)},
		name : {type : Sequelize.STRING},

		create_by : {type : Sequelize.STRING(32)},
		update_by : {type : Sequelize.STRING(32)},
		create_at : {type : Sequelize.STRING()},
		update_at : {type : Sequelize.STRING()},
	})

	return swc;
}

async function defineIndex(swc){
	swc.dao.models.demos.belongsTo(swc.dao.models.admins, {
		foreignKey : 'create_by', //多的一个数据实体
		targetKey : 'admin_id', //少的一个数据实体
		as : 'admin'
	})
	swc.log.info('载入:数据索引');
	return swc;
}

async function syncDatabase(swc){
	await swc.dao.seq.sync();
	swc.log.info('同步:数据库模型同步到数据库');
	return swc;
}

module.exports = async (swc, options)=>{
	swc = await defineModel(swc);
	swc.log.info('载入:数据库模型');
	if(swc.argv.syncdb === '1'){
		swc = await syncDatabase(swc);
	}
	swc = await defineIndex(swc);
	return swc;
}