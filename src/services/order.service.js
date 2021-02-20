import fetch from '@/utils/fetch'

// 只需要fetch这一个js文件，然后后面的写法全都按照这种类型的来写，唯一的区别就是  method 之间的区别还有用params 还是data表示参数

// 未完成
export function fetchNotFinish (lng, lat) {
    return fetch({
        url: '/orderschedule/index.php/Home/Expresses/waitingOrder',
        method: 'get',
        params: { lng, lat }
    })
}

// GY
export function fetchGy (lng, lat) {
    return fetch({
        url: '/orderschedule/index.php/Home/Expresses/queryGYOrderList',
        method: 'get',
        params: { lng, lat }
    })
}

// 接单
export function receiveOrder (orderId, lng, lat, address) {
    return fetch({
        url: '/orderschedule/index.php/Home/Expresses/accept',
        method: 'post',
        data: { orderId, lng, lat, address }
    })
}

// 单个订单
export function fetchEachOrder (orderId) {
    return fetch({
        url: '/orderschedule/index.php/Home/Orders/ordersOne?id=' + orderId,
        method: 'get',
        params: {}
    })
}

// 编辑订单
export function editOrder (orderId, jsonPatchDocument, lng, lat, address) {
    return fetch({
        url: '/orderschedule/index.php/Home/Expresses/complete',
        method: 'post',
        data: { orderId, jsonPatchDocument, lng, lat, address }
    }).then()
}

// 派送中
export function expressingOrder () {
    return fetch({
        url: '/orderschedule/index.php/Home/Expresses/expressing',
        method: 'get',
        params: {}
    })
}

// 改派
export function doReassign (orderId, targetId) {
    return fetch({
        url: '/orderschedule/index.php/Home/Reassign/Reassign',
        method: 'post',
        data: { orderId, targetId }
    })
}

// 取消改派
export function cancelReassign (orderId) {
    return fetch({
        url: '/orderschedule/index.php/Home/Reassign/cancel',
        method: 'post',
        data: { orderId }
    })
}

// 改派中
export function fetchReassigning () {
    return fetch({
        url: '/orderschedule/index.php/Home/Reassign/Reassigning',
        method: 'get',
        params: {}
    })
}

// 待确认
export function fetchPreConfirm () {
    return fetch({
        url: '/orderschedule/index.php/Home/Reassign/preAccept',
        method: 'get',
        params: {}
    })
}

// 成功
export function fetchRefundOrder (pageIndex, pageSize) {
    return fetch({
        url: '/orderschedule/index.php/Home/Expresses/refundOrders',
        method: 'get',
        params: { pageIndex, pageSize }
    })
}

// 拒绝改派
export function refuseOrder (orderId) {
    return fetch({
        url: '/orderschedule/index.php/Home/Reassign/reject',
        method: 'post',
        data: { orderId }
    })
}

// 接受改派
export function acceptOrder (orderId) {
    return fetch({
        url: '/orderschedule/index.php/Home/Reassign/accept',
        method: 'post',
        data: { orderId }
    })
}

// 已完成
export function fetchFinishOrder (pageIndex, pageSize) {
    return fetch({
        url: '/orderschedule/index.php/Home/Expresses/finalStateOrders',
        method: 'get',
        params: { pageIndex, pageSize }
    })
}

// 成功
export function fetchSuccessOrder (pageIndex, pageSize) {
    return fetch({
        url: '/orderschedule/index.php/Home/Expresses/successOrders',
        method: 'get',
        params: { pageIndex, pageSize }
    })
}

// 提交
export function submission (submis) {
    const data = {
        consignee: submis.consignee,
        Team: submis.Team,
        IDnumber: submis.IDnumber,
        BankNumber: submis.BankNumber,
        OpeningBank: submis.OpeningBank,
        Region: submis.Region,
        PersonnelNature: submis.PersonnelNature,
        Incumbency: submis.Incumbency,
        InitiationTime: submis.InitiationTime,
        DepartureTime: submis.DepartureTime,
        phone: submis.phone,
        JobNumber: submis.JobNumber
    }
    console.log(data)
    return fetch({
        url: '/orderschedule/index.php/Home/Users/updateUserInfo',
        method: 'post',
        data
    })
}

// 获取所属部门
export function teamOrder () {
    return fetch({
        url: '/orderschedule/index.php/Home/Users/getTeamName',
        method: 'post',
        data: {}
    })
}

// 获取所有信息
export function allInformation () {
    return fetch({
        url: '/orderschedule/index.php/Home/Users/getUserInfo',
        method: 'post',
        data: {}
    })
}
