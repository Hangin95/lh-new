<template>
	<view class="follow">
		<view class="follow-tab">
			<view class="follow-tab__box">
				<view class="follow-tab__item" :class="{active:activeIndex === 0}" @click="tab(0)">文章</view>
				<view class="follow-tab__item" :class="{active:activeIndex === 1}" @click="tab(1)">作者</view>
			</view>
		</view>
		<view class="follow-list">
			<swiper class="follow-list__swiper" :current="activeIndex" @change="change">
				<swiper-item>
					<list-scroll>
						<uni-load-more v-if="list.length===0&&!articleShow" iconType="snow" status="loading"></uni-load-more>
						<list-card types="follow" :item="item" v-for="item in list" :key="item._id"></list-card>
						<view v-if="articleShow" class="no-data">
							没有收藏文章
						</view>
					</list-scroll>
				</swiper-item>
				<swiper-item>
					<list-scroll>
						<uni-load-more v-if="authorList.length===0&&!authorShow" iconType="snow" status="loading"></uni-load-more>
						<list-author v-for="item in authorList" :item='item' :key="item.id"></list-author>
						<view v-if="authorShow" class="no-data">
							没有关注作者
						</view>
					</list-scroll>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0,
				list: [],
				authorList:[],
				articleShow: false,
				authorShow: false,
			}
		},
		onLoad() {
			uni.$on('update_article', (e) => {
				this.getFollow()
			})
			uni.$on('update_author', (e) => {
				this.getAuthor()
			})
			this.getFollow() 
			this.getAuthor() 
		},
		methods: {
			change(e){
				this.activeIndex = e.detail.current
			},
			tab(index) {
				this.activeIndex = index

			},
			getFollow() {
				this.$api.get_follow().then((res) => {
					const {
						data
					} = res
					this.list = data
					this.articleShow = this.list.length === 0 ? true : false
				})
			},
			getAuthor() {
				this.$api.get_author().then((res) => {
					console.log(res);
					const {
						data
					} = res
					this.authorList = data
					this.authorShow = this.authorList.length === 0 ? true : false
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.follow {
		// height: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
		box-sizing: border-box;

		.follow-tab {
			height: 30px;
			padding: 10px 20px;
			border-bottom: 1px #f5f5f5 solid;

			.follow-tab__box {
				display: flex;
				width: 100%;
				height: 100%;
				border-radius: 5px;
				border: 1px $lh-base-color solid;

				.follow-tab__item {
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 14px;
					color: #666;

					&:first-child {
						border-right: 1px $lh-base-color solid;
					}

					&.active {
						color: $lh-base-color;
					}
				}
			}
		}

		.follow-list {
			flex: 1;

			.follow-list__swiper {
				height: 100%;

				.swiper-item {
					height: 100;
				}
			}
		}
	}

	.no-data {
		color: #999;
		font-size: 14px;
		padding: 50px;
		text-align: center;
	}
</style>
