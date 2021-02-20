<template>
  <div class="edit-order-page">
      <div class="title">
            <span class="title-back" @click="goBack">
                <svg-icon icon-class="left"  />
            </span>
            <div class="title-center">
                用户信息登记
            </div>
        </div>
        <div class="content">
            <form action="/">
                <div class="content-item">
                    <div class="item-label">姓名：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="姓名" v-model="form.consignee"/>
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">所属团队：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="所属团队" @click="handleState('Team')" v-model="form.Team"/>
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">身份证号：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="身份证号" v-model="form.IDnumber">
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">银行卡号：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="银行卡号" v-model="form.BankNumber"/>
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">开户行：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="开户行" v-model="form.OpeningBank"/>
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">区域：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="区域" v-model="form.Region"/>
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">人员性质：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="人员性质" @click="handleState('PersonnelNature')" v-model="form.PersonnelNature"/>
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">在职情况：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="在职情况" @click="handleState('Incumbency')" v-model="form.Incumbency" />
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">入职时间：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="入职时间" @click="handleEntryTime('InitiationTime')" v-model="form.InitiationTime" />
                    </div>
                </div>
                <div class="content-item" v-if="form.Incumbency && form.Incumbency == '离职'">
                    <div class="item-label">离职时间：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="离职时间" @click="handleEntryTime('DepartureTime')" v-model="form.DepartureTime" />
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">电话：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="电话" v-model="form.phone"/>
                    </div>
                </div>
                <div class="content-item">
                    <div class="item-label">马上购工号：</div>
                    <div class="item-value">
                        <input type="text" class="item-input" placeholder="所用马上购工号" v-model="form.JobNumber"/>
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
                @confirm="handleConfirmState"
                :loading="loading"
                />
        </van-popup>
        <!-- 入职时间 -->
        <van-popup v-model="timePopShow" position="bottom">
            <van-datetime-picker
                v-model="InitiationTime"
                type="datetime"
                :min-date="minDate"
                @cancel="handleCancelVisit"
                @confirm="handleConfirmVisit"
            />
        </van-popup>
  </div>
</template>

<script>
import { Picker, Popup, DatetimePicker, Field, Toast } from 'vant'
import moment from 'moment'
import { fetchEachOrder, submission, teamOrder } from '../../services/order.service'
import { observe } from 'fast-json-patch'

export default {
    data () {
        return {
            form: {
                consignee: '',
                Team: '',
                IDnumber: '',
                BankNumber: '',
                OpeningBank: '',
                Region: '',
                PersonnelNature: '',
                Incumbency: '',
                InitiationTime: '',
                DepartureTime: '',
                phone: '',
                JobNumber: ''
            },
            active: false,
            popShow: false,
            orderId: '',
            stateList: [],
            timePopShow: false,
            InitiationTime: '',
            minDate: new Date(),
            loading: true,
            timeType: '',
            stateType: ''
        }
    },
    components: {
        [Picker.name]: Picker,
        [Popup.name]: Popup,
        [DatetimePicker.name]: DatetimePicker,
        [Field.name]: Field,
        [Toast.name]: Toast
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
        handleReload () {
            this.active = true
            this.getOrder()
        },
        handleState (stateType) {
            this.popShow = true
            this.loading = true
            this.stateType = stateType
            if (this.stateType === 'Team') {
                teamOrder().then(response => {
                    this.loading = false
                    this.stateList = response.data
                    console.log(response)
                })
            } else if (this.stateType === 'PersonnelNature') {
                this.loading = false
                this.stateList = ['组长', '组员']
            } else if (this.stateType === 'Incumbency') {
                this.loading = false
                this.stateList = ['在职', '离职']
            }
        },
        handleCancelState () {
            this.popShow = false
        },
        handleConfirmState (value, index) {
            this.popShow = false
            this.form[this.stateType] = value
        },
        // 入职时间
        handleEntryTime (timeType) {
            this.timeType = timeType
            this.timePopShow = true
        },
        handleCancelVisit () {
            this.timePopShow = false
        },
        handleConfirmVisit (value) {
            let formatTime = moment(value).format('YYYY-MM-DD')
            //  将value值转化成 2019-04-04这样的时间格式
            this.timePopShow = false
            this.form[this.timeType] = formatTime
        },
        // 提交
        handleSubmit (e) {
            e.preventDefault()
            let forminit = {
                consignee: this.form.consignee,
                Team: this.form.Team,
                IDnumber: this.form.IDnumber,
                BankNumber: this.form.BankNumber,
                OpeningBank: this.form.OpeningBank,
                Region: this.form.Region,
                PersonnelNature: this.form.PersonnelNature,
                Incumbency: this.form.Incumbency,
                InitiationTime: this.form.InitiationTime,
                DepartureTime: this.form.DepartureTime,
                phone: this.form.phone,
                JobNumber: this.form.JobNumber
            }
            console.log(this.form)
            console.log(this.form.consignee)
            for (let key in this.form) {
                if (this.form[key] === '') {
                    Toast.fail({
                        message: '所有信息不能为空',
                    })
                    return
                }
            }
            const loading = Toast.loading({
                mask: true,
                message: '提交中...',
                duration: 0
            })
            let toast = null
            submission(forminit).then(response => {
                const loading = Toast.loading({
                mask: true,
                message: '提交成功...',
                duration: 0
            })
            loading.clear()
                this.$router.push({
                    path: '/person'
                })
            console.log(response)
            }).catch(err => {
                // toast.clear()
                loading.clear()
                this.$toast.fail(err.error.message)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
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
                max-width: 170px;
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
