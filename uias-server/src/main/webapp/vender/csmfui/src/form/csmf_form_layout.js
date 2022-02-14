CSMFUI.service('CSMF_FORM_LAYOUT', function () {
    return {
        checkIsNotChildField: function (rowCmpts, cmpt) {
            for (var i = 0; i < rowCmpts.length; i++) {
                for (var j = 0; j < rowCmpts[i].length; j++) {
                    if (rowCmpts[i][j].items) {
                        var codes = rowCmpts[i][j].items.split(",");
                        if (codes.indexOf(cmpt.cmpt_code) >= 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        getFieldByCode: function (rowCmpts, code) {
            for (var i = 0; i < rowCmpts.length; i++) {
                for (var j = 0; j < rowCmpts[i].length; j++) {
                    if (rowCmpts[i][j].cmpt_code === code) {
                        return rowCmpts[i][j];
                    }
                }
            }
        },
        getChildFields: function (rowCmpts, cmpt) {
            var self = this, items = [];
            if (cmpt.items && cmpt.items.length > 0) {
                var codes = cmpt.items.split(",");
                for (var i = 0; i < codes.length; i++) {
                    var item = self.getFieldByCode(rowCmpts, codes[i]);
                    if (item) {
                        items.push(item);
                    }
                }
            }
            return items;
        },
        getQryFormLayoutBody: function (rowCmpts) {
            var self = this;
            var rowList = [];
            var toolbar = [];

            function generateField(rowCmpts, cmpt) {
                cmpt.is_hidden = cmpt.is_hidden + '';
                var childs = self.getChildFields(rowCmpts, cmpt)
                childs = childs.filter(function (item) {
                    return generateField(rowCmpts, item);
                });
                if (childs.length > 0) {
                    cmpt.children = childs;
                }
                if (cmpt && cmpt.is_hidden !== '2' && (cmpt.is_addition !== '1' || self.attrs.isShowAdditionColumn)) {
                    if (cmpt.place === 'toolbar' || cmpt.click === 'simple_grid_search' || cmpt.click === 'reset_qryform_data') {
                        toolbar.push(cmpt);
                    } else {
                        return cmpt;
                    }
                }
            }

            function generateFields() {
                for (var i = 0; i < rowCmpts.length; i++) {
                    var cmptList = []
                    for (var j = 0; j < rowCmpts[i].length; j++) {
                        if (self.checkIsNotChildField(rowCmpts, rowCmpts[i][j])) {
                            var res = generateField(rowCmpts, rowCmpts[i][j]);
                            if (res) {
                                cmptList.push(res);
                            }
                        }
                    }
                    if (cmptList.length > 0) {
                        rowList.push(cmptList);
                    }
                }

                if (toolbar.length > 0) {
                    //计算工具栏是否需要换行
                    var lastRow;
                    if (rowList.length === 0) {
                        lastRow = [];
                        rowList.push(lastRow);
                    } else {
                        lastRow = rowList[rowList.length - 1];
                    }
                    var span2 = 0;
                    for (var k = 0; k < lastRow.length; k++) {
                        span2 += ((lastRow[k].span || 0) + (lastRow[k].offset || 0));
                    }
                    lastRow.push({
                        'cmpt_type': 'toolbar',
                        'place': 'toolbar',
                        'span': 24 - span2,
                        'offset': 0,
                        'is_hidden': '',
                        'toolList': toolbar
                    });
                }
            }

            generateFields();
            return rowList;
        },
        getEditFormLayoutBody: function (rowCmpts) {
            var rowList = [];
            for (var i = 0; i < rowCmpts.length; i++) {
                var cmpts = rowCmpts[i];
                var cmptList = [];
                for (var j = 0; j < cmpts.length; j++) {
                    var cmpt = cmpts[j];
                    if (cmpt.place !== 'toolbar' && cmpt.click !== 'save_add_form_data' && cmpt.click !== 'cancel_form_operator' && cmpt.click !== 'save_edit_form_data') {
                        cmpt.is_hidden = cmpt.is_hidden + '';
                        if (cmpt.is_hidden !== '2') {
                            cmptList.push(cmpt);
                        }
                    }
                }
                rowList.push(cmptList);
            }
            return rowList;
        },
        getEditFormLayoutFooter: function (rowCmpts) {
            var toolList = [];
            for (var i = 0; i < rowCmpts.length; i++) {
                var cmpts = rowCmpts[i];
                for (var j = 0; j < cmpts.length; j++) {
                    var cmpt = cmpts[j];
                    if ((cmpt.cmpt_type === 'button' && cmpt.place === 'toolbar' && !cmpt.isreturn)
                        || cmpt.click === 'save_add_form_data' || cmpt.click === 'cancel_form_operator' || cmpt.click === 'save_edit_form_data') {
                        cmpt.is_hidden = cmpt.is_hidden + '';
                        if (cmpt.is_hidden !== '2') {
                            toolList.push(cmpt);
                        }
                    }
                }
            }
            return toolList;
        }
    }
});
