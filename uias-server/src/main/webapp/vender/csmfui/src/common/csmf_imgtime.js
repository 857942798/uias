CSMFUI.component('csmf-imgtime', {
    name: 'csmf-imgtime',
    template: '\
<div class="plan-next-time" >\
    <div class="plan-next-time-title">{{cmpt.placeholder}}</div>\
    <el-row class="plan-next-time-box" :gutter="12">\
        <el-col :span="12">\
            <span class="time" v-text="transferImgTimeObj(\'hh:mm\')"></span>\
        </el-col>\
        <el-col :span="12">\
            <div class="date">\
                <span class="day" v-text="transferImgTimeObj(\'yyyy-MM-dd\')"></span>\
                <span class="week" v-text="transferImgTimeObj(\'EEE\')"></span>\
            </div>\
        </el-col>\
    </el-row>\
</div>',
    props: ['cmpt', 'value', 'srcvm'],
    data: function () {
        return {};
    },
    computed: {
        'dv': {
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.$emit('input', value);
            }
        }
    },
    methods: {
        transferImgTimeObj: function (format) {
            var dateImgTime = new Date(this.dv);
            if (dateImgTime.toString() !== "Invalid Date") {
                var weekArr = ["日", "一", "二", "三", "四", "五", "六"];
                switch (format) {
                    case 'hh:mm':
                        return dateImgTime.Format('hh:mm');
                    case 'yyyy-MM-dd':
                        return dateImgTime.Format('yyyy-MM-dd');
                    case 'EEE':
                        return '星期' + weekArr[dateImgTime.getDay()];
                }
            } else {
                switch (format) {
                    case 'hh:mm':
                        return dateImgTime.Format('/:/');
                    case 'yyyy-MM-dd':
                        return dateImgTime.Format('/-/-/');
                    case 'EEE':
                        return '星期/';
                }
            }
        }
    }
})
