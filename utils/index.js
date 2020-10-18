//
//工具类文件
//
export const parseTime = (time) => {
	let date = null
	if (typeof time === 'string') {
		time = parseInt(time)
	}
	date = new Date(time)
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds()
	}
	let strTime = ''
	let YMD = dateChange(formatObj.y) + '-' + dateChange(formatObj.m) + '-' + dateChange(formatObj.d)
	let HIS = dateChange(formatObj.h) + ':' + dateChange(formatObj.i) + ':' + dateChange(formatObj.s)
	strTime = YMD + ' ' + HIS
	return strTime
}
const dateChange = (value) => {
	if (value > 0 && value < 10) {
		value = '0' + value
	}
	return value
}
