<template>
    <div class="order-page">
        <van-tabs v-model="active" sticky @click="handleTab">
            <van-tab title="未完成">
                <un-done ref="undone"></un-done>
            </van-tab>
            <van-tab title="YL">
                <yl ref="yl"></yl>
            </van-tab>
            <van-tab title="改约单">
                <reassigning ref="reassigning"></reassigning>
            </van-tab>
            <van-tab title="退单转物流">
                <refund ref="refund"></refund>
            </van-tab>
            <van-tab title="成功单">
                <complete ref="complete"></complete>
            </van-tab>
        </van-tabs>
        <bottom-foot></bottom-foot>
    </div>
</template> 

<script>
import BottomFoot from '../../components/BottomFoot'
import UnDone from './UnDone'
import Yl from './Yl'
import Reassigning from './Reassigning'
import WaitConfirm from './WaitConfirm'
import Complete from './Complete'
import Refund from './Refund'
import { Tab, Tabs, Toast } from 'vant'

export default {
    data () {
        return {
            active: 0
        }
    },
    components: {
        UnDone,
        Yl,
        Reassigning,
        WaitConfirm,
        Complete,
        Refund,
        BottomFoot,
        [Tabs.name]: Tabs,
        [Tab.name]: Tab,
        [Toast.name]: Toast
    },
    mounted() {
        // nextTick 操作DOM的时候一般在nextTick内部去写
        this.$nextTick(() => {
            this.$refs.undone.$emit('bridge')
        })
    },
    methods: {
        handleTab (index, title) {
            switch (title) {
                case '未完成':
                    this.$nextTick(() => {
                        this.$refs.undone.$emit('bridge')
                    })
                    break
                case 'YL':
                    this.$nextTick(() => {
                        this.$refs.yl.$emit('bridge')
                    })
                    break
                case '改约单':
                    this.$nextTick(() => {
                        this.$refs.reassigning.$emit('bridge')
                    })
                    break
                case '退单转物流':
                    this.$nextTick(() => {
                        this.$refs.refund.$emit('bridge')
                    })
                    break
                case '成功单':
                    this.$nextTick(() => {
                        this.$refs.complete.$emit('bridge')
                    })
                    break
            }
        }
    }
}
</script>

<style>
.order-page {
    background: #f1f1f1;
}
</style>
