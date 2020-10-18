'use strict';
//获取数据库的引用
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id,
		name,
		page = 1,
		pageSize = 10
	} = event;
	let macthObj = {};
	if (name !== '全部') {
		macthObj = {
			classify: name
		}
	}
	
	// 获取用户信息
	const userinfo = await db.collection('user').doc(user_id).get()
	const article_likes_ids = userinfo.data[0].article_likes_ids
	//聚合
	let list = await db.collection('article')
		.aggregate()
		//追加字段
		.addFields({
			//文章的id是否被你的收藏 在article_likes_ids中查询判断
			is_like:$.in(['$_id',article_likes_ids])
		})
		.match(macthObj)
		.project({
			content: false
		})
		//要跳过多少数据
		.skip(pageSize * (page - 1))
		.limit(pageSize)
		.end();
	//返回数据给客户端
	return {
		code: 200,
		msg: "数据请求成功",
		data: list.data
	}
};
