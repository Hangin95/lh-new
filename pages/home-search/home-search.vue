<template>
	<view class="home">
		<navbar :isSearch="true" v-model="value" @input="change"></navbar>
		<view class="home-list">
			<view v-if="is_history" class="label-box">
				<view class="label-header">
					<text class="label-title">
						搜索历史
					</text>
					<text class="label-clear" @click="clear">
						清空
					</text>
				</view>
				<view v-if="historyLists.length>0" class="label-content">
					<view @click="clickSearch(item.name)" class="label-content__item" v-for="(item,index) in historyLists" :key="index">
						{{item.name}}
					</view>
				</view>
				<view v-else class="no-data">
					没有搜索历史
				</view>
			</view>
			<list-scroll v-else class="list-scroll">
				<uni-load-more v-if="loading" iconType="snow" status="loading"></uni-load-more>
				<view v-if="searchList.length>0">
					<list-card @clickCard="setHistory" :item="item" v-for="item in searchList" :key="item.__id"></list-card>
				</view>
				<view v-if="searchList.length === 0 && !loading" class="no-data">
					没有搜索到相关数据
				</view>
			</list-scroll>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				is_history: true,
				searchList: [],
				value: '',
				loading: false
			}
		},
		computed: {
			...mapState(['historyLists'])
		},
		methods: {
			clickSearch(name) {
				this.value = name
				this.getSearch(name)
			},
			// 当点击搜索到的卡片时  用vuex状态管理 保存显示搜索记录
			setHistory() {
				this.$store.dispatch('set_history', {
					name: this.value
				});
			},
			change(value) {
				// 保存搜索记录
				this.value = value
				if (!value) {
					clearTimeout(this.timer)
					this.mark = false
					this.getSearch(value)
					return
				}
				if (!this.mark) {
					this.mark = true;
					this.timer = setTimeout(() => {
						this.mark = false;
						this.getSearch(value)
					}, 1000)
				}
			},
			clear() {
				this.$store.dispatch('clearHistory');
				uni.showToast({
					title:'清空完成'
				})
			},
			getSearch(value) {
				if (!value) {
					this.searchList = []
					this.is_history = true
					return
				}
				this.is_history = false
				this.loading = true
				this.$api.get_search({
					value
				}).then(res => {
					const {
						data
					} = res;
					console.log(value, data);
					this.loading = false
					this.searchList = data
				}).catch(err => {
					this.loading = false
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		background-color: #f5f5f5;
		display: flex;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;

		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				font-size: 14px;
				color: #666;
				padding: 10px 15px;
				border-bottom: 1px #f5f5f5 solid;

				.label-title {
					color: $lh-base-color;
				}

				.label-clear {
					color: #30b33a;
					font-weight: bold;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content__item {
					padding: 2px 10px;
					margin-top: 12px;
					margin-right: 10px;
					border: 1px #666 solid;
					border-radius: 5px;
					font-size: 14px;
					color: #666;
				}
			}
		}
		.no-data {
			height: 200px;
			line-height: 200px;
			width: 100%;
			text-align: center;
			font-size: 12px;
			color: #666;
		}
	}
</style>
