<template>
<!--  这里其实就是一个提示页面，比如用户输入了我们不存在的路由地址    ,比如localhost:8080/un/actios    那么路由会直接匹配到这个页面， 然后页面中要做的就是提示用户  返回首页。 -->
    <div class="page404">
        <img src="../../assets/images/404.gif" alt="error" width="100%">
        <div class="info">页面走丢了Oops...</div>
        <a @click="$router.push('/')">返回首页</a>
    </div>
</template>

<script>
</script>

<style lang="scss">
.page404 {
    text-align: center;
    img {
        margin-top: 80px;
    }
    .info {
        margin-bottom: 24px;
        text-align: center;
        color: rgb(228, 137, 92);
        font-size: 28px;
    }
    a {
        margin-top: 24px;
        font-size: 30px;
        color: rgb(255, 60, 0);
        text-decoration: underline;
    }
}
</style>
