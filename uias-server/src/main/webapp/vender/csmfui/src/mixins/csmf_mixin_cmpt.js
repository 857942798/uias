CSMFUI.mixin('csmf-mixin-cmpt', function () {
    return {
        props: {
            cmpt: {},
            srcvm: {}
        },
        computed: {
            'component': function () {
                return this.cmpt;
            },
            'dv': {
                get: function () {
                    return this._getValue();
                },
                set: function (value) {
                    this.$emit('input', value);
                }
            },
            'viewMode': function () {
                return this.$utils.isTrue(this.component.readonly);
            },
            'rawValue': function () {
                return this.dv;
            },
            'isMultiple': function () {
                return this.$utils.isTrue(this.component.multiple);
            },
            'isClearable': function () {
                if (this.$utils.isUndefined(this.component['clearable'])) {
                    if (this.$utils.isUndefined(this.component['clear_forbidden'])) {
                        return true;
                    } else {
                        return this.$utils.isFalse(this.component['clear_forbidden']);
                    }
                } else {
                    return this.$utils.isTrue(this.component['clearable']);
                }
            },
            'isFilterable': function () {
                if (this.$utils.isUndefined(this.component['filterable'])) {
                    if (this.$utils.isUndefined(this.component['filter_forbidden'])) {
                        return true;
                    } else {
                        return this.$utils.isFalse(this.component['filter_forbidden']);
                    }
                } else {
                    return this.$utils.isTrue(this.component['filterable'])
                }
            }
        },
        methods: {
            _getDefaultParam: function () {
                return this.$utils.getUnEmptyValue(this.component['default-param'], this.component['default_param'], this.component['defaultParam'], this.component['default_value']);
            },
            _getCustomAttrs: function (props, obj, attrs) {
                var src = JSON.parse(JSON.stringify(this.component)),
                    resProps = {}, camelKey = '', key,
                    newProps = Object.assign(src, {
                        'disabled': !!src.disabled,
                        'title': src['title'] || src['cmpt_title']
                    }, obj, attrs || {}),
                    srcProps = props || newProps;
                for (key in newProps) {
                    if (newProps.hasOwnProperty(key)) {
                        camelKey = this.$utils.camelize(key);
                        if (camelKey === 'options') {
                            if (!this.$utils.isArray(src['options'])) {
                                continue;
                            }
                        }
                        if (this.$utils.hasOwn(srcProps, camelKey) || this.$utils.hasOwn(srcProps, key)) {
                            resProps[key] = newProps[key];
                        } else if (['id', 'class', 'style', 'title', 'type'].indexOf(camelKey) >= 0) {
                            resProps[key] = newProps[key];
                        }
                    }
                }
                return resProps;
            },
            _getCustomListeners: function (obj) {
                var listeners = {}, key;
                for (key in this.component) {
                    if (this.component.hasOwnProperty(key)) {
                        if (this.$utils.hasOwn(this.component, key) && this.$utils.isFunction(this.component[key])) {
                            listeners[key] = this.component[key];
                        }
                    }
                }
                return Object.assign(listeners, obj || {});
            },
            _getValue: function (emit, cusv) {
                if (this.$utils.isUndefined(this.value)) {
                    return this._getDefaultValue(cusv, emit);
                }
                return this.value;
            },
            _getArrayValue: function (emit, cusv) {
                if (this.$utils.isUndefined(this.value)) {
                    return this._getDefaultArrayValue(cusv, emit);
                }
                return this.value;
            },
            _getDefaultValue: function (cusv, emit) {
                var value = this.$utils.isUndefined(cusv) ? '' : cusv;
                if (!this.$utils.isTrue(this.component.uninitialize) && this.$utils.isDefined(this._getDefaultParam())) {
                    value = this._getDefaultParam();
                }
                (emit === undefined || emit) && this.$emit('input', value);
                return value;
            },
            _getDefaultArrayValue: function (cusv, emit) {
                var value = this.$utils.isUndefined(cusv) ? [] : cusv, defaultParam;
                if (this.$utils.isFalse(this.component['uninitialize']) && this.$utils.isDefined(this._getDefaultParam())) {
                    try {
                        defaultParam = this._getDefaultParam();
                        if (this.$utils.isArray(defaultParam)) {
                            value = defaultParam;
                        } else if (this.$utils.isString(this._getDefaultParam())) {
                            defaultParam = JSON.parse(this._getDefaultParam());
                            if (this.$utils.isArray(defaultParam)) {
                                value = defaultParam;
                            }
                        }
                    } catch (e) {
                    }
                }
                (emit === undefined || emit) && this.$emit('input', value);
                return value;
            },

            _getArrayRawValue: function (value) {
                if (this.component) {
                    if (Object.prototype.toString.call(value) === '[object Array]') {
                        return value.join(', ');
                    } else {
                        return value;
                    }
                }
            },
            _getRangeRawValue: function (value) {
                if (this.component) {
                    if (Object.prototype.toString.call(value) === '[object Array]') {
                        if (value.length === 2) {
                            return value[0] + '~' + value[1];
                        } else {
                            return [];
                        }
                    } else {
                        return value;
                    }
                }
            },
            _getOptionsRawValue: function (value) {
                var rawText = [], i = 0, j = 0, k = 0;
                if (this.component && this.component.options && this.component.options.length) {
                    if (value) {
                        if (Object.prototype.toString.call(value) === '[object Array]') {
                            for (i = 0; i < value.length; i++) {
                                for (j = 0; j < this.component.options.length; j++) {
                                    if (value[i] + '' === this.component.options[j].id + '') {
                                        rawText.push(this.component.options[j].text + '');
                                    }
                                }
                            }
                        } else {
                            for (k = 0; k < this.component.options.length; k++) {
                                if (value + '' === this.component.options[k].id + '') {
                                    rawText.push(this.component.options[k].text + '');
                                }
                            }
                        }
                    }
                }
                return rawText;
            }
        }
    }
})
