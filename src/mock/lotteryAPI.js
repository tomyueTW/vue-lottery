import Mock from 'mockjs'
const temp = {
  mta2018: {errorInfo: '登陆成功', result: '1', data: ''},
  err: {errorInfo: '密码错误', result: '0', data: ''},
  check: {errorInfo: '您已经登陆过了', result: '1', data: ''},
  noPer: {errorInfo: '请您先登陆', result: '0', data: ''},
  add: {errorInfo: '成功', result: '1', data: ''}
}
function getQueryString (str, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = str.match(reg)
  if (r != null) return decodeURIComponent(r[2])
  return ''
}

// 模拟用户数据
const userData = []
for (let i = 1; i < 100; i++) {
  userData.push(Mock.mock({
    Company: '@city(true)', // 公司名
    CompleteID: '@increment', // ID
    HeadImg: `@image(200x200, @color, #FFF, mock-${i})`, // 微信头像
    Name: '@cname', // 姓名
    Num: `M${i}`, // 工号
    OpenID: '@increment', // 微信ID
    Award: '0' // 奖项，'0'表示未中奖
  }))
}

// 奖项类别
const type = [
  {value: '1', label: '1獎', number: '1'},
  {value: '2', label: '2獎', number: '2'},
  {value: '3', label: '3獎', number: '3'},
  {value: '4', label: '參加獎', number: '15'}
]

// 校验登录状态,维持15分钟登录
const storage = 'isLogin'
setTimeout(() => {
  localStorage.removeItem(storage)
}, 6000 * 150)

export default {
  postLogin: config => {
    const params = getQueryString(config.body, 'username')
    if (temp[params]) {
      localStorage.setItem(storage, 1)
      return temp[params]
    } else {
      localStorage.removeItem(storage)
      return temp['err']
    }
  },
  checkLogin: config => {
    const status = localStorage.getItem(storage)
    if (status) {
      return temp['check']
    } else {
      return temp['noPer']
    }
  },
  getDatas: () => {
    return {
      userData,
      type
    }
  },
  postDatas: config => {
    return temp['add']
  }
}
