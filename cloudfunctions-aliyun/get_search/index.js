'use strict';
//获取数据库的引用
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id,
		value
	} = event;
	
	// 获取用户信息
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userinfo.data[0].article_likes_ids
	//聚合
	let list = await db.collection('article')
		.aggregate()
		//追加字段
		.addFields({
			is_like:$.in(['$_id',article_likes_ids])
		})
		.project({
			content: false
		})
		.match({
			title:new RegExp(value)
		})
		.end();
	//返回数据给客户端
	return {
		code: 200,
		msg: "数据请求成功",
		data: list.data
	}
};
