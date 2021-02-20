<template>
    <div class="reassigning-page">
        <ul v-if="orders && orders.length > 0" class="common-ul">
            <li v-for="(order, index) in orders" :key="index">
                <div class="item-doorTime">
                    <span>上门时间：{{ order.order.visitTime && order.order.visitTime.substring(0, 16) }}</span>
                    <span>改派给：{{ order.targetUser.name }}</span>
                </div>
                <div class="item-planName item">
                    <span class="label">套餐名称：</span> {{ order.order.planName }}
                </div>
                <div class="item-selectOrderId item">
                    <span class="label">订单号：</span> {{ order.order.orderId }}
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
                </div>
                <div class="item" v-if="order.order.scheduleRemark">
                    <span class="label">调度备注：</span> {{ order.order.scheduleRemark }}
                </div>
                <div class="item" v-if="order.order.expressRemark">
                    <span class="label">派送备注：</span> {{ order.order.expressRemark }}
                </div>
                <div class="btn-wrap">
                    <button class="btn-receive btn btn-red" @click="handleCancel(order.order.id)">取 消</button>
                </div>
            </li>
        </ul>
        <div class="no-info" v-else>暂无改约订单~</div>
    </div>
</template>

<script>
import { fetchReassigning, cancelReassign } from '../../services/order.service'
import { Toast, Dialog } from 'vant'

export default {
    data () {
        return {
            msg: 'reassigning-page',
            orders: []
        }
    },
    components: {
        [Toast.name]: Toast,
        [Dialog.name]: Dialog
    },
    mounted () {
        //  初始化获取 待改派的订单
        this.$on('bridge', () => {
            this.reassigningOrder()
        })
    },
    methods: {
        reassigningOrder () {
            fetchReassigning().then((response) => {
                let orders = response.data.reassigns
                if (orders && orders.length > 0) {
                    this.orders = orders
                }
            })
        },
        handleCancel (orderId) {
            Dialog.confirm({
                title: '提示',
                message: '确认要取消改派吗？'
            }).then(() => {
                cancelReassign(orderId).then((response) => {
                    this.$toast.success('成功取消')
                    let findWhere = this.orders.findIndex(x => x.orderId === orderId)
                    this.orders.splice(findWhere, 1)
                    //  成功取消该订单之后，将待改派的订单数组中  该订单移除掉。
                }).catch()
            }).catch(() => {
            })
        }
    }
}
</script>

<style>
.reassigning-page {
    padding-bottom: 1px;
}
</style>
