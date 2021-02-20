import createScript from './createScript'

export default function transferLngLat(elementClass, address) {
    // script Promise object， 创建一个script元素
    const promise1 = createScript(`https://webapi.amap.com/maps?v=1.4.10&key=${process.env.VUE_APP_MAPKEY}`)

    const promise2 = promise1.then(() => {
        // success create Script
        return new Promise((resolve, reject) => {
            const map = new AMap.Map(elementClass)
            map.plugin('AMap.Geocoder', () => {
                var geocoder = new AMap.Geocoder({
                    // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                    city: 'shanghai'
                })
                geocoder.getLocation(address, function(status, result) {
                    if (status === 'complete' && result.info === 'OK') {
                        // result中对应详细地理坐标信息
                        let lng = result.geocodes[0].location.lng,
                            lat = result.geocodes[0].location.lat;
                        resolve([lng, lat])
                            // 关键代码，将lng，lat返回出去，这样就完成了 将传递过来的adderss转换成lng，lat。
                    }
                })

            })

        })
    })
    let result = promise2.then((value) => {
        return value
    })
    return result
}