<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
    height: 100vh;
    // vh是一个高度单位，表示沾满全屏，无论是什么屏幕
}

// reset css
ul, li{
    list-style: none;
    padding: 0;
    margin: 0;
}
a {
    text-decoration: none;
    color: #000;
}

// remove default input textarea select yellow background； 移除在input框中，当值已经存在的时候，背景框会是黄色的，将这样的默认样式给移除。
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset;
}

</style>
