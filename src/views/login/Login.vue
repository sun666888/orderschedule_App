<template>
    <div class="login-page">
        <div class="swiper-container_login swiper-container-horizontal">
            <div class="swiper-wrapper">

                <!-- login -->
                <div class="swiper-slide page-bg">
                    <span class="login-back">
                        <svg-icon icon-class="left" @click.native="goBack" />
                    </span>
                    <div class="slideGest">
                        <img src="../../assets/images/gesture_left.png" alt="error image" class="slide-img" />
                        <span class="slide-text">左滑注册</span>
                    </div>
                    <form class="login-form">
                        <div class="form-title">登 录</div>
                        <div class="form-item">
                            <div class="form-label">
                                <svg-icon icon-class="phone" />
                                <input type="tel" class="login-phone form-input" v-model.trim="loginPhone" placeholder="手机号" maxlength="11" minlength="11" @blur="handlePhoneBlur" @input="handlePhoneInput">
                            </div>
                            <transition
                                name="custom-phone-transition"
                                enter-active-class="animated fadeInDown"
                                leave-active-class="animated fadeOutDown"
                            >
                                <p class="error-info" v-show="loginPhoneFlag">请输入11位手机号</p>
                            </transition>
                        </div>
                        <div class="form-item">
                            <div class="form-label">
                                <svg-icon icon-class="password" />
                                <input type="password" class="login-password form-input" v-model.trim="loginPassword" placeholder="密码"  @blur="handlePasswordBlur" @input="handlePasswordInput">
                            </div>
                            <transition
                                name="custom-password-transition"
                                enter-active-class="animated fadeInDown"
                                leave-active-class="animated fadeOutDown"
                            >
                                <p class="error-info" v-show="loginPasswordFlag">请输入密码</p>
                            </transition>
                        </div>
                        <button class="login-submit" @click="handleLogin" :disabled="!isLoginPhone || !isLoginPassword" :class="[isLoginPhone && isLoginPassword ? 'active' : '']">登 录</button>
                    </form>
                </div>

                <!-- register -->
                <div class="swiper-slide page-bg">
                    <span class="login-back">
                        <svg-icon icon-class="left" @click.native="goBack" />
                    </span>
                    <div class="slideGest slideGest_reg">
                        <img src="../../assets/images/gesture_right.png" alt="error image" class="slide-img" />
                        <span class="slide-text">右滑登录</span>
                    </div>
                    <form class="login-form">
                        <div class="form-title">注册</div>
                        <div class="form-item">
                            <div class="form-label">
                                <svg-icon icon-class="username" />
                                <input type="text" class="login-phone form-input" v-model.trim="regUsername" placeholder="登录名">
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="form-label">
                                <svg-icon icon-class="realname" />
                                <input type="text" class="login-phone form-input" v-model.trim="regRealname" placeholder="姓名">
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="form-label">
                                <svg-icon icon-class="phone" />
                                <input type="text" class="login-phone form-input" v-model.trim="regPhone" placeholder="手机号">
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="form-label">
                                <svg-icon icon-class="password" />
                                <input type="password" class="login-password form-input" v-model.trim="regPassword" placeholder="密码">
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="form-label">
                                <svg-icon icon-class="address" />
                                <input type="text" class="login-password form-input" v-model.trim="regAddress" placeholder="必须是正确的地址">
                            </div>
                        </div>
                        <transition
                            name="custom-all-transition"
                            enter-active-class="animated zoomIn"
                            leave-active-class="animated zoomOutLeft"
                        >
                            <p class="all-error-info" style="color: #ff874B;" v-show="errorInfo">请填写所有正确的信息</p>
                        </transition>
                        <button class="login-submit active" @click="handleReg">注 册</button>
                    </form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import Swiper from '../../../node_modules/swiper/dist/js/swiper.min.js'
import { register } from '@/services/user.service.js'
import { Dialog, Toast } from 'vant'

export default {
    data () {
        return {
            loginPhone: '',
            loginPassword: '',
            regUsername: '',
            regRealname: '',
            regPhone: '',
            regPassword: '',
            regAddress: '',
            loginPhoneFlag: false,
            loginPasswordFlag: false,
            isLoginPhone: false,
            isLoginPassword: false,
            errorInfo: false
        }
    },
    components: {
        [Dialog.name]: Dialog,
        [Toast.name]: Toast
    },
    mounted () {
        // $setgoindex()：当浏览的history记录中只有一条记录时，那么此时给url上添加标识。当用户在点击返回上一页按钮的时候，保持当前页面。
        this.$setgoindex()
        //  swiper初始化的方式，具体参见官网
        let swiper = new Swiper('.swiper-container_login', {
            initialSlide: 0,
            autoplay: false
        })
        // 在login页面中默认是在登录的页面中
        if (this.$route.query.page !== undefined) {
            swiper.slideTo(1, 0, false)
        }
    },
    methods: {
        goBack () {
            if (this.$route.query.goindex === 'true') {
                this.$router.push('/')
            } else {
                this.$router.back(-1)
            }
        },
        handleLogin (e) {
            // 阻止默认行为
            e.preventDefault()
            const toast = Toast.loading({
                mask: true,
                message: '登录中...',
                duration: 0
            })
            const userInfo = {
                loginName: this.loginPhone,
                password: this.loginPassword
            }
            //  1. 通过vuex的方式进行调用LoginByname => store.js
            this.$store.dispatch('LoginByname', userInfo).then(() => {
                toast.clear()
                // 接口正常放回，跳转到order路由
                this.$router.push('/order')
            }).catch(err => {
                // 接口报错，比如用户名密码错误
                toast.clear()
                this.$toast(err.error.message)
            })
        },
        handleReg (e) {
            e.preventDefault()
            let regPhone = /^1[0-9]{10}$/
            let form = {
                regUsername: this.regUsername,
                regRealname: this.regRealname,
                regPhone: this.regPhone,
                regPassword: this.regPassword,
                regAddress: this.regAddress
            }
            let toast = null
            if (form.regUsername && form.regRealname && regPhone.test(form.regPhone) && form.regPassword && form.regAddress) {
                // 所有信息全部填写成功
                toast = Toast.loading({
                    mask: true,
                    message: '注册中...'
                })
                this.errorInfo = false
                //  register方法 是user.service.js中的注册方法
                register(form).then(response => {
                    toast.clear()
                    this.$toast.success('注册成功')
                }).catch(err => {
                    toast.clear()
                    this.$toast.fail(err.error.message)
                })
            } else {
                this.errorInfo = true
            }
        },
        handlePhoneBlur () {
            //  用户在输入框失去焦点后触发的事件，用来校验
            let regPhone = /^1[0-9]{10}$/
            if (regPhone.test(this.loginPhone)) {
                this.loginPhoneFlag = false
            } else {
                this.loginPhoneFlag = true
            }
        },
        handlePasswordBlur () {
            // handlePhoneBlur， handlePasswordBlur， handlePhoneInput， handlePasswordInput这几个方法其实都很重复，都是用来校验的，也就是比如 手机号要满足11位数，比如密码不能为空，这样的校验过程
            if (this.loginPassword) {
                this.loginPasswordFlag = false
            } else {
                this.loginPasswordFlag = true
            }
        },
        handlePhoneInput () {
            let regPhone = /^1[0-9]{10}$/
            if (regPhone.test(this.loginPhone)) {
                this.isLoginPhone = true
            } else {
                this.isLoginPhone = false
            }
        },
        handlePasswordInput () {
            if (this.loginPassword) {
                this.isLoginPassword = true
            } else {
                this.isLoginPassword = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
//  此种方式用来引入一个swiper.min.css
@import url("../../../node_modules/swiper/dist/css/swiper.min.css");

//  @keyframes swing   声明一个swing的动画
@keyframes swing {
    0% {
       -webkit-transform: rotate(0);
       -webkit-transform-origin: bottom center;
       -moz-transform: rotate(0);
       -moz-transform-origin: bottom center;
       transform: rotate(0);
       transform-origin: bottom center;
    }
    100% {
       -webkit-transform: rotate(-30deg);
       -webkit-transform-origin: bottom center;
       -moz-transform: rotate(-30deg);
       -moz-transform-origin: bottom center;
       transform: rotate(-30deg);
       transform-origin: bottom center;
    }
}

.animated {animation-duration: 0.5s;}

.login-page {
    min-height: 100vh;
    .swiper-container_login {
        height: 100vh;
        .swiper-wrapper {
            height: 100vh;
            .swiper-slide {
                &.page-bg {
                    background: rgba(255, 173, 98, .9);
                }
                height: 100vh;
                .login-back {
                    display: block;
                    width: 100%;
                    padding: 24px 0;
                    .svg-icon {
                        margin-left: 12px;
                        width: 72px;
                        height: 72px;
                        font-size: 50px;
                        color: #ffffff;
                    }
                }
                .slideGest {
                    position: relative;
                    &.slideGest_reg {
                        overflow: auto;
                        .slide-img {
                            float: right;
                            margin-right: 80px;
                            margin-left: 30px;
                        }
                        .slide-text {
                            float: right;
                            margin-top: 40px;
                        }
                    }
                    .slide-img {
                        width: 80px;
                        height: 80px;
                        margin-left: 80px;
                        vertical-align: bottom;
                        -webkit-animation: swing 1s ease-in-out alternate infinite;
                        -moz-animation: swing 1s ease-in-out alternate infinite;
                        animation: swing 1s ease-in-out alternate infinite;
                    }
                    .slide-text {
                        font-family: cursive;
                        font-size: 32px;
                        color: #ffffff;
                        font-weight: 600;
                    }
                }
                .login-form {
                    position: relative;
                    width: 76%;
                    height: 780px;
                    margin: 64px auto 0;
                    padding: 4%;
                    background: #ffffff;
                    border-radius: 24px;
                    .form-title {
                        text-align: center;
                        font-size: 48px;
                        color: #ff874B;
                    }
                    .form-item {
                        position: relative;
                        margin-top: 44px;
                        .form-label{
                            position: relative;
                            display: flex;
                            padding-bottom: 1px;
                            border-bottom: 1px solid #e5e5e5;
                            .svg-icon {
                                width: 44px;
                                height: 44px;
                                margin-top: 16px;
                            }
                            .form-input {
                                width: 96%;
                                height: 60px;
                                font-size: 30px;
                                text-indent: 12px;
                                color: #666;
                                border: none;
                                outline: none;
                            }
                        }
                        .error-info {
                            position: absolute;
                            margin: 0;
                            color: #ff874B;
                            margin-top: 3px;
                        }
                    }
                    .login-submit {
                        display: block;
                        width: 90%;
                        padding: 0;
                        height: 76px;
                        line-height: 76px;
                        outline: none;
                        border: none;
                        border-radius: 38px;
                        position: absolute;
                        bottom: 40px;
                        color: #ffffff;
                        font-size: 36px;
                        &.active {
                            background: #ff874b;
                            color: #fff;
                            -webkit-box-shadow: 0 5px 10px #ff874b;
                            box-shadow: 0 5px 10px #ff874b;
                        }
                    }
                }
            }
        }
    }
}

</style>
