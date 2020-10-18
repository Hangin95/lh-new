<template>
	<view class="detail">
		<view class="detail-title">
			{{formData.title}}
		</view>
		<view class="detail-header">
			<view class="detail-header__logo">
				<image :src="formData.author.avatar" mode="aspectFill"></image>
			</view>
			<view class="detail-header__content">
				<view class="detail-header__content-title">
					{{formData.author.author_name}}
				</view>
				<view class="detail-header__content-info">
					<text>{{formData.create_time}}</text>
					<text>{{formData.browse_count}} 浏览</text>
					<text>{{formData.thumbs_up_count}} 赞</text>
				</view>
			</view>
			<button type="default" class="detail-header__button" @click="follow(formData.author.id)">
				{{formData.is_author_like?'取消关注':'关注'}}
			</button>
		</view>
		<view class="detail-content">
			<view class="detail-html">
				<u-parse :content="formData.content" :noData="noData"></u-parse>
			</view>
			<!-- 最新评论 -->
			<view class="detail-comment">
				<view class="comment-title">
					最新评论
				</view>
				<view class="comment-content" v-for="item in commentsList" :key="commentsList.comment_id">
					<comments-box :comments="item" @reply="reply"></comments-box>
				</view>
			</view>
		</view>
		<!-- 底部固定定位bottom -->
		<view class="detail-bottom">
			<view class="detail-bottom__input" @click="popupOpen">
				<text>谈谈你的看法</text>
				<uni-icons color="#fe350e" size="16" type="compose"></uni-icons>
			</view>
			<view class="detail-bottom__icons">
				<view class="detail-bottom__icons-box" @click="open">
					<uni-icons color="#fe350e" size="22" type="chat"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="likeTap(formData._id)">
					<uni-icons color="#fe350e" size="22" :type="formData.is_like?'heart-filled':'heart'"></uni-icons>
				</view>
				<view class="detail-bottom__icons-box" @click="thumbsupBtn(formData._id)">
					<uni-icons color="#fe350e" size="22" :type="formData.is_thumbs_up?'hand-thumbsup-filled':'hand-thumbsup'"></uni-icons>
				</view>
			</view>
		</view>

		<!-- 评论弹出层 -->
		<comments-popup :article_id="formData._id" :popupOpen="openPopup" :replyFormData="replyFormData" @commentSubmit="commentSubmit" @popupClose="popupClose"></comments-popup>
	</view>
</template>

<script>
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components:{
			uParse
		},
		data() {
			return {
				formData:{},
				noData:'<p style="text-align:center;color:#666">详情加载中...</p>',
				commentsList:[],
				replyFormData:{},
				openPopup:false
			}
		},
		onLoad(query) {
			this.formData = JSON.parse(query.params);
			this.getDetail()
			this.getComments()
		},
		methods: {
			//打开评论列表
			open(){
				uni.navigateTo({
					url:"../detail-comments/detail-comments?id="+this.formData._id
				})
			},
			//点赞按钮
			thumbsupBtn(article_id){
				this.setUpdateThumbsup(article_id)
			},
			//点击收藏按钮
			likeTap(article_id){
				this.setUpdateLike(article_id)
			},
			//点击关注按钮
			follow(author_id){
				this.setUpdateAuthor(author_id)
			},
			//TODO评论弹出层
			//
			//
			//打开弹出层
			popupOpen(){
				this.openPopup = true
			},
			//关闭弹出层
			popupClose(){
				this.openPopup = false
			},
			//popup组件提交发布内容，数据更新后清空replyFormData数据
			commentSubmit(){
				this.replyFormData = {}
				this.getComments()
			},
			//
			//
			//
			//点击回复，设置replyFormData参数
			reply(e){
				this.replyFormData ={
					"comment_id":e.comments.comment_id,
					"is_reply":e.is_reply
				}
				if(e.comments.reply_id){
					this.replyFormData.reply_id = e.comments.reply_id
				}
				this.popupOpen()
			},
			// 获取详情数据云函数
			getDetail(){
				this.$api.get_detail({
					article_id:this.formData._id
				}).then((res)=>{
					const {data} = res
					this.formData = data
				})
			},
			// 获取评论数据云函数
			getComments(){
				this.$api.get_comments({
					article_id:this.formData._id,
					page:1,
					pageSize:5
				}).then((res)=>{
					console.log(res);
					this.commentsList = res.data
				})
			},
			//关注取消作者云函数
			setUpdateAuthor(author_id){
				uni.showLoading()
				this.$api.update_author({
					author_id
				}).then((res)=>{
					uni.hideLoading()
					this.formData.is_author_like = !this.formData.is_author_like
					uni.$emit('update_author')
					uni.showToast({
						title:this.formData.is_author_like?'关注作者成功':'取消关注作者',
						icon:'none'
					})
				})
			},
			//收藏文章云函数
			setUpdateLike(article_id){
				uni.showLoading()
				this.$api.update_like({
					article_id
				}).then((res)=>{
					uni.hideLoading()
					this.formData.is_like = !this.formData.is_like
					uni.$emit('update_article','follow')
					uni.showToast({
						title:this.formData.is_like?'收藏成功':'取消收藏',
						icon:'none'
					})
				})
			},
			//点赞文章云函数
			setUpdateThumbsup(article_id){
				uni.showLoading()
				this.$api.update_thumbsup({
					article_id
				}).then((res)=>{
					uni.hideLoading()
					this.formData.is_thumbs_up = !this.formData.is_thumbs_up
					if(this.formData.is_thumbs_up){
						this.formData.thumbs_up_count++
					}else{
						this.formData.thumbs_up_count--
					}
					uni.showToast({
						title:this.formData.is_thumbs_up?'点赞成功':'取消点赞',
						icon:'none'
					})
				})
			},
		}
	}
</script>

<style lang="scss">
	.detail{
		padding: 15px 0;
		padding-bottom: 54px;
	}
	.detail-title {
		font-size: 18px;
		font-weight: bold;
		padding: 0 15px;
		color: #333;
	}

	.detail-header {
		display: flex;
		align-items: center;
		margin-top: 10px;
		padding: 0 15px;
		
		.detail-header__logo {
			flex-shrink: 0;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.detail-header__content {
			width: 100%;
			padding-left: 10px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-size: 12px;

			.detail-header__content-title {
				font-size: 14px;
				color: #333;
			}

			.detail-header__content-info {
				color: #999;

				text {
					margin-right: 10px;
				}
			}
		}
		.detail-header__button{
			padding: 0 15px;
			flex-shrink: 0;
			height: 30px;
			line-height: 30px;
			border-radius: 5px;
			font-size: 12px;
			background-color: $lh-base-color;
			color: #fff;
		}
	}

	.detail-content {
		margin-top: 20px;
		min-height: 500px;
		.detail-html{
			padding: 0 15px;
		}
		.detail-comment{
			margin-top: 30px;
			.comment-title{
				padding: 10px 15px;
				font-size: 14px;
				border-bottom: 1px #f5f5f5 solid;
				color: #666;
			}
			.comment-content{
				padding: 0 15px;
				border-top: 1px #eee solid;
			}
		}
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
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 30px;
			padding: 0 10px;
			margin-left: 10px;
			border: 1px #ddd solid;
			border-radius: 5px;

			text {
				font-size: 14px;
				color: #999;
			}
		}

		.detail-bottom__icons {
			display: flex;
			flex-shrink: 0;
			padding: 0 10px;

			.detail-bottom__icons-box {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 44px;
			}

		}
	}

	
</style>
