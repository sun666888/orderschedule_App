export default function createScript(url) {
    const scriptElement = document.createElement('script')
    document.body.appendChild(scriptElement)
    scriptElement.src = url
        // 三行代码， 创建script元素，插入到body中，添加url

    let promise = new Promise((resolve, reject) => {
        // 监听当scriptElement元素的src里面的代码加载完成后，执行下面的回调函数..
        scriptElement.addEventListener('load', (e) => {
                removeScript(scriptElement)
                resolve(e)
            }, false)
            // 如果scriptElement元素的src里面的代码加载失败后，执行下面的回调函数..
        scriptElement.addEventListener('error', (e) => {
            removeScript(scriptElement)
            reject(e)
        }, false)
    })

    //  返回的promise是指当scriptElement元素加载完成无论成功失败的promise
    return promise

    function removeScript(scriptElement) {
        document.body.removeChild(scriptElement)
    }
}