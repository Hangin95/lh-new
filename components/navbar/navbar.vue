<template>
	<view class="navbar">
		<view class="navbar-fixed">
			<!-- 状态栏 -->
			<!-- #ifndef MP-ALIPAY -->
			<view :style="{height:statusBarHeight+'px'}"></view>
			<!-- #endif -->
			<!-- 导航栏内容  -->
			<view class="navbar-content" :class="{'search':isSearch}" :style="{height:navbarHeight+'px',width:windowWidth+'px'}"
			 @click.stop="open">
				<view v-if="isSearch" class="navbar-content__search-icons">
					<uni-icons type="back" size="22" color="#fff" @click="back"></uni-icons>
				</view>
				<view v-if="!isSearch" class="navbar-search">
					<!-- 非搜索页显示 -->
					<view class="navbar-search_icon">
						<uni-icons type="search" size="16" color="#999"></uni-icons>
					</view>
					<view class="navbar-search_text">vue、uni-app</view>
				</view>
				<view v-else class="navbar-search">
					<!-- 搜索页显示 -->
					<input class="navbar-search_text" type="text" v-model="val" placeholder="请输入您搜索的内容" @input="inputChange" />
				</view>
			</view>
		</view>
		<view :style="{height:statusBarHeight+navbarHeight+'px'}"></view>
	</view>
</template>

<script>
	export default {
		props: {
			isSearch: {
				type: Boolean,
				default () {
					return false
				}
			},
			value: {
				type: [String,Number],
				default () {
					return ''
				}
			}
		},
		data() {
			return {
				"statusBarHeight": 20,
				"navbarHeight": 45,
				"windowWidth": 375,
				"val": ''
			};
		},
		created() {
			const info = uni.getSystemInfoSync();
			// 获取状态栏高度
			this.statusBarHeight = info.statusBarHeight;
			this.windowWidth = info.windowWidth

			// #ifndef H5 || APP-PLUS || MP-ALIPAY

			// 获取胶囊信息
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
			// 导航栏的高度 =（胶囊底部 - 状态栏高度） + （胶囊顶部 - 状态栏的高度
			let navbarHeight = (menuButtonInfo.bottom - info.statusBarHeight) + (menuButtonInfo.top - info.statusBarHeight)
			this.navbarHeight = navbarHeight;
			//导航栏宽度
			this.windowWidth = menuButtonInfo.left

			// #endif
			
			//#ifdef MP-ALIPAY
				this.statusBarHeight = 0
			//#endif
		},
		methods: {
			back(){
				uni.switchTab({
					url:'../../pages/tabbar/index/index'
				})
			},
			open() {
				//是否在搜索页
				if (this.isSearch) return
				uni.navigateTo({
					url: "/pages/home-search/home-search"
				})
			},
			inputChange(e) {
				const {
					value
				} = e.detail
				this.$emit('input', value)
			}
		},
		watch:{
			value(newVal){
				this.val = newVal
			}
		}
	}
</script>

<style lang="scss">
	.navbar {
		.navbar-fixed {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99;
			width: 100%;
			background-color: $lh-base-color;

			.navbar-content {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 45px;
				padding: 0 15px;
				box-sizing: border-box;

				.navbar-search {
					display: flex;
					align-items: center;
					width: 100%;
					height: 30px;
					background-color: #fff;
					border-radius: 30px;
					padding: 0 10px;

					.navbar-search_icon {
						margin-right: 10px;
					}

					.navbar-search_text {
						width: 100%;
						font-size: 14px;
						color: #999999;
					}
				}

				&.search {
					padding-left: 0;

					.navbar-content__search-icons {
						margin-left: 10px;
						margin-right: 10px;
					}

					.navbar-search {
						border-radius: 5px;
					}
				}
			}
		}

	}
</style>
