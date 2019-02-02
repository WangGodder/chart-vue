import Chart from '../../node_modules/chart.js/src/chart';
import $ from "jquery";


export const colors = {
    "black": "#000000",
    "white": "#FFFFFF",
    "red": "#FF0000",
    "rebeccapurple": "#663399",
    "lime": "#00FF00",
    "green": "#008000",
    "blue": "#0000FF",
    "yellow": '#FFFF00',
    "aqua": "#00FFFF",
    "pink": "#FF00FF",
    "gold": "#FFD700",
    "gray": "#808080"
}

export const legendPositions = ["top", "right", "bottom", "left", "hide"];
export const chartTypes = ["line", "bar", "radar", "pie", "doughnut"];
export const colorsArray = ["red", "rebeccapurple", "lime", "green", "blue", "yellow", "aqua", "pink", "gold", "gray", "black", "white"];

/**
 * get base data from url(if port is sure)
 * @param url the url to get data
 * @returns {*}
 */
export function getBaseData(url) {
    let data = null;
    $.ajax({
        url: url,
        type: 'Get',
        dataType: "jsonp",
        jsonp: "callback",
        async: false,
        success: function (baseData) {
            alert("baseData");
            data =  JSON.parse(baseData);
        },
        error: function () {
            alert('error');
        }
    });
    alert(data);
    return data;
}

/**
 * transform base data to chart config object
 * @param baseData the data to transform
 * @param type the type of chart you want
 * @returns {string} chart config json to string
 */
export function baseDataToChartConfig(baseData, type) {
    let data, options;
    if (type == 'pie' || type == 'doughnut') {
        data = new Data(baseData.labels, getDefaultDataSets(baseData.datas, baseData.datasetLabels,false, true, true));
    } else {
        data = new Data(baseData.labels, getDefaultDataSets(baseData.datas, baseData.datasetLabels));
    }
    options = getNormalOptions(baseData.title, false);
    let chart = new ChartInfo(type, data, options);
    let json = JSON.stringify(chart);
    return json;
}

/**
 * get list of dataset with default parameter
 * @param datas the list of data list
 * @param datasetLabels the label for each dataset
 * @param fill if true, the line will fill
 * @param multColor each data has a different color
 * @param borderWhite border is white
 * @returns {Array} array of dataset
 */
function getDefaultDataSets(datas, datasetLabels, fill=false, multColor=false, borderWhite=false) {
    let datasets = [];
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        let borderColor = colors[colorsArray[i]];
        let dataset;
        if (borderWhite) {
            borderColor = colors["white"];
        }
        if (multColor) {
            let backgroundColor = [];
            for (let j = 0; j < data.length; j++) {
                backgroundColor.push(colors[colorsArray[j % colorsArray.length]]);
            }
            dataset = new Datasets(datasetLabels[i], data, backgroundColor, borderColor, fill);
        } else {
            dataset = new Datasets(datasetLabels[i], data, colors[colorsArray[i]], colors[colorsArray[i]], fill);
        }
        datasets.push(dataset);
    }
    return datasets;
}

/**
 * show or hide the value of chart
 * @param chart
 */
export function showValue(chart) {
    chart.data.datasets.forEach(function (dataset, i) {
        if (!chart.getDatasetMeta(i).hidden) {
            chart.getDatasetMeta(i).hidden = 'hidden';
        } else {
            chart.getDatasetMeta(i).hidden = null;
        }
    })
    chart.update();

}

/**
 * smooth the line of chart with id
 * @param id    the id of chart you want smooth data
 */
export function smoothLine(chart) {

    if (chart.options.elements.line.tension == '0.4') {
        chart.options.elements.line.tension = 0.000001;
    } else {
        chart.options.elements.line.tension = 0.4;
    }
    chart.update();
}

/**
 * chagne the position of legend
 * @param id
 * @param value
 */
export function changeLegendPosition(chart, position) {
    if (position == 'hide') {
        chart.options.legend.display = false;
    } else {
        chart.options.legend.display = true;
        chart.options.legend.position = position;
    }
    chart.update()
}

export function changeDatasetBorderColor(chart, index, color) {
    if (chart.data.datasets.length() >= index) {
        alert("error, index is bigger than the length of datasets");
        return
    }
    chart.data.datasets.borderColor = color;
}


// test functions

/**
 * 获得随机数
 * @returns {number}
 */
let randomScalingFactor = function() {
    return Math.round(Math.random() * 100);
};

/**
 * 获取通过随机数得到的Data对象（JSON化直接作为Chart的config中的data部分）
 * @param datasetNum    dataset number
 * @param dataNum   the number of data in each dataset
 * @param fill  only use in line-type chart (such as 'line', 'radar'   and so on)
 * @param multColor if true, then each data will has a different color to show(recommend use in pie-type)
 * @param borderWhite if true, the border of each data is white. (warning no use in line-type charts)
 * @returns {Data} the data object
 */
function getRandomData(datasetNum, dataNum, fill=false, multColor=false, borderWhite=false) {
    let labels = [];
    for (let j = 0; j < dataNum; j++) {
        labels.push(j);
    }

    let datasets = [];
    for (let i = 0; i < datasetNum; i++) {
        let data = [];
        let borderColor = colors[colorsArray[i]];
        let dataset;
        if (borderWhite) {
            borderColor = colors["white"];
        }
        if (multColor) {
            let backgroundColor = [];
            for (let j = 0; j < dataNum; j++) {
                data.push(randomScalingFactor());
                backgroundColor.push(colors[colorsArray[j % colorsArray.length]]);
            }
            dataset = new Datasets("random dataset " + i, data, backgroundColor, borderColor, fill);
        } else {
            for (let j = 0; j < dataNum; j++) {
                data.push(randomScalingFactor());
            }
            dataset = new Datasets("random dataset " + i, data, colors[colorsArray[i]], colors[colorsArray[i]], fill);
        }
        datasets.push(dataset);
    }
    return new Data(labels, datasets);
}

// import BaseData from './dataUtils.js'
export function getRandomBaseData(datasetNum, dataNum) {
    let labels = [], datas = [], datasetLabels = [];
    for (let j = 0; j < dataNum; j++) {
        labels.push(j.toString());
    }
    for (let i = 0; i < datasetNum; i++) {
        datasetLabels.push('dataset ' + i);
        let data = [];
        for (let j = 0; j < dataNum; j++) {
            data.push(randomScalingFactor());
        }
        datas.push(data);
    }
    let baseData = {
        'title': "random base data",
        'labels': labels,
        'datas': datas,
        'datasetLabels': datasetLabels
    }
    // return new BaseData("random base data", labels, datas, datasetLabels);
    return baseData;
}

/**
 * get a default options of chart config
 * @param title     the title of chart, default: null
 * @param smooth    if the line is smooth, only use in line-type charts.    default: false
 * @returns {Options}   Options object
 */
function getNormalOptions(title=null, smooth=false) {
    let t, elements;
    if (title == null) {
        t = {};
    } else {
        t = new Title(title);
    }
    if (smooth) {
        elements = new Elements(new Line(0.4));
    } else {
        elements = new Elements((new Line()));
    }
    return new Options(t, null, elements, null, null);
}

/**
 * create a chart with random data in parameter type
 * @param type  the type of chart, and all dataset will be this type
 * @param title     the title of chart.  default:null
 */
export function createRandomChart(type, title=null) {
    let data, options;
    if (type == 'pie' || type == 'doughnut') {
        data = getRandomData(2, 10, false, true, true);
    } else {
        data = getRandomData(2, 10);
    }
    if (type == 'line' || type == 'radar') {
        options = getNormalOptions(title, false);
    } else {
        options = getNormalOptions(title, false);
    }

    let chart = new ChartInfo(type, data, options);
    let json = JSON.stringify(chart);
    return json;
}

/**
 * random data of a chart with id
 * @param id    the id of chart you want random data
 */
export function randomData(chart) {
    // let index = indexArray.indexOf(id);
    // let config = configArray[index];
    // config = JSON.parse(config);
    chart.data.datasets.forEach( function (dataset) {
        dataset.data = dataset.data.map(function() {
            return randomScalingFactor();
        })
    });
    chart.update();
    // chart.update();
}




// default configs

/**
 * show value on each data point
 */
Chart.plugins.register({
    afterDatasetsDraw: function(chart) {
        let ctx = chart.ctx;

        chart.data.datasets.forEach(function(dataset, i) {
            let meta = chart.getDatasetMeta(i);
            if (!meta.hidden) {
                meta.data.forEach(function(element, index) {
                    // Draw the text in black, with the specified font
                    ctx.fillStyle = 'rgb(0, 0, 0)';

                    var fontSize = 16;
                    var fontStyle = 'normal';
                    var fontFamily = 'Helvetica Neue';
                    ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                    // Just naively convert to string for now
                    var dataString = dataset.data[index].toString();

                    // Make sure alignment settings are correct
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    var padding = 5;
                    var position = element.tooltipPosition();
                    ctx.fillText(dataString, position.x , position.y - (fontSize / 2) - padding);
                });
            }
        });
    }
});

class Title {
    constructor(text, display=true) {
        this._text = text;
        this._display = display;
    }

    toJSON() {
        let {text, display} = this;
        return {text, display};
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get display() {
        return this._display;
    }

    set display(value) {
        this._display = value;
    }
}

class Ticks {
    get autoSkip() {
        return this._autoSkip;
    }

    set autoSkip(value) {
        this._autoSkip = value;
    }

    get maxRotation() {
        return this._maxRotation;
    }

    set maxRotation(value) {
        this._maxRotation = value;
    }
    constructor(autoSkip=false, maxRotation) {

        this._autoSkip = autoSkip;
        this._maxRotation = maxRotation;
    }

    toJSON() {
        let {autoSkip, maxRotation} = this;
        return {autoSkip, maxRotation};
    }
}

class Axes {
    get Axe() {
        return this._Axe;
    }

    set Axe(value) {
        this._Axe = value;
    }
    constructor(Axe) {

        this._Axe = Axe;
    }

    toJSON() {
        return JSON.stringify(this._Axe);
    }
}

class Scale{
    get xAxes() {
        return this._xAxes;
    }

    set xAxes(value) {
        this._xAxes = value;
    }

    get yAxes() {
        return this._yAxes;
    }

    set yAxes(value) {
        this._yAxes = value;
    }
    constructor(xAxes, yAxes) {

        this._xAxes = xAxes;
        this._yAxes = yAxes;
    }

    toJSON() {
        let {xAes, yAxes} = this;
        return {xAes, yAxes};
    }
}

class Line {
    get tension() {
        return this._tension;
    }

    set tension(value) {
        this._tension = value;
    }
    constructor(tension=0.000001) {

        this._tension = tension;
    }

    toJSON() {
        let {tension} = this;
        return {tension};
    }
}

class Elements {
    get line() {
        return this._line;
    }

    set line(value) {
        this._line = value;
    }
    constructor(line) {

        this._line = line;
    }

    toJSON() {
        let {line} = this;
        return {line};
    }
}

class Options {
    constructor(title, scale, elements, plugins, responsive) {
        this._title = title;
        this._scale = scale;
        this._elements = elements;
        this._plugins = plugins;
        this._responsive = responsive;
    }

    toJSON() {
        let {title, scale, elements, plugins, responsive} = this;
        let json = {title, scale, elements, plugins, responsive};
        if (title == null) {
            delete json.title;
        }
        if (scale == null) {
            delete json.scale;
        }
        if (elements == null) {
            delete json.elements;
        }
        if (plugins == null) {
            delete json.plugins;
        }
        if (responsive == null) {
            delete json.responsive;
        }
        return json;
    }

    get responsive() {
        return this._responsive;
    }

    set responsive(value) {
        this._responsive = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get scale() {
        return this._scale;
    }

    set scale(value) {
        this._scale = value;
    }

    get elements() {
        return this._elements;
    }

    set elements(value) {
        this._elements = value;
    }

    get plugins() {
        return this._plugins;
    }

    set plugins(value) {
        this._plugins = value;
    }
}

class Datasets {
    constructor(label, data, backgroundColor, borderColor, fill=false, borderDash=null, type=null) {
        this._label = label;
        this._data = data;
        this._backgroundColor = backgroundColor;
        this._borderColor = borderColor;
        this._fill = fill;
        this._borderDash = borderDash;
        this._type = type;
    }

    toJSON() {
        let {type, label, data, backgroundColor, borderColor, borderDash, fill} = this;
        let json = {type, label, data, backgroundColor, borderColor, borderDash, fill};
        if (borderDash == null) {
            delete json.borderDash;
        }
        if (type == null) {
            delete json.type;
        }
        return json;
    }


    get borderDash() {
        return this._borderDash;
    }

    set borderDash(value) {
        this._borderDash = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get fill() {
        return this._fill;
    }

    set fill(value) {
        this._fill = value;
    }

    get label() {
        return this._label;
    }

    set label(value) {
        this._label = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get backgroundColor() {
        return this._backgroundColor;
    }

    set backgroundColor(value) {
        this._backgroundColor = value;
    }

    get borderColor() {
        return this._borderColor;
    }

    set borderColor(value) {
        this._borderColor = value;
    }
}

class Data {
    constructor(labels, datasets) {
        this._labels = labels;
        this._datasets = datasets;
    }

    toJSON() {
        let {labels, datasets} = this;
        return {labels, datasets};
    }

    get labels() {
        return this._labels;
    }

    set labels(value) {
        this._labels = value;
    }

    get datasets() {
        return this._datasets;
    }

    set datasets(value) {
        this._datasets = value;
    }
}

/**
 * 用来记录chart的配置信息，直接json化就可以作为chart的config配置
 */
class ChartInfo {
    constructor(type, data, options) {
        this._type = type;
        this._data = data;
        this._options = options;
    }

    toJSON() {
        let {type, data, options} = this;
        return {type, data, options};
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }
}
