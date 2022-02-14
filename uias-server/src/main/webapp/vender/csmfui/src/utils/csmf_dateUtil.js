CSMFUI.util('dateUtil', function () {
    var DATEUTIL = this;
    (function (main) {
        'use strict';
        var fecha = {};
        var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
        var twoDigits = '\\d\\d?';
        var threeDigits = '\\d{3}';
        var fourDigits = '\\d{4}';
        var word = '[^\\s]+';
        var literal = /\[([^]*?)\]/gm;
        var noop = function () {
        };

        function regexEscape(str) {
            return str.replace(/[|\\{()[^$+*?.-]/g, '\\$&');
        }

        function shorten(arr, sLen) {
            var newArr = [];
            for (var i = 0, len = arr.length; i < len; i++) {
                newArr.push(arr[i].substr(0, sLen));
            }
            return newArr;
        }

        function monthUpdate(arrName) {
            return function (d, v, i18n) {
                var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
                if (~index) {
                    d.month = index;
                }
            };
        }

        function pad(val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) {
                val = '0' + val;
            }
            return val;
        }

        var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var monthNamesShort = shorten(monthNames, 3);
        var dayNamesShort = shorten(dayNames, 3);
        fecha.i18n = {
            dayNamesShort: dayNamesShort,
            dayNames: dayNames,
            monthNamesShort: monthNamesShort,
            monthNames: monthNames,
            amPm: ['am', 'pm'],
            DoFn: function DoFn(D) {
                return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
            }
        };

        var formatFlags = {
            D: function (dateObj) {
                return dateObj.getDay();
            },
            DD: function (dateObj) {
                return pad(dateObj.getDay());
            },
            Do: function (dateObj, i18n) {
                return i18n.DoFn(dateObj.getDate());
            },
            d: function (dateObj) {
                return dateObj.getDate();
            },
            dd: function (dateObj) {
                return pad(dateObj.getDate());
            },
            ddd: function (dateObj, i18n) {
                return i18n.dayNamesShort[dateObj.getDay()];
            },
            dddd: function (dateObj, i18n) {
                return i18n.dayNames[dateObj.getDay()];
            },
            M: function (dateObj) {
                return dateObj.getMonth() + 1;
            },
            MM: function (dateObj) {
                return pad(dateObj.getMonth() + 1);
            },
            MMM: function (dateObj, i18n) {
                return i18n.monthNamesShort[dateObj.getMonth()];
            },
            MMMM: function (dateObj, i18n) {
                return i18n.monthNames[dateObj.getMonth()];
            },
            yy: function (dateObj) {
                return pad(String(dateObj.getFullYear()), 4).substr(2);
            },
            yyyy: function (dateObj) {
                return pad(dateObj.getFullYear(), 4);
            },
            h: function (dateObj) {
                return dateObj.getHours() % 12 || 12;
            },
            hh: function (dateObj) {
                return pad(dateObj.getHours() % 12 || 12);
            },
            H: function (dateObj) {
                return dateObj.getHours();
            },
            HH: function (dateObj) {
                return pad(dateObj.getHours());
            },
            m: function (dateObj) {
                return dateObj.getMinutes();
            },
            mm: function (dateObj) {
                return pad(dateObj.getMinutes());
            },
            s: function (dateObj) {
                return dateObj.getSeconds();
            },
            ss: function (dateObj) {
                return pad(dateObj.getSeconds());
            },
            S: function (dateObj) {
                return Math.round(dateObj.getMilliseconds() / 100);
            },
            SS: function (dateObj) {
                return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
            },
            SSS: function (dateObj) {
                return pad(dateObj.getMilliseconds(), 3);
            },
            a: function (dateObj, i18n) {
                return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
            },
            A: function (dateObj, i18n) {
                return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
            },
            ZZ: function (dateObj) {
                var o = dateObj.getTimezoneOffset();
                return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
            }
        };

        var parseFlags = {
            d: [twoDigits, function (d, v) {
                d.day = v;
            }],
            Do: [twoDigits + word, function (d, v) {
                d.day = parseInt(v, 10);
            }],
            M: [twoDigits, function (d, v) {
                d.month = v - 1;
            }],
            yy: [twoDigits, function (d, v) {
                var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
                d.year = '' + (v > 68 ? cent - 1 : cent) + v;
            }],
            h: [twoDigits, function (d, v) {
                d.hour = v;
            }],
            m: [twoDigits, function (d, v) {
                d.minute = v;
            }],
            s: [twoDigits, function (d, v) {
                d.second = v;
            }],
            yyyy: [fourDigits, function (d, v) {
                d.year = v;
            }],
            S: ['\\d', function (d, v) {
                d.millisecond = v * 100;
            }],
            SS: ['\\d{2}', function (d, v) {
                d.millisecond = v * 10;
            }],
            SSS: [threeDigits, function (d, v) {
                d.millisecond = v;
            }],
            D: [twoDigits, noop],
            ddd: [word, noop],
            MMM: [word, monthUpdate('monthNamesShort')],
            MMMM: [word, monthUpdate('monthNames')],
            a: [word, function (d, v, i18n) {
                var val = v.toLowerCase();
                if (val === i18n.amPm[0]) {
                    d.isPm = false;
                } else if (val === i18n.amPm[1]) {
                    d.isPm = true;
                }
            }],
            ZZ: ['[^\\s]*?[\\+\\-]\\d\\d:?\\d\\d|[^\\s]*?Z', function (d, v) {
                var parts = (v + '').match(/([+-]|\d\d)/gi), minutes;

                if (parts) {
                    minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
                    d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
                }
            }]
        };
        parseFlags.dd = parseFlags.d;
        parseFlags.dddd = parseFlags.ddd;
        parseFlags.DD = parseFlags.D;
        parseFlags.mm = parseFlags.m;
        parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
        parseFlags.MM = parseFlags.M;
        parseFlags.ss = parseFlags.s;
        parseFlags.A = parseFlags.a;

        // Some common format strings
        fecha.masks = {
            'default': 'ddd MMM dd yyyy HH:mm:ss',
            'shortDate': 'M/D/yy',
            'mediumDate': 'MMM d, yyyy',
            'longDate': 'MMMM d, yyyy',
            'fullDate': 'dddd, MMMM d, yyyy',
            'shortTime': 'HH:mm',
            'mediumTime': 'HH:mm:ss',
            'longTime': 'HH:mm:ss.SSS'
        };

        /***
         * Format a date
         * @method format
         * @param {Date|number} dateObj
         * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
         * @param i18nSettings
         */
        fecha.format = function (dateObj, mask, i18nSettings) {
            var i18n = i18nSettings || fecha.i18n;

            if (typeof dateObj === 'number') {
                dateObj = new Date(dateObj);
            }

            if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
                throw new Error('Invalid Date in fecha.format');
            }

            mask = fecha.masks[mask] || mask || fecha.masks['default'];

            var literals = [];

            // Make literals inactive by replacing them with ??
            mask = mask.replace(literal, function ($0, $1) {
                literals.push($1);
                return '@@@';
            });
            // Apply formatting rules
            mask = mask.replace(token, function ($0) {
                return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
            });
            // Inline literal values back into the formatted value
            return mask.replace(/@@@/g, function () {
                return literals.shift();
            });
        };

        /**
         * Parse a date string into an object, changes - into /
         * @method parse
         * @param {string} dateStr Date string
         * @param {string} format Date parse format
         * @param i18nSettings
         * @returns {Date|boolean}
         */
        fecha.parse = function (dateStr, format, i18nSettings) {
            var i18n = i18nSettings || fecha.i18n;

            if (typeof format !== 'string') {
                throw new Error('Invalid format in fecha.parse');
            }

            format = fecha.masks[format] || format;

            // Avoid regular expression denial of service, fail early for really long strings
            // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
            if (dateStr.length > 1000) {
                return null;
            }

            var dateInfo = {};
            var parseInfo = [];
            var literals = [];
            format = format.replace(literal, function ($0, $1) {
                literals.push($1);
                return '@@@';
            });
            var newFormat = regexEscape(format).replace(token, function ($0) {
                if (parseFlags[$0]) {
                    var info = parseFlags[$0];
                    parseInfo.push(info[1]);
                    return '(' + info[0] + ')';
                }

                return $0;
            });
            newFormat = newFormat.replace(/@@@/g, function () {
                return literals.shift();
            });
            var matches = dateStr.match(new RegExp(newFormat, 'i'));
            if (!matches) {
                return null;
            }

            for (var i = 1; i < matches.length; i++) {
                parseInfo[i - 1](dateInfo, matches[i], i18n);
            }

            var today = new Date();
            if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
                dateInfo.hour = +dateInfo.hour + 12;
            } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
                dateInfo.hour = 0;
            }

            var date;
            if (dateInfo.timezoneOffset != null) {
                dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
                date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
                    dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
            } else {
                date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
                    dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
            }
            return date;
        };
        main.fecha = fecha;
    })(DATEUTIL);
    var weeks = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    var newArray = function (start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };
    var pack = (function (fecha) {
        return {
            getI18nSettings: function () {
                return {
                    dayNamesShort: weeks.map(function (week) {
                        return new Vue().$t('el.datepicker.weeks.' + week)
                    }),
                    dayNames: weeks.map(function (week) {
                        return new Vue().$t('el.datepicker.weeks.' + week)
                    }),
                    monthNamesShort: months.map(function (month) {
                        return new Vue().$t('el.datepicker.months' + month)
                    }),
                    monthNames: months.map(function (month, index) {
                        return new Vue().$t('el.datepicker.month' + (index + 1));
                    }),
                    amPm: ['am', 'pm']
                };
            },

            toDate: function (date) {
                return this.isDate(date) ? new Date(date) : null;
            },

            isDate: function (date) {
                if (date === null || date === undefined) {
                    return false
                }
                if (isNaN(new Date(date).getTime())) {
                    return false
                }
                if (Array.isArray(date)) {
                    return false
                }
                return true;
            },

            isDateObject: function (val) {
                return val instanceof Date;
            },

            formatDate: function (date, format) {
                date = this.toDate(date);
                if (!date) return '';
                return fecha.format(date, format || 'yyyy-MM-dd', this.getI18nSettings());
            },

            parseDate: function (string, format) {
                return fecha.parse(string, format || 'yyyy-MM-dd', this.getI18nSettings());
            },

            getDayCountOfMonth: function (year, month) {
                if (month === 3 || month === 5 || month === 8 || month === 10) {
                    return 30;
                }

                if (month === 1) {
                    if (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) {
                        return 29;
                    } else {
                        return 28;
                    }
                }

                return 31;
            },

            getDayCountOfYear: function (year) {
                var isLeapYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
                return isLeapYear ? 366 : 365;
            },

            getFirstDayOfMonth: function (date) {
                var temp = new Date(date.getTime());
                temp.setDate(1);
                return temp.getDay();
            },

            prevDate: function (date, amount) {
                amount = amount || 1
                return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount);
            },

            nextDate: function (date, amount) {
                amount = amount || 1
                return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
            },

            getStartDateOfMonth: function (year, month) {
                var result = new Date(year, month, 1);
                var day = result.getDay();

                if (day === 0) {
                    return this.prevDate(result, 7);
                } else {
                    return this.prevDate(result, day);
                }
            },

            getWeekNumber: function (src) {
                if (!this.isDate(src)) return null;
                var date = new Date(src.getTime());
                date.setHours(0, 0, 0, 0);
                // Thursday in current week decides the year.
                date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
                // January 4 is always in week 1.
                var week1 = new Date(date.getFullYear(), 0, 4);
                // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
                // Rounding should be fine for Daylight Saving Time. Its shift should never be more than 12 hours.
                return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
            },

            getRangeHours: function (ranges) {
                var hours = [];
                var disabledHours = [];

                (ranges || []).forEach(function (range) {
                    var value = range.map(function (date) {
                        return date.getHours()
                    });
                    disabledHours = disabledHours.concat(newArray(value[0], value[1]));
                });
                if (disabledHours.length) {
                    for (var i = 0; i < 24; i++) {
                        hours[i] = disabledHours.indexOf(i) === -1;
                    }
                } else {
                    for (var i = 0; i < 24; i++) {
                        hours[i] = false;
                    }
                }

                return hours;
            },

            getPrevMonthLastDays: function (date, amount) {
                if (amount <= 0) return [];
                var temp = new Date(date.getTime());
                temp.setDate(0);
                var lastDay = temp.getDate();
                return range(amount).map(function (_, index) {
                    return lastDay - (amount - index - 1)
                });
            },

            getMonthDays: function (date) {
                var temp = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                var days = temp.getDate();
                return range(days).map(function (_, index) {
                    return index + 1
                });
            },

            setRangeData: function (arr, start, end, value) {
                for (var i = start; i < end; i++) {
                    arr[i] = value;
                }
            },

            getRangeMinutes: function (ranges, hour) {
                var minutes = new Array(60);

                if (ranges.length > 0) {
                    var self = this;
                    ranges.forEach(function (range) {
                        var start = range[0];
                        var end = range[1];
                        var startHour = start.getHours();
                        var startMinute = start.getMinutes();
                        var endHour = end.getHours();
                        var endMinute = end.getMinutes();
                        if (startHour === hour && endHour !== hour) {
                            self.setRangeData(minutes, startMinute, 60, true);
                        } else if (startHour === hour && endHour === hour) {
                            self.setRangeData(minutes, startMinute, endMinute + 1, true);
                        } else if (startHour !== hour && endHour === hour) {
                            self.setRangeData(minutes, 0, endMinute + 1, true);
                        } else if (startHour < hour && endHour > hour) {
                            self.setRangeData(minutes, 0, 60, true);
                        }
                    });
                } else {
                    this.setRangeData(minutes, 0, 60, true);
                }
                return minutes;
            },

            range: function (n) {
                return Array.apply(null, {length: n}).map(function (_, n) {
                    return n
                });
            },

            modifyDate: function (date, y, m, d) {
                return new Date(y, m, d, date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
            },

            modifyTime: function (date, h, m, s) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, s, date.getMilliseconds());
            },

            modifyWithTimeString: function (date, time) {
                if (date == null || !time) {
                    return date;
                }
                time = this.parseDate(time, 'HH:mm:ss');
                return this.modifyTime(date, time.getHours(), time.getMinutes(), time.getSeconds());
            },

            clearTime: function (date) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            },

            clearMilliseconds: function (date) {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
            },

            limitTimeRange: function (date, ranges, format) {
                format = format || 'HH:mm:ss';
                // TODO: refactory a more elegant solution
                if (ranges.length === 0) return date;
                var normalizeDate = function (date) {
                    return fecha.parse(fecha.format(date, format), format);
                }
                var ndate = normalizeDate(date);
                var nranges = ranges.map(function (range) {
                    return range.map(normalizeDate)
                });
                if (nranges.some(function (nrange) {
                    return ndate >= nrange[0] && ndate <= nrange[1];
                })) {
                    return date;
                }

                var minDate = nranges[0][0];
                var maxDate = nranges[0][0];

                nranges.forEach(function (nrange) {
                    minDate = new Date(Math.min(nrange[0], minDate));
                    maxDate = new Date(Math.max(nrange[1], minDate));
                });

                var ret = ndate < minDate ? minDate : maxDate;
                // preserve Year/Month/Date
                return this.modifyDate(
                    ret,
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );
            },

            timeWithinRange: function (date, selectableRange, format) {
                var limitedDate = this.limitTimeRange(date, selectableRange, format);
                return limitedDate.getTime() === date.getTime();
            },

            changeYearMonthAndClampDate: function (date, year, month) {
                // clamp date to the number of days in `year`, `month`
                // eg: (2010-1-31, 2010, 2) => 2010-2-28
                var monthDate = Math.min(date.getDate(), this.getDayCountOfMonth(year, month));
                return this.modifyDate(date, year, month, monthDate);
            },

            prevMonth: function (date) {
                var year = date.getFullYear();
                var month = date.getMonth();
                return month === 0
                    ? this.changeYearMonthAndClampDate(date, year - 1, 11)
                    : this.changeYearMonthAndClampDate(date, year, month - 1);
            },

            nextMonth: function (date) {
                var year = date.getFullYear();
                var month = date.getMonth();
                return month === 11
                    ? this.changeYearMonthAndClampDate(date, year + 1, 0)
                    : this.changeYearMonthAndClampDate(date, year, month + 1);
            },

            prevYear: function (date, amount) {
                amount = amount || 1;
                var year = date.getFullYear();
                var month = date.getMonth();
                return this.changeYearMonthAndClampDate(date, year - amount, month);
            },

            nextYear: function (date, amount) {
                amount = amount || 1;
                var year = date.getFullYear();
                var month = date.getMonth();
                return this.changeYearMonthAndClampDate(date, year + amount, month);
            },

            extractDateFormat: function (format) {
                return format
                    .replace(/\W?m{1,2}|\W?ZZ/g, '')
                    .replace(/\W?h{1,2}|\W?s{1,3}|\W?a/gi, '')
                    .trim();
            },

            extractTimeFormat: function (format) {
                return format
                    .replace(/\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?y{2,4}/g, '')
                    .trim();
            },

            validateRangeInOneMonth: function (start, end) {
                return (start.getMonth() === end.getMonth()) && (start.getFullYear() === end.getFullYear());
            }
        }
    })(DATEUTIL.fecha);
    Vue.prototype.$dateutil = pack;
    return pack;
})
