CSMFUI.component('csmf-countdown-select', {
    name: 'csmf-countdown-select',
    template: '\
<span class="csmf-countdown-select">\
<el-select size="mini" v-model="countVal"\
           @change="handleTimeCountChange">\
    <el-option v-for="(option,index) in cmpt.options" \
               :label="option.text"\
               :value="option.id+\'\'" \
               :key="option.id"></el-option>\
</el-select>\
</span>',
    data: function () {
        return {
            interval: null,
            countVal: 0
        }
    },
    props: {
        cmpt: {},
        value: {},
        srcvm: {}
    },
    mixins:['csmf-mixin-cmpt-option'],
    watch: {
        value: function (val) {
            if (val !== this.countVal) {
                this.init();
            }
        },
        countVal: function (val) {
            this.$emit('input', val);
        }
    },
    methods: {
        checkPeriod: function(val){
            var flag = false;
            this.cmpt.options.forEach(function (item) {
                if(item.id+''=== val+''){
                    flag = true;
                }
            })
            return flag;
        },
        init: function (val) {
            var self = this, period = self.cmpt['default_param'] || self.cmpt['default_value'];
            if (typeof val !== 'undefined') {
                period = val;
            }
            if (typeof period === 'undefined' || !self.checkPeriod(period)) {
                period = '0';
            }
            clearInterval(self.interval);
            self.countVal = period;
            if (period > 0) {
                self.interval = setInterval(function () {
                    self.$emit('cmpt-event', 'el_countdown_select_event', self.cmpt['cmpt_code'], self.countVal, this.srcvm)
                }, period * 1000);
            }
        },
        handleTimeCountChange: function (val) {
            this.init(val);
        }
    },
    created: function(){
        this._loadOptions(this.cmpt);
    },
    mounted: function () {
        if (this.cmpt) {
            this.init();
        }
    }
})
