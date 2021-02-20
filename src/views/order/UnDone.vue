<template>
    <div class="undone-page">
        <form action="/">
            <van-search v-model="searchorderId"
                        placeholder="请输入地址/联系电话/订单号"
                        show-action
                        @search="handleSearch"
                        @cancel="handleCancel"/>
        </form>
        <van-pull-refresh style="margin-top: 10px" v-model="isLoading" @refresh="handleRefresh">
            下拉刷新
            <div class="undone-wrap">
                <ul v-if="orders && orders.length > 0" class="common-ul">
                    <li v-for="(order, index) in orders" :key="index">
                        <div class="item-doorTime">
                            <span>上门时间：{{ order.order.visitTime && order.order.visitTime.substring(0, 16) }}</span>
                            <span>距离：{{ order.distance | decimalPoint }} (km)</span>
                            <!-- <span>维护中</span> -->
                        </div>
                        <div class="item-planName item">
                            <span class="label">套餐名称：</span> {{ order.order.planName }}
                        </div>
                        <div class="item-selectOrderId item">
                            <span class="label">订单号：</span> {{ order.order.orderId }}
                            <span class="clipboard-wrap"  v-clipboard:copy="order.order.orderId" v-clipboard:success="handleClipboardSuccess">
                                <svg-icon icon-class="clipboard" />
                            </span>
                        </div>
                        <div class="item-orderPhone item">
                            <span class="label">订购号码：</span> {{ order.order.orderPhone }}
                        </div>
                        <div class="item-orderTime item">
                            <span class="label">下单时间：</span> {{ order.order.orderTime }}
                        </div>
                        <div class="item-name item" >
                            <span class="label">收件人：</span> {{ order.order.consignee }}
                        </div>
                        <div class="item-phone item">
                            <span class="label">联系电话：</span> {{ order.order.phone }}
                        </div>
                        <div class="item-address item">
                            <span class="label">地址：</span> <span class="address"> {{ order.order.address }}</span>
                            <span class="clipboard-wrap"  v-clipboard:copy="order.order.address" v-clipboard:success="handleClipboardSuccess">
                                <svg-icon icon-class="clipboard" />
                            </span>
                        </div>
                        <div class="item" v-if="order.order.scheduleRemark">
                            <span class="label">调度备注：</span> {{ order.order.scheduleRemark }}
                        </div>
                        <div class="item" v-if="order.order.expressRemark">
                            <span class="label">派送备注：</span> {{ order.order.expressRemark }}
                        </div>
                        <!-- <div class="item-paytype item" v-if="order.order.paytype">
                            <span class="label">支付类型： </span>{{ order.order.paytype}}
                        </div>
                        <div class="item-paynum item" v-if="order.order.paynum">
                            <span class="label">支付金额： </span>{{ order.order.paynum}}
                        </div> -->
                        <div class="btn-wrap">
                            <button class="btn-receive btn" v-if="order.order.state == '派送' || order.order.state == '派送中'" @click="handleReceive(order.order.id)">接 单</button>
                            <button class="btn-receive btn btn-red" v-else @click="handleReceive(order.order.id)">接 单</button>
                            <!-- <button class="btn-reassign btn btn-yellow" @click="handleReassign(order.order.id)">改 派</button> -->
                        </div>
                    </li>
                </ul>
                <p class="no-info" v-else>{{ noOrderInfo }}</p>
            </div>
        </van-pull-refresh>
        <van-popup v-model="show" position="bottom">
            <van-picker
                :columns="userList"
                @change="handleOnChange"
                value-key="name"
                show-toolbar
                @cancel="handleOnCancel"
                @confirm="handleOnConfirm"
                :loading="pickerLoading">
            </van-picker>
        </van-popup>
        <div style="display: none" id="mapper"></div>
    </div>
</template>

<script>
import { Search, PullRefresh, Toast, Popup, Picker } from 'vant'
import getLngLat from '../../utils/getLngLat.js'
import { fetchNotFinish, doReassign, receiveOrder } from '../../services/order.service.js'
import { fetchAllDelivery } from '../../services/user.service.js'
import clipboard from '../../directive/clipboard/index.js'

export default {
    data () {
        return {
            searchorderId: '',
            isLoading: false,
            orders: [],
            show: false,
            userList: [],
            pickerLoading: true,
            selectOrderId: 0,
            targetId: 0,
            noOrderInfo: '',
            abc: 'copyContent'
        }
    },
    directives: {
        clipboard
    },
    components: {
        [Search.name]: Search,
        [PullRefresh.name]: PullRefresh,
        [Toast.name]: Toast,
        [Popup.name]: Popup,
        [Picker.name]: Picker
    },
    mounted () {
        //  通过this.$on注册bridge方法，
        this.$on('bridge', () => {
            this.handleRefresh()
        })
    },
    methods: {
        handleSearch () {
            // 前端实现搜索，不用请求后端接口，通过判断搜索的ID是否存在于localStorage中的数组，
            let searchOrderId = this.searchorderId
            if (!searchOrderId) {
                this.$toast('请输入有效关键字')
                return
            }
            let result = []
            let arrayOrders = JSON.parse(this.$getStorage('orders'))
            let findOne = arrayOrders.find(x => x.order.orderId === searchOrderId)
            let findTwo = arrayOrders.find(x => x.order.phone === searchOrderId)
            let findThree = arrayOrders.find(x => x.order.address.indexOf(searchOrderId)!==-1)
            if (findOne) {
                result.push(findOne)
                this.orders = result
            } else if (findTwo) {
                result.push(findTwo)
                this.orders = result
            } else if (findThree) {
                arrayOrders.forEach(res => {
                    console.log('---->')
                    console.log(res)
                    if (res.order.address.indexOf(searchOrderId) !== -1) {
                        result.push(res)
                    }
                })
                // result.push(findThree)
                this.orders = result
            } else {
                this.$toast('订单未查询到')
            }
        },
        handleCancel () {
            this.handleRefresh()
        },
        handleRefresh () {
            // 下拉刷新的方法
            let lng = 121.5058
            let lat = 31.30872

            // 模拟lnglat，电脑测试获取经纬度速度过慢
            // fetchNotFinish(lng, lat).then(response => {
            //     if (response) {
            //         this.orders = response.data.orders
            //         this.$setStorage('orders', this.orders)
            //     }
            //     this.isLoading = false
            // }).catch((error) => {
            //     this.noOrderInfo = error.error.message
            //     this.isLoading = false
            // })
            // return;


            // 1. 调用getLngLat方法，方法在getLngLat.js文件
            let promise = getLngLat('mapper')
            promise.then((value) => {
                //  value其实就是正确返回之后获取到的lng，lat
                if (value && value.length >= 2) {
                    let lng = value[0]
                    let lat = value[1]
                    console.log(lng, lat);
                    fetchNotFinish(lng, lat).then(response => {
                        this.isLoading = false
                        var orderPhone1 = ''
                        for(var i = 0; i < response.data.orders.length;i++) {
                            let orderPhone = response.data.orders[i].order.orderPhone
                            if(orderPhone != "无订购号码" && orderPhone != '' && orderPhone != null) {
                                var len = orderPhone.length
                            //    console.log(orderPhone)
                                  if(len && len > 4) {
                                    orderPhone1 = orderPhone.substring(0, 3) + '****' + orderPhone.substring(len - 8, len)
                                  }
                                // console.log(orderPhone1)
                                response.data.orders[i].order.orderPhone = orderPhone1
                            }
                        }
                        if (response) {
                            this.orders = response.data.orders
                            this.$setStorage('orders', this.orders)
                        }

                    }).catch((error) => {
                        this.isLoading = false
                        this.noOrderInfo = error.error.message
                    })
                } else {
                    // 默认经纬度接单，也就是会存在定位失败的情况，然后默认在给它提供一个 假的地址，确保 可以正常的 提交订单
                    // Toast.fail('定位失败')
                    fetchNotFinish(lng, lat).then(response => {
                        this.isLoading = false
                        var orderPhone1 = ''
                        for(var i = 0; i < response.data.orders.length;i++) {
                            let orderPhone = response.data.orders[i].order.orderPhone
                            if(orderPhone != "无订购号码" && orderPhone != '' && orderPhone != null) {
                                var len = orderPhone.length
                            //    console.log(orderPhone)
                                  if(len && len > 4) {
                                    orderPhone1 = orderPhone.substring(0, 3) + '****' + orderPhone.substring(len - 8, len)
                                  }
                                // console.log(orderPhone1)
                                response.data.orders[i].order.orderPhone = orderPhone1
                            }
                        }
                        if (response) {
                            this.orders = response.data.orders
                            this.$setStorage('orders', this.orders)
                        }

                    }).catch((error) => {
                        this.isLoading = false
                        this.noOrderInfo = error.error.message
                    })
                }
            })
        },
        handleReassign (selectOrderId) {
            this.show = true
            this.selectOrderId = selectOrderId
            fetchAllDelivery().then((response) => {
                this.pickerLoading = false
                let users = response.data.users
                let userList = []
                if (users && users.length > 0) {
                    users.map((x) => {
                        userList.push({
                            id: x.id,
                            name: x.name
                        })
                    })
                    this.userList = userList
                }
            }).catch(() => {
                this.pickerLoading = false
            })
        },
        handleOnChange (picker, value, index) {
            this.targetId = value.id
        },
        handleOnCancel () {
            this.show = false
        },
        handleOnConfirm () {
            //  订单的改派，其实相当于  把001订单从派送员A改派给派送员B， 这样001订单就属于派送员B了
            const toast = Toast.loading({
                mask: true,
                message: '改派中...',
                duration: 0
            })
            doReassign(this.selectOrderId, this.targetId).then((response) => {
                toast.clear()
                this.show = false
                let findIndex = this.orders.findIndex(x => x.order.id === this.selectOrderId)
                this.orders.splice(findIndex, 1)
                // 在这个订单数组中，找到刚才改派成功的订单，将这个订单移除。这样对于用户来说它才知道这个订单已经不再他的未完成订单中了
            }).catch((error) => {
                toast.clear()
                Toast.fail(error.error.message)
            })
        },
        handleReceive (orderId) {
            let lng = 121.5058
            let lat = 31.30872
            let promise = getLngLat('mapper', true)
            const toast = Toast.loading({
                mask: true,
                message: '接单中...',
                duration: 0
            })

            // 模拟经纬度地址
            // receiveOrder(orderId, lng, lat, '上海市上海市杨浦区政立路487号（默认地址）').then((response) => {
            //     this.$router.push({
            //         path: '/editOrder',
            //         query: {
            //             orderId: orderId
            //         }
            //     })
            // })
            // return;

            promise.then((value) => {
                toast.clear()
                //  value其实就是三个值， lng，lat，address这三个值，那么获取到这三个值之后，
                // 访问后台的接口去接单，
                if (value && value.length === 3) {
                    receiveOrder(orderId, value[0], value[1], value[2]).then((response) => {
                        // 接单成功后跳转到 订单的编辑页面，然后再路由上面将订单的id传递过去
                        this.$router.push({
                            path: '/editOrder',
                            query: {
                                orderId: orderId
                            }
                        })
                    }).catch((error) => {
                        this.$toast.fail({
                            message: error.error.message,
                            duration: 1000
                        })
                    })
                } else {
                    toast.clear()
                    // 默认经纬度接单，也就是会存在定位失败的情况，然后默认在给它提供一个 假的地址，确保 可以正常的 提交订单
                    // Toast.fail('定位失败')
                    receiveOrder(orderId, lng, lat, '上海市上海市杨浦区政立路487号（默认地址）').then((response) => {
                        this.$router.push({
                            path: '/editOrder',
                            query: {
                                orderId: orderId
                            }
                        })
                    }).catch((error) => {
                        this.$toast.fail({
                            message: error.error.message,
                            duration: 1000
                        })
                    })
                }
            }).catch(() => {
                toast.clear()
                // 默认经纬度接单，也就是会存在定位失败的情况，然后默认在给它提供一个 假的地址，确保 可以正常的 提交订单
                Toast.fail('定位失败')
                receiveOrder(orderId, lng, lat, '上海市上海市杨浦区政立路487号（默认地址）').then((response) => {
                    this.$router.push({
                        path: '/editOrder',
                        query: {
                            orderId: orderId
                        }
                    })
                })
            })
        },
        handleClipboardSuccess() {
            this.$toast.success({
                message: '复制成功',
                duration: 600
            })
        }
    }
}
</script>

<style lang="scss">
.undone-page {
    background: #f1f1f1;
    .van-pull-refresh {
        min-height: 100px;
        text-align: center;
        .van-pull-refresh__track {
            min-height: calc(100vh - 100px)
        }
        .undone-wrap {
            ul {
                width: 94%;
                margin: 24px auto 96px;
                font-size: 24px;
                li {
                    margin-bottom: 32px;
                    padding: 24px;
                    border-radius: 24px;
                    color: #151615;
                    background: #ffffff;
                    .item {
                        text-align: left;
                        margin-bottom: 6px;
                        .label {
                            display: inline-block;
                            width: 150px;
                            text-align: right;
                        }
                    }
                    .item-doorTime {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10px;
                        font-size: 28px;
                    }
                    .item-address {
                        display: flex;
                        .label {
                            width: 150px;
                        }
                        .address {
                            flex: 1;
                        }
                    }
                    .btn-wrap {
                        .btn {
                            width: 160px;
                            height: 48px;
                            font-size: 24px;
                            color: #ffffff;
                            border-radius: 6px;
                            outline: none;
                            border: none;
                            background: #1989fa;
                        }
                        .btn-receive {
                            margin-right: 18px;
                        }
                        .btn-red {
                            background: #f44;
                        }
                        .btn-yellow {
                            background: #ff976a;
                        }
                    }
                }
            }
            .no-info {
                font-size: 28px;
                color: #ff874b;
            }
        }
    }
}
</style>
