'use strict';
//获取数据库的引用
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id,
		type
	} = event
	// 定义一个空对象
	let matchObj = {} 
	// 如果type不是全部，则查询current为true的数据，如果为全部matchObj为{},默认查询所有数据
	if(type !== 'all'){
		matchObj = {
			current:true
		}
	}
	let userinfo = await db.collection('user').doc(user_id).get();
	userinfo = userinfo.data[0]
	// let label = await db.collection('label').get();
	let label = await db.collection('label')
		.aggregate()
		.addFields({
			current:$.in(['$_id',$.ifNull([userinfo.label_ids,[]])])
		})
		.match(matchObj)
		.end()
	//返回数据给客户端
	return {
		code: 200,
		mas: "数据请求成功",
		data: label.data
	}
};
