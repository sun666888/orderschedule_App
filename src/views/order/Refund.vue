<template>
    <div class="complete-page">
        <van-list
            v-model="loadingFlag"
            :finished = "finished"
            finished-text="没有更多订单了"
            @load="handleLoad">
            <ul v-if="orders && orders.length > 0" class="common-ul complete-ul">
                <li v-for="(order, index) in orders" :key="index">
                    <div class="item-doorTime">
                        <span class="label">订单号： {{ order.orderId }}</span>
                        <span v-if="order.state === '成功'" class="success">{{ order.state }}</span>
                        <span v-if="order.state === '退单'" class="fail">{{ order.state }}</span>
                        <span v-if="order.state === '转物流'" class="transfer">{{ order.state }}</span>
                    </div>
                    <div class="item-name item" >
                        <span class="label">收件人：</span> {{ order.consignee }}
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
                    <div class="item" v-if="order.recharge">
                        <span class="label">充值金额：</span> {{ order.recharge }}
                    </div>
                    <div class="item-complete item">
                        <span class="label">完结时间： </span>{{ order.completeTime && order.completeTime.substring(0, 16) }}
                    </div>
                    <div class="item-isvvip item" v-if="order.isvvip">
                        <span class="label">超级会员： </span>{{ order.isvvip}}
                    </div>
                    <!-- <div class="item-paytype item" v-if="order.paytype">
                        <span class="label">支付类型： </span>{{ order.paytype}}
                    </div>
                    <div class="item-paynum item" v-if="order.paynum">
                        <span class="label">支付金额： </span>{{ order.paynum}}
                    </div> -->
                </li>
            </ul>
            <div class="no-info" v-else>暂无完成的订单~</div>
        </van-list>
    </div>
</template>

<script>
import { List, Cell } from 'vant'
import { fetchRefundOrder } from '../../services/order.service'

export default {
    data () {
        return {
            orders: [],
            loadingFlag: false,
            finished: false,
            pageIndex: 1,
            pageSize: 8,
            list: []
        }
    },
    components: {
        [List.name]: List,
        [Cell.name]: Cell
    },
    mounted () {
        this.$on('bridge', () => {
            this.pageIndex = 1
        })
    },
    methods: {
        // 使用到了 无限滚动的 组件， 上拉的时候无限滚动，
        //  每一次滚动的时候都会给页面的pageIndex +1 以确保接下来获取的是下一页的订单数据
        handleLoad () {
            fetchRefundOrder(this.pageIndex, this.pageSize).then((response) => {
                let orders = response.data.pageInfo.entities
                if (orders.length > 0) {
                    // 当每一页订单的个数 都存在的时候，那么久继续往下执行
                    orders.map(x => {
                        this.orders.push(x)
                    })
                    if (orders.length === this.pageSize) {
                        this.pageIndex++
                        // 如果订单的个数等于pageSize说明下一页面还有
                    } else {
                        // 如果订单的个数不等于pageSize说明下一页已经不会在有订单了
                        // 将finished设置为true，确保不会在继续请求了
                        this.finished = true
                    }
                } else {
                    this.finished = true
                }
                this.loadingFlag = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.van-list {
    margin-bottom: 96px;
    .complete-ul {
        margin-bottom: 0;
        .success {
            color: #ff874b;
        }
        .fail {
            color: #cccccc;
        }
        .transfer {
            color: rgb(7, 193, 96);
        }
    }
}

</style>
