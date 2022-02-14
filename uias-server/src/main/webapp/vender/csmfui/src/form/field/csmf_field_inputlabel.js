CSMFUI.component('csmf-field-inputlabel', {
    name: 'csmf-field-inputlabel',
    template: '\
<span class="csmf-field-inputlabel">\
<div v-show="!viewMode" class="el-input-label">\
    <div class="el-input-label-tags">\
        <template v-for="(tag,index) in labelValues">\
            <div :draggable="!component.disabled" :data-id="index"\
                 @dragover.prevent="inputlabel_dragover_event"\
                 @dragenter="inputlabel_dragenter_event"\
                 @dragend="inputlabel_dragend_event" style="font-size: 0;line-height: 1;margin: 5px 0;">\
                <el-tag :disable-transitions="true" type="info" \
                        style="text-overflow: ellipsis;overflow: hidden;white-space: nowrap;cursor: move;"\
                        :closable="!component.disabled" :data-id="index" :key="index"\
                        @close="remove_cmpt_inputLabel(index)">\
                    <span :title="showHidePop(tag.text)">{{tag.text}}</span>\
                </el-tag>\
            </div>\
        </template>\
    </div>\
    <div class="el-input-label-input">\
        <template v-if="!component.options">\
            <template v-if="!optionType">\
                <el-input v-model="inputValue"\
                          :suffix-icon="component.icon_after"\
                          :prefix-icon="component.icon_before"\
                          :disabled="!!component.disabled"\
                          :placeholder="component.placeholder"\
                          clearable>\
                </el-input>\
            </template>\
            <template v-else-if="optionType===\'timerange\'">\
                <el-time-picker is-range\
                                v-model="inputValue"\
                                :placeholder="component.placeholder"\
                                :disabled="!!component.disabled"\
                                :range-separator="$t(\'lang_key.csmf.import.to\')"\
                                :start-placeholder="$t(\'lang_key.csmf.import.startTime\')"\
                                :end-placeholder="$t(\'lang_key.csmf.import.endTime\')"\
                                value-format="HH:mm:ss">\
                </el-time-picker>\
            </template>\
            <template v-else-if="optionType===\'customer\'">\
                <render-template-label :cmpt="component" :data="srcvm.initData"></render-template-label>\
            </template>\
        </template>\
        <template v-else>\
            <template v-if="optionType === \'cascade\'">\
                <el-cascader v-model="inputValue"\
                             :placeholder="component.placeholder"\
                             :options="component.options"\
                             :filterable="!component.filter_forbidden"\
                             :clearable="!component.clear_forbidden"\
                             :disabled="!!component.disabled"\
                             :props="{value:\'id\',label:\'text\'}"\
                             :expand-trigger="\'hover\'"\
                             :change-on-select="component.change_on_click">\
                </el-cascader>\
            </template>\
            <template v-else>\
                <el-select v-model="inputValue"\
                           :placeholder="component.placeholder"\
                           :disabled="!!component.disabled"\
                           :filterable="!component.filter_forbidden"\
                           :clearable="!component.clear_forbidden">\
                    <el-option v-for="(option,index) in component.options"\
                               :label="option.text"\
                               :key="index"\
                               :value="option.id+\'\'"\
                               :disabled="!!option.disabled">\
                    </el-option>\
                </el-select>\
            </template>\
        </template>\
        <el-button :disabled="!!component.disabled"\
                   type="primary"\
                   @click.native="add_input_label_value">\
            {{$t(\'lang_key.csmf.import.addInput\')}}\
        </el-button>\
    </div>\
</div>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    props: {
        'value': {
            type: [String, Array]
        }
    },
    data: function () {
        return {
            inputValue: '',
            sortid: '',
            labelValues: [],
            checkedValues: []
        }
    },
    mixins: ['csmf-mixin-cmpt', 'csmf-mixin-cmpt-option'],
    computed: {
        'optionType': function () {
            return this.component.optionType;
        },
        'rawValue': function () {
            if (this.component && this.value) {
                var values = this.translateValues(this.value);
                var texts = [];
                for (var i in values) {
                    texts.push(values[i]['text'])
                }
                return texts.join(", ");
            }
        }
    },
    watch: {
        value: function (value) {
            if (JSON.stringify(value) !== JSON.stringify(this.checkedValues)) {
                this.checkedValues = value;
                this.translateValues(value);
            }
        },
        checkedValues: function (value) {
            this.$emit("input", value);
        }
    },
    components: {
        //inputLabel自定义render函数
        'render-template-label': {
            render: function (createElement) {
                if (typeof render_inputLabel_innerHtml === 'function') {
                    return render_inputLabel_innerHtml(this, this.component, this.data, createElement)
                } else {
                    return createElement("span");
                }
            },
            props: {
                cmpt: {
                    type: Object,
                    required: true
                },
                data: {
                    type: Object,
                    required: true
                }
            }
        }
    },
    methods: {
        showHidePop: function (text) {
            if (text.length > 30) {
                return text;
            } else {
                return '';
            }
        },
        inputlabel_dragover_event: function (ev) {
            ev.dataTransfer.dropEffect = 'move';
        },
        inputlabel_dragenter_event: function (ev) {
            this.sortid = ev.target.dataset.id || ev.target.parentElement.dataset.id;
        },
        inputlabel_dragend_event: function (ev) {
            if (ev.dataTransfer.dropEffect !== 'move') {
                return;
            }
            var srcIndex = parseInt(ev.target.dataset.id);
            var tarIndex = parseInt(this.sortid);
            var array = [];
            array = array.concat(this.labelValues);
            var data = array[srcIndex];
            array.splice(srcIndex, 1);
            array.splice(tarIndex, 0, data);
            this.labelValues = array;
        },
        remove_cmpt_inputLabel: function (index) {
            var self = this;
            self.labelValues.splice(index, 1);
            self.checkedValues = self.labelValues.map(function (item) {
                return item['id']
            });
        },
        translateValues: function (value) {
            var self = this, values = [];
            values = value.map(function (item) {
                var label = self.transfer_current_label_value(item);
                if (label) {
                    return {
                        id: item,
                        text: label
                    };
                }
            })
            self.labelValues = values;
            return values || [];
        },
        transfer_current_label_value: function (curValue) {
            var self = this;
            if (self.component.options) {
                var optionList = self.component.options;
                var textValue = [];
                if (self.component['optionType'] === 'cascade' || self.component['optionType'] === 'cascader') {//级联选择框
                    for (var i = 0; i < curValue.length; i++) {
                        for (var j = 0; j < optionList.length; j++) {
                            if (curValue[i] + '' === optionList[j].id + '') {
                                textValue[i] = optionList[j].text;
                                optionList = optionList[j].children;
                                break;
                            }
                        }
                    }
                    textValue = textValue.join("/")
                } else {
                    for (var k = 0; k < optionList.length; k++) {
                        if (curValue + '' === optionList[k].id + '') {
                            textValue = optionList[k].text;
                            break;
                        }
                    }
                }
            }
            if (self.component['optionType'] === 'timerange' && this.$utils.isArray(curValue)) {
                textValue = curValue.join("~");
            }
            return textValue || curValue;
        },
        check_is_checked: function(value){
            var self = this;
            var checks = self.checkedValues.map(function (item) {
                return JSON.stringify(item);
            });
            return checks.indexOf(JSON.stringify(value))>=0;
        },
        add_input_label_value: function () {
            var self = this;
            //去重
            if (self.check_is_checked(self.inputValue)) {
                self.inputValue = null;
                return;
            }
            //翻译
            if(self.inputValue==null){
                return;
            }
            var curLabelValue = self.transfer_current_label_value(JSON.parse(JSON.stringify(self.inputValue)));
            if (!curLabelValue || curLabelValue.length <= 0) {
                return;
            }
            if (self.component['optionType'] === 'timerange') {
                var textValue = curLabelValue.split("~");
                var begin = Date.parse("2020-11-10 " + textValue[0]);
                var end = Date.parse("2020-11-10 " + textValue[1]);
                if (begin > end) {
                    return;
                }
            }
            var values = self.labelValues || [];
            values.push({
                id: self.inputValue,
                text: curLabelValue
            });
            self.checkedValues = values.map(function (item) {
                return item['id'];
            });
            self.inputValue = null;
        }
    },
    created: function () {
        var self = this;
        self._getArrayValue();
        if (self.component['optionType'] === 'cascade' || self.component['optionType'] === 'cascader') {//级联选择框
            self._loadTreeOptions(this.component)
        } else {
            self._loadOptions(this.component)
        }
    }
})
