/*
 * @Author: Yuk
 * @Date:   2016-03-25 16:57:46
 * @Last Modified by:   yingyuk
 * @Last Modified time: 2016-03-26 16:01:12
 */

'use strict';
/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
function $(ele) {
    return document.getElementById(ele)
}
// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: "北京",
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
    var clazz = pageState.nowGraTime;
    var city = pageState.nowSelectCity;
    var value = chartData[city][clazz];
    var html = '';
    for (var index = 0; index < value.length; index++) {
        html += '<div class="' + clazz + '" style="height:' + value[index].height + 'px;background-color:' + value[index].color + '" title="' + value[index].title + ' ' + value[index].height + '"></div>';
    }
    var wrap = document.getElementsByClassName('aqi-chart-wrap')[0];
    wrap.innerHTML = html;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */

function graTimeChange() {
    var radio = $('form-gra-time').querySelector('input:checked');
    // 确定是否选项发生了变化 
    if (pageState.nowGraTime !== radio.value) {
        // 设置对应数据
        pageState.nowGraTime = radio.value;
        // 调用图表渲染函数
        renderChart();
    }
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(select) {
    // 确定是否选项发生了变化 
    // 设置对应数据
    pageState.nowSelectCity = select.options[select.selectedIndex].value;
    // 调用图表渲染函数
    renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    $('form-gra-time').addEventListener('change', function() {
        graTimeChange()
    })
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var citySelect = $('city-select');
    citySelect.innerHTML = '';
    for (var city in chartData) {
        var opt = document.createElement('option');
        opt.textContent = city;
        citySelect.appendChild(opt);
    }
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    var select = $('city-select');
    select.addEventListener('change', function(event) {
        citySelectChange(select)
    })

}

/**
 * 初始化图表需要的数据格式
 */
/* 数据格式演示
var aqiSourceData = {
  "北京": {},
  "沈阳": {
    "day": [
      {
        "title": "2016-03-31",
        "height": 485,
        "color": "black"
      }
    ],
    "week": [
      {
        "title": "第13周",
        "height": 205,
        "color": "red"
      }
    ],
    "month": [
      {
        "title": "1月",
        "height": 222,
        "color": "red"
      }
    ]
  }
}
*/
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    var color = '';
    for (var city in aqiSourceData) {
        chartData[city] = {
            day: [],
            week: [],
            month: []
        };
        var dayArr = chartData[city].day;
        var weekArr = chartData[city].week;
        var monthArr = chartData[city].month;
        for (var date in aqiSourceData[city]) {
            titleSet(dayArr, aqiSourceData[city][date], date);
        }
        var dayLen = dayArr.length;
        /**
         * sum:每周七天的空气质量和;
         * len: 统计的天数;
         * index;2016年的第几周;
         * avg : 平均数;
         */
        /**
         * 两段代码;很多一样,还可以精简;
         */
        for (var i = 0, sum = 0, len = 0, index = 1, avg = 0; i < dayLen; i++) {
            sum += dayArr[i].height;
            len++;
            // 当遍历7天; 算一周; 如果剩下的天数不够 也平均这几天;
            if ((i + 1) % 7 == 0 || i == dayLen - 1) {
                avg = Math.round(sum / len);
                titleSet(weekArr, avg, '第' + index + '周');
                len = 0;
                sum = 0;
                index++;
            }
        }
        for (var j = 0, sum = 0, len = 0, index = 1, avg = 0; j < dayLen; j++) {
            sum += dayArr[j].height;
            len++;
            if ((dayArr[j].title.slice(-2) == '01' || j == dayLen - 1) && j != 0) {
                avg = Math.round(sum / len);
                titleSet(monthArr, avg, index + '月');
                len = 0;
                sum = 0;
                index++;
            }
        }

    }

    function titleSet(obj, height, title) {
        var data = {
            title: '',
            height: '',
            color: ''
        };
        data.title = title;
        data.height = height;
        data.color = colorSet(height);
        obj.push(data);
    }

    function colorSet(height) {
        if (height < 100) {
            color = 'green';
        } else if (height < 200) {
            color = 'blue';
        } else if (height < 300) {
            color = 'red';
        } else if (height < 400) {
            color = 'purple';
        } else {
            color = 'black';
        }
        return color;
    }
}

/**
 * 初始化函数
 */
function init() {
    initAqiChartData();
    initGraTimeForm();
    initCitySelector();
    renderChart();
}

init();
