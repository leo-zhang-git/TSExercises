let a = new Promise<string>((resolve, reject) => {
    let flag = true
    if(flag){
        setTimeout(_=>{
            resolve('1 ok')
        }, 2000)
    }
    else{
        reject(RangeError)
    }
})

async function Test(){
    let ret = await a
    console.log(ret)
}
Test()
// a.then((s)=>{console.log(s)}).catch(_=>{console.log("Faild")})