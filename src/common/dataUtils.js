

export class BaseData {
    _title;
    _labels;
    _datas;
    _datasetLabels;

    constructor(title, labels, datas, datasetLabels) {
        this._title = title;
        this._labels = labels;
        this._datas = datas;
        this._datasetLabels = datasetLabels;
    }
}
