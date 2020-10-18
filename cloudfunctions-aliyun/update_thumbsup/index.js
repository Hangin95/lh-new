'use strict';
const db = uniCloud.database()
const dbCmd = db.command
exports.main = async (event, context) => {
	const {
		user_id,
		article_id
	} = event
	const user =await db.collection('user').doc(user_id).get()
	const thumbs_up_article_ids = user.data[0].thumbs_up_article_ids
	
	
	let thumbs_ids = null
	let thumbs_up_count = null
	
	//判断用户点赞列表里是否存在该文章 如有则取消，否则点赞
	if (thumbs_up_article_ids.includes(article_id)) {
		thumbs_ids = dbCmd.pull(article_id)
		//点赞次数-1
		thumbs_up_count = dbCmd.inc(-1)
	} else {
		thumbs_ids = dbCmd.addToSet(article_id)
		//点赞次数+1
		thumbs_up_count = dbCmd.inc(1)
	}
	//更新用户点赞列表
	await db.collection('user').doc(user_id).update({
		thumbs_up_article_ids: thumbs_ids
	})
	//更新文章点赞次数
	await db.collection('article').doc(article_id).update({
		thumbs_up_count: thumbs_up_count
	})
	//返回数据给客户端
	return {
		code:200,
		msg:'数据更新成功'
	}
};
