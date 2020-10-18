'use strict';
const db = uniCloud.database()
const $ = db.command.aggregate
exports.main = async (event, context) => {
	const {
		user_id,
		article_id,
		pageSize = 10,
		page = 1
	} = event
	const list = await db.collection('article')
		.aggregate()
		.match({
			_id: article_id
		})
		// 参考： http://uniapp.dcloud.io/uniCloud/cf-database?id=unwind 
		// 使用指定的数组字段中的每个元素，对文档进行拆分。拆分后，文档会从一个变为一个或多个，分别对应数组的每个元素。 
		.unwind('$comments')
		.project({
			// 不需要返回id
			_id: 0,
			comments: 1
		})
		// 参考： http://uniapp.dcloud.io/uniCloud/cf-database?id=replaceroot 
		// 指定一个已有字段作为输出的根节点，也可以指定一个计算出的新字段作为根节点。 
		.replaceRoot({
			newRoot: '$comments'
		})
		//要跳过多少数据
		.skip(pageSize * (page - 1))
		//显示多少条数据
		.limit(pageSize)
		.end()
	//返回数据给客户端
	return {
		code: 200,
		msg: '数据请求成功',
		data: list.data
	}
};
