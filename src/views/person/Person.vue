<template>
    <div class="person-page">
        <div class="person-top">
            <span class="icon-wrap" @click="toggleInfo">
                <svg-icon icon-class="remind" class="remind-icon" />
            </span>
            <span class="icon-wrap" @click="handleLogout">
                <svg-icon icon-class="exit" class="exit-icon" />
            </span>
        </div>
        <div class="person-header" @click="information">
            <div class="header">
                <img src="../../assets/images/head.png" alt="error" class="header-img">
                <div class="header-message">
                    <p class="header-name"> {{ name }} </p>
                    <p class="header-phone">{{ phone }}</p>
                </div>
            </div>
        </div>
        <div class="person-other">
            <ul class="other">
                <li class="other-li">
                    <svg-icon icon-class="personUnfinish" class="unfinish-icon" />
                    <span class="li-text">未完成单量</span>
                    <span class="li-number">{{ nofinishOrders }}</span>
                </li>
                <li class="other-li">
                    <svg-icon icon-class="personFinish" class="unfinish-icon" />
                    <span class="li-text">本日激活单量</span>
                    <span class="li-number">{{ todayFinishOrders }}</span>
                </li>
                <li class="other-li">
                    <svg-icon icon-class="personBackorder" class="unfinish-icon" />
                    <span class="li-text">退单量</span>
                    <span class="li-number">{{ chargeBackOrders }}</span>
                </li>
                <li class="other-li">
                    <svg-icon icon-class="personDistance" class="unfinish-icon" />
                    <span class="li-text">派送总公里数</span>
                    <span class="li-number">{{ totalOrdersKilo }}(km)</span>
                </li>
            </ul>
        </div>
        <div class="person-animate">
            <div class="animate-circle">
                {{ currentMonthFinish }}
            </div>
            <p class="animate-text">本月激活总量</p>
        </div>
        <transition name="slideAnimation">
            <div class="slide-bar" v-show="slideFlag" @click="closeInfo">
                <div class="slide">
                    <div class="slide-item" v-if="order" @click.prevent.stop="handleOrder(order.id)">
                        <div class="item">
                            <span class="item-title">上门时间：</span>
                            <span class="item-content">{{ order.visitTime && order.visitTime.substring(0, 16)}}</span>
                        </div>
                        <div class="item">
                            <span class="item-title">订单编号：</span>
                            <span class="item-content">{{ order.orderId }}</span>
                        </div>
                        <div class="item">
                            <span class="item-title">订单地址：</span>
                            <span class="item-content">{{ order.address }}</span>
                        </div>
                        <div class="item">
                            <span class="item-title">备注：</span>
                            <span class="item-content">{{ order.scheduleRemark }}</span>
                        </div>
                        <div class="item">
                            <span class="item-title">派送备注：</span>
                            <span class="item-content">{{ order.expressRemark }}</span>
                        </div>
                        <transition name="slideOther">
                            <div class="other" v-if="orderOtherFlag">
                                <div class="other-title">-- 其余信息 --</div>
                                <div class="item2">
                                    <span class="item2-title">套餐名称：</span>
                                    <span class="item2-content">{{ order.planName}}</span>
                                </div>
                            </div>
                        </transition>
                        <div class="downup">
                            <span class="icon-wrap" @click.prevent.stop="toggleOther(order.id)">
                                <svg-icon icon-class="todown" :class="active == true ? 'active' : ''" />
                            </span>
                        </div>
                    </div>
                    <p class="info" v-else>{{errorInfo}}</p>
                </div>
            </div>
        </transition>
        <bottom-foot></bottom-foot>
    </div>
</template>

<script>
import BottomFoot from '../../components/BottomFoot'
import { Dialog } from 'vant'
import { fetchPersonMess } from '../../services/user.service'
import { expressingOrder } from '../../services/order.service'

export default {
    data () {
        return {
            slideFlag: false,
            orderOtherFlag: false,
            active: false,
            name: '',
            phone: '',
            tweenedNumber: 0,
            numberOrders: 0,
            nofinishOrders: 0,
            todayFinishOrders: 0,
            chargeBackOrders: 0,
            totalOrdersKilo: 0,
            order: null,
            errorInfo: ''
        }
    },
    components: {
        BottomFoot,
        [Dialog.name]: Dialog
    },
    computed: {
        // 计算属性，也就是如果页面中的currentMonthFinish这个值发生了变化，那么就会执行  回调里面的代码
        currentMonthFinish: function () {
            return this.tweenedNumber.toFixed(0)
        }
    },
    watch: {
        numberOrders: function (newValue) {
            TweenLite.to(this.$data, 0.5, { tweenedNumber: newValue })
        }
    },
    mounted () {
        // 跳转到该路由的时候，初始化获取当前用户的信息，将信息回显到 页面中
        fetchPersonMess().then((response) => {
            let data = response.data
            this.name = data.user.name
            this.phone = data.user.phone
            this.nofinishOrders = data.notFinished
            this.todayFinishOrders = data.todayFinished
            this.chargeBackOrders = data.backCount
            this.totalOrdersKilo = data.totalKm
            this.numberOrders = data.lastMonthFinished
        }).catch()
    },
    methods: {
        toggleInfo () {
            this.slideFlag = true
            // 弹起信息提示，当已经弹出的时候关闭，当关闭的时候弹出信息提示
            expressingOrder().then((response) => {
                let order = response.data.order
                if (order) {
                    this.order = order
                }
            }).catch((error) => {
                this.errorInfo = error.error.message
            })
        },
        closeInfo () {
            this.slideFlag = false
        },
        toggleOther () {
            this.orderOtherFlag = !this.orderOtherFlag
            this.active = !this.active
        },
        handleLogout () {
            Dialog.confirm({
                title: '提示',
                message: '确认退出当前用户吗'
            }).then(() => {
                this.$store.dispatch('LogOut').then(() => {
                    // 当成功退出当前用户之后，那么就将存在浏览器中的localStorage的orders移除，这样确保不会有数据泄露，另外保证数据下次的正确性
                    // 成功推出之后，跳转到 首页
                    this.$removeStorage('orders')
                    this.$router.push('/')
                }).catch()
            }).catch(() => {
            })
        },
        handleOrder (orderId) {
            this.$router.push({
                path: './editOrder',
                query: { orderId }
            })
        },
        information () {
            // this.$router.push({
            // path: './information'
            // })
        }
    }
}
</script>

<style lang="scss" scoped>
.slideAnimation-enter-active, .slideAnimation-leave-active {
    transition: opacity .5s;
}
.slideAnimation-enter-active .slide, .slideAnimation-leave-active .slide {
    transition: transform .5s;
}
.slideAnimation-enter, .slideAnimation-leave-to {
    opacity: 0;
}
.slideAnimation-enter .slide, .slideAnimation-leave-to .slide {
    transform: translateY(-320px);
}
.slideOther-enter-active, .slideOther-leave-active {
    transition: transform .1s ease-in-out;
}
.slideOther-enter, .slideOther-leave-to {
    transform: translateY(-100%);
}

@keyframes rotate180deg {
    from {
        transform: rotate(0)
    }
    to {
        transform: rotate(180deg)
    }
}

.person-page {
    width: 100%;
    height: 100%;
    .person-top {
        background:rgba(255, 135, 75, .9);
        display: flex;
        padding: 8px 4% 80px;
        justify-content: space-between;
        .icon-wrap {
            // height: 76px;
            // line-height: 76px;
            padding: 8px;
            .svg-icon {
                font-size: 36px;
            }
        }
    }
    .person-header {
        position: relative;
        height: 160px;
        .header {
            display: flex;
            position: absolute;
            left: 4%;
            top: -48px;
            width: 84%;
            height: 160px;
            padding: 20px 4%;
            color: #f1f1f1;
            background: rgba(0, 0, 0, .6);
            border-radius: 18px;
            box-shadow: rgba(0, 0, 0, .4) 6px 6px 6px 6px;
            .header-img {
                width: 128px;
                height: 128px;
            }
            .header-message {
                .header-name {
                    font-size: 32px;
                    margin: 18px 0 12px 12px;
                }
                .header-phone {
                    font-size: 24px;
                    margin: 0 0 0 12px;
                }
            }
        }
    }
    .person-other {
        .other {
            padding: 0;
            margin: 20px auto;
            background: #f1f1f1;
            border: 1px solid #f1f1f1;
            padding-bottom: 22px;
            .other-li {
                display: flex;
                list-style: none;
                padding: 0 4%;
                height: 80px;
                line-height: 80px;
                margin-top: 20px;
                background: #ffffff;
                .svg-icon {
                    font-size: 36px;
                    margin-top: 22px;
                }
                .li-text {
                    flex: 1;
                    margin-left: 20px;
                    color: #333333;
                    font-size: 32px;
                }
                .li-number {
                    font-size: 24px;
                }
            }
        }
    }
    .person-animate {
        font-size: 36px;
        color: rgb(255, 135, 75);
        .animate-circle {
            height: 200px;
            width: 200px;
            line-height: 200px;
            text-align: center;
            font-weight: 600;
            border-radius: 100px;
            margin: 0 auto;
            border: 4px solid rgba(255, 135, 75, 1);
        }
        .animate-text {
            margin-top: 16px;
            text-align: center;
        }
    }
    .slide-bar {
        position: absolute;
        z-index: 3333;
        width: 100%;
        left: 0;
        top: 0;
        height: 100%;
        background: rgba(0,0,0,.2);
        .slide {
            display: flex;
            width: 100%;
            padding-top: 32px;
            min-height: 280px;
            background: #ffffff;
            justify-content: center;
            .slide-item {
                width: 100%;
                .item {
                    display: flex;
                    width: 90%;
                    margin: 0 auto;
                    justify-content: space-between;
                    padding: 6px 0;
                    font-size: 26px;
                    .item-title{
                        width: 148px;
                        color: #4b4e4b;
                    }
                    .item-content {
                        font-size: 24px;
                        flex: 1;
                        color: #b9bbb8;
                    }
                }
                .other {
                    width: 90%;
                    margin: 16px auto 0;
                    .other-title{
                        font-size: 24px;
                        color: #b9bbb8;
                        text-align: center;
                    }
                    .item2 {
                        display: flex;
                        margin: 0 auto;
                        justify-content: space-between;
                        height: 42px;
                        line-height: 42px;
                        font-size: 26px;
                        .item2-title{
                            color: #4b4e4b;
                        }
                        .item2-content {
                            font-size: 24px;
                            color: #b9bbb8;
                        }
                    }
                }
                .downup {
                    text-align: center;
                    .icon-wrap{
                        display: inline-block;
                        padding: 6px;
                        .svg-icon {
                            &.active {
                                transform: rotate(180deg);
                            }
                            transition: all 0.3s ease-in-out;
                            font-size: 36px;
                        }
                    }
                }
            }
            .info {
                color: #666666;
                font-size: 24px;
            }
        }
    }
}
</style>
