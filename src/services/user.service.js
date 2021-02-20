import fetch from '../utils/fetch'

// 登录
export function loginByname(loginName, password) {
    return fetch({
        url: '/orderschedule/index.php/Home/Accounts/signin',
        method: 'post',
        data: { loginName, password }
    })
}

// 注册
export function register(regUserInfo) {
    const data = {
        userName: regUserInfo.regUsername,
        name: regUserInfo.regRealname,
        phone: regUserInfo.regPhone,
        password: regUserInfo.regPassword,
        address: regUserInfo.regAddress
    }
    return fetch({
        url: '/orderschedule/index.php/Home/Accounts/signup',
        method: 'post',
        data
    })
}

// 登出
export function logOut() {
    return fetch({
        url: '/orderschedule/index.php/Home/Accounts/logout',
        method: 'post',
        data: {}
    })
}

// 派送员个人信息
export function fetchPersonMess() {
    return fetch({
        url: '/orderschedule/index.php/Home/Users/self',
        method: 'get',
        params: {}
    })
}

// 所有派送员
export function fetchAllDelivery() {
    return fetch({
        url: '/orderschedule/index.php/Home/Users/expresses',
        method: 'get',
        params: {}
    })
}
