/**
* options no param,直接原路返回swc
* )需要先定义数据模型，同步到数据库，才能定义索引关系
*/

const Sequelize = require("sequelize");
async function defineModel(swc){
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

	/***************************************************************************
	** 表情素材部分
	*
	*/
	/**
	* 表情原图表，也就是对应每个表情包库的item
	*/
	// swc.dao.models.origin_stickers = swc.dao.seq.define("origin_stickers", {
	// 	origin_sticker_id : {type : Sequelize.STRING(32)},
	// 	sticker_category_id : {type : Sequelize.STRING(32)}, //所属分类
	// 	default_info : {type : Sequelize.TEXT}, //图片在这里面，info类必须都是个json数组。图片是在解析时才用到，其他时候无关

	// 	create_by : {type : Sequelize.STRING(32)},
	// 	update_by : {type : Sequelize.STRING(32)},
	// 	create_at : {type : Sequelize.STRING()},
	// 	update_at : {type : Sequelize.STRING()},
	// })

	// /**
	// * 表情库分类
	// */
	// swc.dao.models.sticker_categories = swc.dao.seq.define("sticker_categories", {
	// 	sticker_category_id : {type : Sequelize.STRING(32)},
	// 	title : {type : Sequelize.TEXT},
	// 	description : {type : Sequelize.TEXT},
	// 	icon_url : {type : Sequelize.TEXT}, //原图分类的图标url

	// 	create_by : {type : Sequelize.STRING(32)},
	// 	update_by : {type : Sequelize.STRING(32)},
	// 	create_at : {type : Sequelize.STRING()},
	// 	update_at : {type : Sequelize.STRING()},
	// })

	// *
	// * 具体用户创建的表情包。
	
	// swc.dao.models.stickers = swc.dao.seq.define("stickers", {
	// 	sticker_id : {type : Sequelize.STRING(32)},
	// 	info : {type : Sequelize.TEXT}, //表情包的内容。必须是个json数组。默认拿0游标位

	// 	create_by : {type : Sequelize.STRING(32)},
	// 	update_by : {type : Sequelize.STRING(32)},
	// 	create_at : {type : Sequelize.STRING()},
	// 	update_at : {type : Sequelize.STRING()},
	// })

	// /***************************************************************************
	// ** 内容部分
	// *
	// */
	// /**
	// * 主题分类
	// */
	// swc.dao.models.theme_categories = swc.dao.seq.define("theme_categories", {
	// 	theme_category_id : {type : Sequelize.STRING(32)},
	// 	title : {type : Sequelize.TEXT},
	// 	description : {type : Sequelize.TEXT},
	// 	icon_url : {type : Sequelize.TEXT}, //原图分类的图标url

	// 	create_by : {type : Sequelize.STRING(32)},
	// 	update_by : {type : Sequelize.STRING(32)},
	// 	create_at : {type : Sequelize.STRING()},
	// 	update_at : {type : Sequelize.STRING()},
	// })

	// swc.dao.models.demos = swc.dao.seq.define("demos", {
	// 	demo_id : {type : Sequelize.STRING(32)},
	// 	name : {type : Sequelize.TEXT()},

	// 	create_by : {type : Sequelize.STRING(32)},
	// 	update_by : {type : Sequelize.STRING(32)},
	// 	create_at : {type : Sequelize.STRING()},
	// 	update_at : {type : Sequelize.STRING()},
	// })
	// swc.dao.models.admins = swc.dao.seq.define("admins", {
	// 	admin_id : {type : Sequelize.STRING(32)},
	// 	account : {type : Sequelize.STRING()},
	// 	password : {type : Sequelize.STRING(32)},
	// 	name : {type : Sequelize.STRING},

	// 	create_by : {type : Sequelize.STRING(32)},
	// 	update_by : {type : Sequelize.STRING(32)},
	// 	create_at : {type : Sequelize.STRING()},
	// 	update_at : {type : Sequelize.STRING()},
	// })

	return swc;
}

async function defineIndex(swc){
	// swc.dao.models.demos.belongsTo(swc.dao.models.admins, {
	// 	foreignKey : 'create_by', //多的一个数据实体
	// 	targetKey : 'admin_id', //少的一个数据实体
	// 	as : 'admin'
	// })
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
	if(swc.argv.d === '1'){
		swc = await syncDatabase(swc);
	}
	swc = await defineIndex(swc);
	return swc;
}