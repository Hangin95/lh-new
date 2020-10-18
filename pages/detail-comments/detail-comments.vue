<template>
	<view>
		<view class="comments-content" v-for="item in commentsList" :key="commentsList.comment_id">
			<comments-box :comments="item" @reply="reply"></comments-box>
		</view>
		<!-- 底部固定定位bottom -->
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="popupOpen">
				<text>谈谈你的看法</text>
				<uni-icons color="#fe350e" size="16" type="compose"></uni-icons>
			</view>
		</view>
		<!-- 评论弹出层 -->
		<comments-popup :article_id="article_id" :popupOpen="openPopup" :replyFormData="replyFormData" @commentSubmit="commentSubmit"
		 @popupClose="popupClose"></comments-popup>
		<uni-load-more v-if="commentsList.length === 0 || commentsList.length >= 4" iconType="snow" :status="loading"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				article_id: '',
				commentsList: [],
				page: 1,
				pageSize: 5,
				loading: 'loading',
				replyFormData: {},
				openPopup: false
			}
		},
		onLoad(query) {
			this.article_id = query.id
			this.getComments()
		},
		//上拉触底事件
		onReachBottom() {
			if (this.loading === 'noMore') return
			this.page++
			this.getComments()
		},
		methods: {
			//点击回复，设置replyFormData参数
			reply(e) {
				this.replyFormData = {
					"comment_id": e.comments.comment_id,
					"is_reply": e.is_reply
				}
				if (e.comments.reply_id) {
					this.replyFormData.reply_id = e.comments.reply_id
				}
				this.popupOpen()
			},
			// 获取评论数据云函数
			getComments() {
				this.$api.get_comments({
					article_id: this.article_id,
					page: this.page,
					pageSize: this.pageSize
				}).then((res) => {
					const {
						data
					} = res
					if (data.length === 0) {
						this.loading = 'noMore'
						return
					}
					//对象复制
					let oldFormdata = JSON.parse(JSON.stringify(this.commentsList))
					oldFormdata.push(...data)
					this.commentsList = oldFormdata
				})
			},
			//TODO评论弹出层
			//
			//
			//打开弹出层
			popupOpen() {
				this.openPopup = true
			},
			//关闭弹出层
			popupClose() {
				this.openPopup = false
			},
			//popup组件提交发布内容，数据更新后清空replyFormData数据
			commentSubmit() {
				this.replyFormData = {}
				this.page = 1
				this.commentsList = []
				this.getComments()
			},
		}
	}
</script>

<style lang="scss">
	.comments-content {
		padding: 0 15px;
		border-bottom: 1px #f5f5f5 solid;
	}

	.detail-bottom {
		position: fixed;
		left: 0;
		bottom: 0;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		border-top: 1px #f5f5f5 solid;
		background-color: #fff;
		box-sizing: border-box;

		.detail-bottom__input {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 30px;
			padding: 0 10px;
			margin: 10px;
			border: 1px #ddd solid;
			border-radius: 5px;

			text {
				font-size: 14px;
				color: #999;
				margin-right: 5px;
			}
		}
	}
</style>
