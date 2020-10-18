'use strict';
const db = uniCloud.database();
const dbCmd = db.command
exports.main = async (event, context) => {
	//event为客户端上传的参数
	const {
		user_id,
		article_id
	} = event
	let msg = ''
	const userinfo = await db.collection('user').doc(user_id).get();
	// 获取user列表里面的article_likes_ids数组的所有收藏id
	const article_id_ids = userinfo.data[0].article_likes_ids;
	let dbCmdFuns = null;
	// 判断当前点击收藏的id是否在数组里，是的话就取消收藏，否则存
	if(article_id_ids.includes(article_id)){
		dbCmdFuns = dbCmd.pull(article_id)
		msg = '取消收藏'
	}else{
		dbCmdFuns = dbCmd.addToSet(article_id)
		msg = '收藏成功'
	}
	await db.collection('user').doc(user_id).update({
		article_likes_ids:dbCmdFuns
	})
	//返回数据给客户端
	return {
		code:200,
		msg:msg,
		userinfo:userinfo.data[0]
	}
};
