<script>
	export default {
		onLaunch: function() {
			//5f3fe47ea406e900014f2518
			this.$api.get_user({
				user_id:'5f3fe47ea406e900014f2518'
			}).then((res)=>{
				console.log(res);
				const {
					data
				} = res
				this.$store.dispatch('set_userinfo',data);
			})
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("/components/gaoyia-parse/parse.css");
</style>
