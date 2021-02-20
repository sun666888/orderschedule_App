import createScript from './createScript'

export default function getLngLat(elementClass, needAddress) {
    // 调用createScript来创建一个script元素，见createScript.js
    const promise1 = createScript(`https://webapi.amap.com/maps?v=1.4.10&key=${process.env.VUE_APP_MAPKEY}`)

    // promise1.then() 即是表示当script元素创建成功或则失败的情况下执行的回调...
    const promise2 = promise1.then(() => {
        // script元素src加载成功后执行如下代码
        return new Promise((resolve, reject) => {
            // 参照高德地图，调用地图的方法。
            const map = new AMap.Map(elementClass)
            map.plugin('AMap.Geolocation', () => {
                let geolocation = new AMap.Geolocation({
                    enableHighAccuracy: true,
                    timeout: 5000
                })
                geolocation.getCurrentPosition()
                AMap.event.addListener(geolocation, 'complete', onComplete)
                AMap.event.addListener(geolocation, 'error', onError)
            })

            function onComplete(data) {
                let lng = data.position.lng
                let lat = data.position.lat

                if (needAddress) {
                    // lng lat address
                    map.plugin('AMap.Geocoder', function () {
                        var geocoder = new AMap.Geocoder({
                            city: '021'
                        })
                        geocoder.getAddress([lng, lat], function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                let address = result.regeocode.formattedAddress
                                resolve([lng, lat, address])
                                // resolve([lng, lat, address])
                                // 关键的代码， 将异步获取到的值，通过resolve([lng, lat, address])成功的返回出去，这样也就完成了我们这个js文件的目的，获取lng,lat,address，
                                // 在页面中 获取值 进行下一步操作
                            }
                        })
                    })
                } else {
                    resolve([lng, lat])
                }
            }

            function onError(error) {
                let lng = 121.5058
                let lat = 31.30872
                resolve([lng, lat])
                console.log('error:' + error)
            }
        })
    })
    let result = promise2.then((value) => {
        //  value其实就是上面的 resolve([lng, lat, address]) 所返回的值，这里将value返回出去
        return value
    })
    return result
}