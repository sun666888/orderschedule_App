<template>
    <div class="wait-confirm-page">
        <ul v-if="orders && orders.length > 0" class="common-ul">
            <li v-for="(order, index) in orders" :key="index">
                <div class="item-doorTime">
                    <span>上门时间：{{ order.visitTime && order.visitTime.substring(0, 16) }}</span>
                    <span>改派自：{{ order.user.name }}</span>
                </div>
                <div class="item-planName item">
                    <span class="label">套餐名称：</span> {{ order.planName }}
                </div>
                <div class="item-selectOrderId item">
                    <span class="label">订单号：</span> {{ order.orderId }}
                </div>
                <div class="item-orderTime item">
                    <span class="label">下单时间：</span> {{ order.orderTime }}
                </div>
                <div class="item-name item" >
                    <span class="label">收件人：</span> {{ order.consignee }}
                </div>
                <div class="item-phone item">
                    <span class="label">联系电话：</span> {{ order.phone }}
                </div>
                <div class="item-address item">
                    <span class="label">地址：</span> <span class="address"> {{ order.address }}</span>
                </div>
                <div class="item" v-if="order.scheduleRemark">
                    <span class="label">调度备注：</span> {{ order.scheduleRemark }}
                </div>
                <div class="item" v-if="order.expressRemark">
                    <span class="label">派送备注：</span> {{ order.expressRemark }}
                </div>
                <div class="btn-wrap">
                    <button class="btn-receive btn" @click="handleConfirm(order.id)">确 认</button>
                    <button class="btn-receive btn btn-red" @click="handleRefuse(order.id)">拒 绝</button>
                </div>
            </li>
        </ul>
        <div class="no-info" v-else>暂无待确认改派的订单~</div>
    </div>
</template>

<script>
import { fetchPreConfirm, acceptOrder, refuseOrder } from '../../services/order.service.js'
import { Dialog } from 'vant'

export default {
    data () {
        return {
            msg: '待确认页',
            orders: []
        }
    },
    components: {
        [Dialog.name]: Dialog
    },
    mounted () {
        // 在页面初始化的时候，执行 如下代码
        this.$on('bridge', () => {
            this.waitConfirmOrder()
        })
    },
    methods: {
        waitConfirmOrder () {
            // 调用接口获取 待确认的订单，
            fetchPreConfirm().then((response) => {
                let orders = response.data.orders
                if (orders && orders.length > 0) {
                    this.orders = orders
                }
            }).catch()
        },
        handleConfirm (orderId) {
            acceptOrder(orderId).then((response) => {
                this.$toast.success('成功')
                this.$spliceArrayOne(this.orders, orderId)
            }).catch(() => {})
        },
        handleRefuse (orderId) {
            Dialog.confirm({
                title: '提示',
                message: '就这么残忍拒绝了吗？'
            }).then(() => {
                refuseOrder(orderId).then((response) => {
                    // 同样如果拒绝了该订单，那么也会在数组中移除这个订单。
                    this.$spliceArrayOne(this.orders, orderId)
                })
            }).catch(() => {
            })
        }

    }

}
</script>

<style>
.wait-confirm-page {
    padding-bottom: 1px;
}
</style>
