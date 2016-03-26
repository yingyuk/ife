/*
 * @Author: Yuk
 * @Date:   2016-03-25 12:46:26
 * @Last Modified by:   Yuk
 * @Last Modified time: 2016-03-25 15:44:14
 */

'use strict';
(function() {
    function $(ele) {
        return document.getElementById(ele)
    }
    /**
     * aqiData，存储用户输入的空气指数数据
     * 示例格式：
     * aqiData = {
     *    "北京": 90,
     *    "上海": 40
     * };
     */
    var aqiData = {};
    /**
     * 从用户输入中获取数据，向aqiData中增加一条数据
     * 然后渲染aqi-list列表，增加新增的数据
     */
    function addAqiData() {
        var flag = false;
        var city = $('aqi-city-input').value.trim();
        var value = $('aqi-value-input').value.trim();
        if (/^[\u4e00-\u9fa5a-zA-Z\s]+$/.test(city) && /^\d+$/.test(value)) {
            aqiData[city] = value;
            flag = true;
        } else {
            flag = false;
        }
        return flag;
    }

    /**
     * 渲染aqi-table表格
     */

    function renderAqiList() {
        var table = $('aqi-table');
        table.innerHTML = '';
        for (var item in aqiData) {
            var tr = document.createElement('tr');
            tr.innerHTML = '<td>' + item + '</td><td>' + aqiData[item] + '</td><td><button>删除</button></td>';
            var button = tr.querySelector('button');
            var that = item;
            table.appendChild(tr);
            delBtnHandle(button, table, item)
        }
    }

    /**
     * 点击add-btn时的处理逻辑
     * 获取用户输入，更新数据，并进行页面呈现的更新
     */
    function addBtnHandle() {
        var tips = $('tips')
        if (addAqiData()) {
            renderAqiList();
            tips.style.color = 'gray';
        } else {
            tips.style.color = 'red';
        }
    }

    /**
     * 点击各个删除按钮的时候的处理逻辑
     * 获取哪个城市数据被删，删除数据，更新表格显示
     */
    function delBtnHandle(button, table, item) {
        // do sth.
        button.addEventListener('click', function() {
            table.removeChild(this.parentNode.parentNode);
            delete aqiData[item];
        });
    }

    function init() {
        // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
        var addBtn = $('add-btn');
        addBtn.addEventListener('click', function(event) {
                addBtnHandle();
            })
            // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    }

    window.onload = function() {
        init();
    }

})();
