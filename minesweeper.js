var mineApp = function() {
    this.randomLineArr = []
    this.clicked = []
    this.step = 0
}

function boom(element) {
    console.log('boom');
    toggleClass(element, 'mine9')
    if (!element.classList.contains('uncovered')) {
        element.classList.add('uncovered')
    }
}

function commonBoom(element) {
    element.innerHTML = element.dataset.value
    if (!element.classList.contains('uncovered')) {
        element.classList.add('uncovered')
    }
    //gVar.clicked.push(element.id)
}

function showAround(element) {
    let x = element.dataset.locationx
    let y = element.dataset.locationy
    console.log('showAround', `x=${x} y=${y}`);
    // console.log('showAround', `e("#55")=${e("55")}`);
    for (let i = (Number(y) - 1); i <= (Number(y) + 1); i++) {
        for (let j = (Number(x) - 1); j <= (Number(x) + 1); j++) {
            let tempElement = document.getElementById(`${j}${i}`)
            if (tempElement) {
                console.log('showAround', tempElement.id);
                commonBoom(tempElement)
                if (tempElement.dataset.value == 0) {
                    if (!gVar.clicked.includes(tempElement.id)) {
                        tempElement.click()
                    }
                    console.log('showAround', `tempElement.dataset.value = ${tempElement.dataset.value}`);
                }
            }
        }
    }
}




function rightClick() {
    function myRightClick() {
        log("右击成功！")
        console.log(this.classList);
        toggleClass(this, 'mineMayBe')
        return false
    }
    let mines = eAll(".mine")
    for (var i = 0; i < mines.length; i++) {
        mines[i].oncontextmenu = myRightClick
    }
}


function check() {
    console.log('check');
    bindAll('.mine', 'click', (event) => {
        console.log('check', `event.target.innerHTML = ${event.target.innerHTML}`)
        console.log('check', `event.target.data.x = ${event.target.dataset.locationx}`)
        console.log('check', `event.target.data.y = ${event.target.dataset.locationy}`)
        console.log('check', `event.target.data.id = ${event.target.id}`)
        console.log('check', `event.target.data.value = ${event.target.dataset.value}`)
        let element = event.target
        let mineValue = event.target.dataset.value
        gVar.clicked.push(element.id)
        switch (mineValue) {
            case '9':
                console.log('check-boom');
                boom(element)
                break;
            case '0':
                console.log('check-mineValue = 0');
                showAround(element)
                break;
            default:
                console.log('check-mineValue = 0 - 9');
                commonBoom(element)
        }
    })
}

var random01 = function(n) {
    /*
    随机生成0-n 之间的一个数
    js 标准数学库有一个随机数函数
    Math.random()
    它返回 0 - 1 之间的小数

    用它实现本函数, 返回 0 或 1
    */
    // r 是一个 0 - 1 的小数
    var r = Math.random()
        // * 100000, 现在是 0 - 100000 的小数了
    r *= 100000
        // 取整, 现在是 0 - 100000 的整数了
    r = Math.floor(r)
        // 用余数来取随机 0-n
    return r % n
}

var randomLine01 = function(n) {
    //随机生产一串01
    /*
    返回一个只包含了 0 1 的随机 array, 长度为 n
    假设 n 为 5, 返回的数据格式如下(这是格式范例, 真实数据是随机的)
    [0, 0, 1, 0, 1]
    */
    var arr = []
    for (var i = 0; i < n; i++) {
        arr[i] = random01()
    }
    return arr
}

var randomLine09 = function(n, x) {
    //随机成生x个9
    /*
    返回一个只包含了 0 9 的随机 array, 长度为 n
    假设 n 为 5, x 为 2 ,返回的数据格式如下(这是格式范例, 真实数据是随机的)
    [0, 0, 9, 0, 9]
    */

    var arr = []
    var temp = []
    for (let i = 0; i < x; i++) {
        let num = random01(n)
        if (temp.includes(num)) {
            i--
            continue
        }
        temp[i] = num
    }
    console.log('randomLine01', `temp = ${temp}`);
    for (let i = 0; i < n; i++) {
        arr[i] = 0
    }
    for (let i = 0; i < temp.length; i++) {
        arr[temp[i]] = 9
    }
    console.log('randomLine01', `arr = ${arr}`);
    return arr
}

function randomLine(m, n, x) {
    //随机生成 M*N 0 9矩阵 有 x 个 9
    var arr = []
    let temp = randomLine09(m * n, x)
    for (var i = 0; i < n; i++) {
        arr.push(temp.slice(i * m, m * (i + 1)))
        log('randomLine', `temp = ${temp.slice(i, m*(i+1))}`)
    }
    return arr
}

var markedSquare = function(array) {
    //扫雷主逻辑
    /*
    array 是一个「包含了『只包含了 0 9 的 array』的 array」
    返回一个标记过的 array
    ** 注意, 使用一个新数组来存储结果, 不要直接修改老数组

    范例如下, 这是 array
    [
        [0, 9, 0, 0],
        [0, 0, 9, 0],
        [9, 0, 9, 0],
        [0, 9, 0, 0],
    ]

    这是标记后的结果
    [
        [1, 9, 2, 1],
        [2, 4, 9, 2],
        [9, 4, 9, 2],
        [2, 9, 2, 1],
    ]

    规则是, 0 会被设置为四周 8 个元素中 9 的数量
    */
    var arr = array.slice(0)
    for (var i = 0; i < array.length; i++) {
        for (var j = 0; j < array[i].length; j++) {
            if (array[i][j] === 0) {
                // console.log('array[i][j] === 0', `i = ${i} j =${j}`);
                var score = 0
                for (var m = -1; m <= 1; m++) {
                    for (var n = -1; n <= 1; n++) {
                        if ((i + m) < 0 || (j + n) < 0 || (i + m) >= array.length || (j + n) > array[i].length) {
                            continue
                        } else {
                            // console.log('array[i + m][j + n] = ', `${array[i + m][j + n]} ; i + m =${i+m} j + n = ${j+ n}`);
                            if (array[i + m][j + n] === 9) {
                                score++
                            }
                        }
                    }
                }
                arr[i][j] = score
                    // console.log(arr);
            }
        }
    }
    return arr
}

function makeRandomLine(buttonId) {
    console.log('makeRandomLine', `buttonId = ${buttonId}`);
    switch (buttonId) {
        case "id-button-primary":
            var arr = randomLine(7, 5, 5)
            break;
        case "id-button-middle":
            var arr = randomLine(9, 7, 10)
            break;
        case "id-button-high":
            var arr = randomLine(15, 9, 20)
            break;
        default:
            console.log('makeRandomLine false');
            var arr = []
    }
    gVar.randomLineArr = arr
    return markedSquare(arr)
}

function chessBoardTemplate(arr) {
    var t = ''
    for (var i = 0; i < arr.length; i++) {
        t += `
        <tr class="covered">`
        for (var j = 0; j < arr[i].length; j++) {
            //console.log('chessBoardTemplate', arr[i][j])
            let location = j.toString() + i.toString()
            let locationInt = Number(location)
            t += `
            <td id=${j}${i} class="mine" data-locationX=${j} data-locationY=${i} data-value=${arr[i][j]}></td>`
        }
        t += `
        </tr>`
    }
    //console.log('chessBoardTemplate', t);
    return t
}

function buildLayout(t) {
    let container = e('#id-draw-table')
    removeChildAll('id-draw-table')
    appendHtml(container, t)
}

function generateLayout() {
    let buttonList = eAll('.button')
    for (var i = 0; i < buttonList.length; i++) {
        let button = buttonList[i]
        bindEvent(button, 'click', () => {
            let arr = makeRandomLine(button.id)
            console.log('generateLayout', arr);
            let t = chessBoardTemplate(arr)
            buildLayout(t)
            check()
            rightClick()
        })
    }
}

function draw() {
    console.log('draw');
    let canvas = e("#id-draw-table")
    if (canvas == null) {
        console.log('canvas false')
        return false
    }

    let context = canvas.getContext("2d")
        //实践表明在不设施fillStyle下的默认fillStyle=black
    context.fillRect(0, 0, 100, 100)
        //实践表明在不设施strokeStyle下的默认strokeStyle=black
    context.strokeRect(120, 0, 100, 100)

    //设置纯色
    context.fillStyle = "red"
    context.strokeStyle = "blue"
    context.fillRect(0, 120, 100, 100)
    context.strokeRect(120, 120, 100, 100)

    //设置透明度实践证明透明度值>0,<1值越低，越透明，值>=1时为纯色，值<=0时为完全透明
    context.fillStyle = "rgba(255,0,0,0.2)"
    context.strokeStyle = "rgba(255,0,0,0.2)"
    context.fillRect(240, 0, 100, 100)
    context.strokeRect(240, 120, 100, 100)
}

function __main() {
    // let arr = randomLine(10, 7)
    // console.log(arr);
    // console.log(markedSquare(arr));
    gVar = new mineApp()
    console.log('gVar= ', gVar);
    generateLayout()
}

__main()
