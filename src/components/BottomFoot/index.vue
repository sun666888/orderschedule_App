<template>
    <div class="yi-foot">
        <ul>
            <li @click="go(1)">
                <svg-icon :icon-class="number == 1 ? 'compass-active' : 'compass'" :class="number == 1 ? 'active' : ''"/>
                <p :class="number == 1 ? 'active' : ''">订单</p>
            </li>
            <li @click="go(2)">
                <svg-icon :icon-class="number == 2 ? 'people-active' : 'people'" :class="number == 2 ? 'active' : ''" />
                <p :class="number == 2 ? 'active' : ''">我的</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {
            compass: 'compass',
            people: 'people',
            number: 2
        }
    },
    created () {
        //  created 初始化可以理解为 加载到 该vue文件的时候就会执行如下代码
        if (this.$route.path === '/person') {
            this.number = 2
            this.people = 'people-active'
        } else {
            this.number = 1
        }
    },
    methods: {
        go (number) {
            this.number = number
            if (this.number === 1) {
                this.$router.push('/order')
            } else if (this.number === 2) {
                this.$router.push('/person')
            }
            //  this.$store.commit('SET_NUMBER', number) 相当于全局存储，比如当前点击了我的，要讲该数据全局存储，当用户返回该页面的时候还是    我的
            this.$store.commit('SET_NUMBER', number)
        }
    }
}
</script>

<style lang="scss" scoped>
.yi-foot {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 99;
    background: #ffffff;
    border-top: 1px solid #d2d2d2;
    ul {
        display: flex;
        li {
            display: flex;
            height: 96px;
            flex: 1;
            flex-direction: column;
            text-align: center;
            color: #666;
            &:first-child {
                border-right: 1px solid #d2d2d2;
            }
            .svg-icon {
                margin: 16px auto 8px;
                font-size: 28px;
                &.active {
                    font-size: 30px;
                }
            }
            p {
                margin: 0;
                font-size: 24px;
                &.active {
                    font-size: 108%;
                    color: rgba(255, 135, 75, 1)
                }
            }
        }
    }
}
</style>
