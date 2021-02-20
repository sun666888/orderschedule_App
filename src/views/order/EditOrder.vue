<template>
    <div class="edit-order-page">
        <div class="title">
            <span class="title-back" @click="goBack">
                <svg-icon icon-class="left"  />
            </span>
            <div class="title-center">
                编辑订单
            </div>
            <span class="title-reload" @click="handleReload" >
                <svg-icon icon-class="reload" :class="active == true ? 'active': ''"/>
            </span>
        </div>
        <div class="content">
            <form action="/">
            <div class="content-item">
                <div class="item-label">订单号：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="订单号" v-model="form.orderId" disabled />
                    <span class="clipboard-unique" v-clipboard:copy="form.orderId" v-clipboard:success="handleCopySuccess">
                        <svg-icon icon-class="clipboard" />
                    </span>
                </div>
            </div>


            <div class="content-item">
                <div class="item-label">订购号码：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="订购号码" v-model="form.orderPhone" :disabled="disabled" />
                </div>
            </div>


            <div class="content-item">
                <div class="item-label">姓名：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="收件人姓名" v-model="form.consignee" disabled />
                </div>
            </div>
            <div class="content-item">
                <div class="item-label">电话：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="收件人电话" v-model="form.phone" disabled />
                    <a :href="matchPhone(form.phone)" class="icon-wrap" >
                        <svg-icon icon-class="call" class="phone-icon" />
                    </a>
                </div>
            </div>
            <div class="content-item">
                <div class="item-label">套餐：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="套餐名称" v-model="form.planName" disabled />
                </div>
            </div>
            <div class="content-item">
                <div class="item-label">地址：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="街道门牌等信息" v-model="form.address" @click="handleNavigation(form.address)" />
                    <span class="clipboard-unique" v-clipboard:copy="form.address" v-clipboard:success="handleCopySuccess">
                        <svg-icon icon-class="clipboard" />
                    </span>
                </div>
            </div>
            <div class="content-item">
                <div class="item-label">状态：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="选择订单状态" @click="handleState" v-model="form.state" />
                </div>
            </div>
            <div class="content-item" v-if="form.state && form.state == '成功'">
                <div class="item-label">亲情卡号：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="亲情卡号码(','隔开)" v-model="form.secondaryCard" />
                </div>
            </div>
            <div class="content-item" v-if="form.state && form.state == '成功'">
                <div class="item-label">金额：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="选择金额" v-model="form.recharge"  @click="handleRechage"/>
                </div>
            </div>
            <div class="content-item" v-if="form.state && form.state == '成功'">
                <div class="item-label">超级会员：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="超级会员" v-model="isvvipLabel"  @click="handleVvip" />
                    <input type="hidden" class="item-input" placeholder="超级会员" v-model="form.isvvip"  @click="handleVvip"/>

                    <!-- 第一个input用来显示给用户看 是和否 ，第二个inpu是用来传递真实数据 0和1 -->
                </div>
            </div>
            <div class="content-item" v-if="form.state && form.state == '成功'">
                <div class="item-label">手厅搭载：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="请选择" v-model="form.handHall"  @click="handleHall"/>
                </div>
            </div>
            <div class="content-item" v-if="form.state && form.state == '成功'">
                <div class="item-label">企业微信：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="请选择" v-model="form.wechat"  @click="handleWechat"/>
                </div>
            </div>
            <div class="content-item" v-if="form.state && form.state == '成功'">
                <div class="item-label">宽带业务：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="请选择" v-model="form.wideBand"  @click="handleWideBand"/>
                </div>
            </div>
            <div class="content-item" v-if="form.state && form.state == '改约'">
                <div class="item-label"><span style="color: red;">*</span>改约时间：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="改约时间" @click="handleVisitTime"  v-model="form.visitTime"/>
                </div>
            </div>
            <div class="content-item" v-if="form.state && form.state == '改约'">
                <div class="item-label"><span style="color: red;">*</span>改约原因：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="选择改约原因"  @click="handleRevision"  v-model="form.expressCancelRevision" />
                </div>
            </div>
            <div class="content-item" v-else-if="form.state && form.state == '转物流'">
                <div class="item-label">转物流</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="转物流原因"  v-model="form.expressCancelReason" />
                </div>
            </div>
            <div class="content-item" v-else-if="form.state && form.state == '退单'">
                <div class="item-label">退单：</div>
                <div class="item-value">
                    <input type="text" class="item-input" placeholder="选择退单原因" @click="handleReason" v-model="form.expressCancelReason" />
                </div>
            </div>
            <div class="content-item">
                <div class="item-label">备注：</div>
                <div class="item-value">
                    <textarea type="text" class="item-input" placeholder="填写备注" rows="2" v-model="form.expressRemark" ></textarea>
                </div>
            </div>
            </form>
        </div>
        <div class="bottom">
            <button class="confirm-btn" @click="handleSubmit">提 交</button>
        </div>
        <van-popup v-model="popShow" position="bottom">
            <van-picker
                show-toolbar
                :columns="stateList"
                @cancel="handleCancelState"
                @confirm="handleConfirmState"/>
        </van-popup>
        <van-popup v-model="timePopShow" position="bottom">
            <van-datetime-picker
                v-model="visitTime"
                type="datetime"
                :min-date="minDate"
                @cancel="handleCancelVisit"
                @confirm="handleConfirmVisit"
            />
        </van-popup>
        <van-popup v-model="cancelPopShow" position="bottom">
            <van-picker
                show-toolbar
                :columns="cancelOrderReasons"
                @cancel="handleCancelReason"
                @confirm="handleConfirmReason"/>
        </van-popup>
        <!-- 改约 -->
        <van-popup v-model="cancelPopShowRevision" position="bottom">
            <van-picker
                show-toolbar
                :columns="cancelOrderRevision"
                @cancel="handleCancelRevision"
                @confirm="handleConfirmRevision"/>
        </van-popup>
        <van-popup v-model="rechargeShow" position="bottom">
            <van-picker
                show-toolbar
                :columns="rechargeList"
                @cancel="handleCancelRecharge"
                @confirm="handleConfirmRecharge"/>
        </van-popup>
        <!-- 超级会员 -->
        <van-popup v-model="isVvipShow" position="bottom">
            <van-picker
                :columns="vvipList"
                value-key="name"
                show-toolbar
                @cancel="handleVvipCancel"
                @confirm="handleVvipConfirm">
            </van-picker>
            <!-- value-key 表示 每个对象中 文字对应的key -->
        </van-popup>
        <!-- 手厅搭载选择 -->
        <van-popup v-model="hallShow" position="bottom">
            <van-picker
                show-toolbar
                :columns="hallList"
                @cancel="handleCancelHall"
                @confirm="handleConfirmHall"/>
        </van-popup>
        <!-- 企业微信选择 -->
        <van-popup v-model="wechatShow" position="bottom">
            <van-picker
                show-toolbar
                :columns="hallList"
                @cancel="handleCancelWechat"
                @confirm="handleConfirmWechat"/>
        </van-popup>
        <!-- 宽带业务选择 -->
        <van-popup v-model="wideBandShow" position="bottom">
            <van-picker
                show-toolbar
                :columns="hallList"
                @cancel="handleCancelWideBand"
                @confirm="handleConfirmWideBand"/>
        </van-popup>

        <div id="mapper" style="display: none;"></div>
    </div>
</template>

<script>
import { Picker, Popup, DatetimePicker, Field, Toast } from 'vant'
import moment from 'moment'
// moment用来格式我们的时间样式，得到我们想要的时间格式
import { fetchEachOrder, editOrder } from '../../services/order.service'
import { observe, generate } from 'fast-json-patch'
// fast-json-patch 这个只是使用了observe和generate这两个方法，一个用来监听变化，一个用来将变化的值转乘我们想要传递给后台的数据。 固定用法，两步，如项目中的写法：
import getLngLat from '../../utils/getLngLat.js'
import transferLngLat from '../../utils/transferLngLat.js'
import clipboard from '../../directive/clipboard/index'

export default {
    data () {
        return {
            form: {},
            formPatch: null,
            orderId: '',
            active: false,
            popShow: false,
            stateList: ['成功', '改约', '转物流', '退单', '活动订单（未通知不可提交此状态）'],
            timePopShow: false,
            visitTime: '',
            recharge:'',
            minDate: new Date(),
            cancelPopShow: false,
            cancelPopShowRevision: false,
            rechargeShow: false,
            isVvipShow: false,
            isvvipLabel: '',
            disabled: true,
            hallShow: false,
            hallList: ['已办理','未办理'],
            wechatShow: false,
            wideBandShow: false,
            vvipList: [
                {
                    id: '5G会员',
                    name: '5G会员'
                },{
                    id: '普通会员',
                    name: '普通会员'
                },{
                    id: '普通尊享包',
                    name: '普通尊享包'
                },{
                    id: '5G尊享包',
                    name: '5G尊享包'
                },{
                    id: '未办理',
                    name: '未办理'
                }
            ],
            rechargeList: ['0', '10及以上', '50及以上', '100及以上'],
            // cancelOrderReasons: ['上门无果', '电话无果', '无理由退单', '人证不匹配', '身份证不在身边', '身份证消磁', '一证五户', '黑名单', '主套餐无法办理副卡(副卡)', '主号码预约转套餐(副卡)', '客户选号拒绝办理(副卡)', '已转化为地推']
            cancelOrderReasons: ['1-未上门：电话已联系无有效证件', '2-未上门：电话已联系要求退单', '3-未上门：电话无果，地址有误', '4-已上门：电话无果，上门无人', '5-已上门：证件问题', '6-已上门：要求退单', '7-用户下错单不需要', '8-已转化为地推'],
            cancelOrderRevision: ['1-证件不在身边', '2-已联系未联系到', '3-已上门无人', '4-联系已确认上门时间', '5-联系无确认上门时间']
        }
    },
    directives: {
        clipboard
    },
    components: {
        [Picker.name]: Picker,
        [Popup.name]: Popup,
        [DatetimePicker.name]: DatetimePicker,
        [Field.name]: Field
    },
    mounted () {
        // 生命周期的钩子函数，简单点理解就是vue初始化的时候  执行这两个方法
        this.$setgoindex()
        this.getOrder()
    },
    methods: {
        getOrder () {
            // 通过获取路由中传递的orderId这个参数，调用fetchEachOrder方法请求后台，拿到该订单信息
            let orderId = this.$route.query.orderId
            this.orderId = orderId
            if (orderId) {
                fetchEachOrder(orderId).then((response) => {
                    let data = response.data.order
                    this.active = false
                    this.form = data
                    this.form.state = ''

                    // 1 使用observe方法来监听这个对象
                    this.formPatch = observe(this.form)
                }).catch()
            }
        },
        goBack () {
            if (this.$route.query.goindex === 'true') {
                this.$router.push('/')
            } else {
                this.$router.back(-1)
            }
        },
        // 手厅挂载选择
        handleHall() {
            this.hallShow = true
        },
        handleCancelHall() {
            this.hallShow = false
        },
        handleConfirmHall(value) {
            this.form.handHall = value
            this.hallShow = false
        },
        // 企业微信选择
        handleWechat() {
            this.wechatShow = true
        },
        handleCancelWechat() {
            this.wechatShow = false
        },
        handleConfirmWechat(value) {
            this.form.wechat = value
            this.wechatShow = false
        },
        // 宽带业务选择
        handleWideBand() {
            this.wideBandShow = true
        },
        handleCancelWideBand() {
            this.wideBandShow = false
        },
        handleConfirmWideBand(value) {
            this.form.wideBand = value
            this.wideBandShow = false
        },

        handleCancelHall() {
            this.hallShow = false
        },
        handleConfirmHall(value) {
            this.form.handHall = value
            this.hallShow = false
        },
        handleReload () {
            this.active = true
            this.getOrder()
        },
        handleState () {
            this.popShow = true
        },
        handleCancelState () {
            this.popShow = false
        },
        handleConfirmState (value, index) {
            this.popShow = false
            this.form.state = value
        },
        handleVisitTime () {
            this.timePopShow = true
        },
        handleCancelVisit () {
            this.timePopShow = false
        },
        handleConfirmVisit (value) {
            let formatTime = moment(value).format('YYYY-MM-DD HH:mm:ss')
            //  将value值转化成 2019-04-04 10:10:10 这样的时间格式
            this.form.visitTime = formatTime
            this.timePopShow = false
        },
        handleReason () {
            this.cancelPopShow = true
        },

        handleCancelReason () {
            this.cancelPopShow = false
        },
        handleConfirmReason (value) {
            this.form.expressCancelReason = value
            this.cancelPopShow = false
        },
        // 改约
        handleRevision () {
            this.cancelPopShowRevision = true
        },
        handleCancelRevision () {
            this.cancelPopShowRevision = false
        },
        handleConfirmRevision (value) {
            this.form.expressCancelRevision = value
            this.cancelPopShowRevision = false
        },
        handleSubmit () {
            let form = this.form
            switch (form.state) {
                case '改约':
                    if (form.visitTime == null) {
                        Toast.fail({
                            message: '填写改约时间',
                            duration: 1200
                        })
                        return
                    } else if (form.expressCancelRevision == null) {
                        Toast.fail({
                            message: '填写改约原因',
                            duration: 1200
                        })
                        return
                    }
                    break
                case '退单':
                    if (form.expressCancelReason == null) {
                        Toast.fail({
                            message: '填写退单原因',
                            duration: 1200
                        })
                        return
                    }
                    break
                case '成功':
                    if(form.orderPhone == null || form.orderPhone == "" || form.orderPhone.length==11 || form.orderPhone == '无订购号码'){
                        this.disabled = false
                        Toast.fail({
                            message:'填写订购号码和省市',
                            duration:1200
                            // 为空的时候写一个修改的弹框 将数据修改
                        })
                        return
                    } else if (form.recharge == null) {
                        Toast.fail({
                            message: '请填写金额',
                            duration: 1200
                        })
                        return
                    } else if(form.isvvip==null){
                        Toast.fail({
                            message:'填写超级会员',
                            duration:1200
                        })
                        return
                    }
                    break
            };
            const loading = Toast.loading({
                mask: true,
                message: '提交中...',
                duration: 0
            })

            let jsonPatch = []
            let lng = 121.5058
            let lat = 31.30872
            let promise = getLngLat('mapper', true)
            promise.then((value) => {
                jsonPatch = generate(this.formPatch)
                // value值同样是获取的lng，lat，address这三个值，获取到这三个值以后进行如下的操作
                if (value && value.length === 3) {
                    // 2. 使用generate来讲，this.formPatch转换成我们想要的数据传递给后台
                    editOrder(this.orderId, jsonPatch, value[0], value[1], value[2]).then((response) => {
                        loading.clear()
                        this.$router.push({
                            path: '/order'
                        })
                        // 订单正确修改提交后， 跳转到 订单页面，就是未完成 的所有订单页面

                    }).catch((error) => {
                        loading.clear()
                        Toast.fail(error.error.message)
                    })
                } else {
                    //定位失败给默认地址
                    editOrder(this.orderId, jsonPatch, lng, lat, '上海市上海市杨浦区政立路487号（默认地址）').then((response) => {
                        loading.clear()
                        this.$router.push({
                            path: '/order'
                        })
                        // 订单正确修改提交后， 跳转到 订单页面，就是未完成 的所有订单页面

                    }).catch((error) => {
                        loading.clear()
                        Toast.fail(error.error.message)
                    })
                }
            }).catch((error) => {
                loading.clear()
                // 地图出错
                console.log(error)
                Toast.fail('定位失败,刷新重试')
            })
        },
        handleRechage () {
            this.rechargeShow = true
        },
        handleCancelRecharge () {
            this.rechargeShow = false
        },
        handleConfirmRecharge (value) {
            this.form.recharge = value
            this.rechargeShow = false
        },
        matchPhone (phone) {
            return `tel:${phone}`
        },
        handleCopySuccess() {
            this.$toast.success({
                message: '复制成功',
                duration: 600
            })
        },
        handleNavigation(address) {
            let aElement = document.createElement('a');
            // 根据地址算经纬度
            let result = transferLngLat('mapper', address);

            // 根据拿到的经纬度，进行跳转到  高德地图app进行导航，如果没有高德地图，会默认的使用高德地图的页面导航
            result.then((value) => {
                let lng = value[0],
                    lat = value[1];
                aElement.href = `https://uri.amap.com/navigation?from=&to=${lng},${lat},${address}&mode=ride&policy=0&src=mypage&coordinate=gaode&callnative=1`;
                aElement.click();
            })
        },
        handleVvip () {
            this.isVvipShow = true;
        },
        handleVvipConfirm (value) {
            let id = value.id;
            console.log(id);
            this.isVvipShow = false;
            this.isvvipLabel = value.name;
            this.form.isvvip = value.id;
        },
        handleVvipCancel () {
            this.isVvipShow = false
        }
    }
}
</script>

<style lang="scss">

@keyframes infiniteScroll {
    from {
        transform: rotate(0deg)
    } to {
        transform: rotate(360deg)
    }
}

.edit-order-page {
    height: 100vh;
    background: #f1f1f1;
    .title {
        display: flex;
        height: 80px;
        padding: 0 16px;
        line-height: 80px;
        background:rgb(255, 135, 75);
        .title-back {
            font-size: 48px;
            width: 48px;
        }
        .title-reload {
            width: 48px;
            text-align: center;
            font-size: 36px;
            .active {
                animation: 0.6s linear infinite infiniteScroll;
            }
        }
        .title-center {
            flex: 1;
            text-align: center;
            color: #ffffff;
            font-size: 28px;
        }
    }
    .content {
        margin-top: 24px;
        padding: 16px 24px;
        background: #fff;
        position: relative;
        .content-item {
            display: flex;
            line-height: 40px;
            padding: 16px 0;
            position: relative;
            font-size: 28px;
            &:not(:last-child)::after {
                content: ' ';
                position: absolute;
                pointer-events: none;
                box-sizing: border-box;
                left: 0;
                right: 0;
                bottom: 0;
                -webkit-transform: scaleY(0.5);
                transform: scaleY(0.5);
                border-bottom: 2px solid #ebedf0;
            }
            .item-label {
                flex: 1;
                max-width: 150px;
            }
            .item-value {
                position: relative;
                flex: 1;
                .item-input {
                    border: 0;
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    width: 92%;
                    resize: none;
                    display: block;
                    color: #323233;
                    box-sizing: border-box;
                    background-color: transparent;
                    outline: none;
                    &:disabled {
                        color: #686868;
                    }
                }
                .icon-wrap {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 36px;
                    height: 36px;
                    text-align:center;
                    vertical-align: middle;
                    .svg-icon {
                        width: 100%;
                        height: 100%;
                    }
                }
                .clipboard-unique {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 32px;
                    height: 32px;
                    vertical-align: top;
                    background: #fff;
                }
                .navigation-wrap {
                    position: absolute;
                    top: 0;
                    right: 42px;
                    width: 36px;
                    height: 36px;
                    vertical-align: top;
                    background: #fff;
                    .svg-icon {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
    .bottom {
        margin: 32px 24px 0;
        text-align: center;
        .confirm-btn {
            width: 100%;
            border: inherit;
            border-color: #000;
            border-radius: 8px;;
            outline: none;
            height: 72px;
            font-size: 30px;
            background: rgb(255, 135, 75);
            color: #ffffff;
        }
    }
}
</style>
