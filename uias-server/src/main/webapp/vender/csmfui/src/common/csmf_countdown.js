CSMFUI.component('csmf-countdown', {
    name: 'csmf-countdown',
    template: '\
<span class="csmf-countdown">\
<el-time-picker \
    v-show="!viewMode"\
    v-model="countVal"\
    readonly\
    value-format="HH:mm:ss">\
</el-time-picker>\
<span v-if="viewMode" class="el-form-item_text__content">\
    {{rawValue}}\
</span>\
</span>',
    data: function () {
        return {
            interval: null,
            countVal: ''
        };
    },
    props: {
        cmpt: {},
        value: {
            'default': function () {
                return '00:05:00';
            }
        },
        srcvm: {}
    },
    watch: {
        value: function (val) {
            if (val !== this.countVal) {
                this.init();
            }
        },
        countVal: function (value) {
            this.$emit('input', value);
        }
    },
    computed: {
        'viewMode': function () {
            return !!this.cmpt.disabled;
        },
        'rawValue': function () {
            return this.countVal;
        }
    },
    methods: {
        /**
         * 将秒数转成时间
         * @param s
         * @returns {string}
         */
        sec_to_time: function (s) {
            var t;
            if (s > -1) {
                var hour = Math.floor(s / 3600);
                var min = Math.floor(s / 60) % 60;
                var sec = s % 60;
                if (hour < 10) {
                    t = '0' + hour + ":";
                } else {
                    t = hour + ":";
                }

                if (min < 10) {
                    t += "0";
                }
                t += min + ":";
                if (sec < 10) {
                    t += "0";
                }
                t += sec.toFixed(2);
            }
            return t;
        },
        init: function () {
            var self = this, val = this.value || "00:05:00";
            var timeArray = val.split(":");
            if (timeArray.length !== 3) return;
            var seconds = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]);
            clearInterval(self.interval);
            self.interval = setInterval(function () {
                seconds--;
                self.countVal = self.sec_to_time(seconds);
                if (seconds === 0) {
                    seconds = parseInt(timeArray[0]) * 3600 + parseInt(timeArray[1]) * 60 + parseInt(timeArray[2]);
                    self.$emit('cmpt-event', 'el_countdown_event', self.cmpt['cmpt_code'], self.dv, this.srcvm);
                }
            }, 1000);
        }
    },
    mounted: function () {
        var self = this;
        setTimeout(function () {
            self.init();
        }, 1000)
    },
    beforeDestroy: function () {
        clearInterval(this.interval);
    }
})
