/*!
 * jQuery Validation Plugin 1.11.1
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 Jörn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

    var regex = '';
    $.extend($.fn, {
        // http://docs.jquery.com/Plugins/Validation/validate
        validate: function(options) {

            // if nothing is selected, return nothing; can't chain anyway
            if (!this.length) {
                if (options && options.debug && window.console) {
                    console.warn("Nothing selected, can't validate, returning nothing.");
                }
                return;
            }

            // check if a validator for this form was already created
            var validator = $.data(this[0], "validator");
            if (validator) {
                return validator;
            }

            // Add novalidate tag if HTML5.
            this.attr("novalidate", "novalidate");

            validator = new $.validator(options, this[0]);
            $.data(this[0], "validator", validator);

            if (validator.settings.onsubmit) {

                this.validateDelegate(":submit", "click", function(event) {
                    if (validator.settings.submitHandler) {
                        validator.submitButton = event.target;
                    }
                    // allow suppressing validation by adding a cancel class to the submit button
                    if ($(event.target).hasClass("cancel")) {
                        validator.cancelSubmit = true;
                    }

                    // allow suppressing validation by adding the html5 formnovalidate attribute to the submit button
                    if ($(event.target).attr("formnovalidate") !== undefined) {
                        validator.cancelSubmit = true;
                    }
                });

                // validate the form on submit
                this.submit(function(event) {
                    if (validator.settings.debug) {
                        // prevent form submit to be able to see console output
                        event.preventDefault();
                    }

                    function handle() {
                        var hidden;
                        if (validator.settings.submitHandler) {
                            if (validator.submitButton) {
                                // insert a hidden input as a replacement for the missing submit button
                                hidden = $("<input type='hidden'/>").attr("name", validator.submitButton.name).val($(validator.submitButton).val()).appendTo(validator.currentForm);
                            }
                            validator.settings.submitHandler.call(validator, validator.currentForm, event);
                            if (validator.submitButton) {
                                // and clean up afterwards; thanks to no-block-scope, hidden can be referenced
                                hidden.remove();
                            }
                            return false;
                        }
                        return true;
                    }

                    // prevent submit for invalid forms or custom submit handlers
                    if (validator.cancelSubmit) {
                        validator.cancelSubmit = false;
                        return handle();
                    }
                    if (validator.form()) {
                        if (validator.pendingRequest) {
                            validator.formSubmitted = true;
                            return false;
                        }
                        return handle();
                    } else {
                        validator.focusInvalid();
                        return false;
                    }
                });
            }

            return validator;
        },
        // http://docs.jquery.com/Plugins/Validation/valid
        valid: function() {
            if ($(this[0]).is("form")) {
                return this.validate().form();
            } else {
                var valid = true;
                var validator = $(this[0].form).validate();
                this.each(function() {
                    valid = valid && validator.element(this);
                });
                return valid;
            }
        },
        // attributes: space seperated list of attributes to retrieve and remove
        removeAttrs: function(attributes) {
            var result = {},
                $element = this;
            $.each(attributes.split(/\s/), function(index, value) {
                result[value] = $element.attr(value);
                $element.removeAttr(value);
            });
            return result;
        },
        // http://docs.jquery.com/Plugins/Validation/rules
        rules: function(command, argument) {
            var element = this[0];

            if (command) {
                var settings = $.data(element.form, "validator").settings;
                var staticRules = settings.rules;
                var existingRules = $.validator.staticRules(element);
                switch (command) {
                    case "add":
                        $.extend(existingRules, $.validator.normalizeRule(argument));
                        // remove messages from rules, but allow them to be set separetely
                        delete existingRules.messages;
                        staticRules[element.name] = existingRules;
                        if (argument.messages) {
                            settings.messages[element.name] = $.extend(settings.messages[element.name], argument.messages);
                        }
                        break;
                    case "remove":
                        if (!argument) {
                            delete staticRules[element.name];
                            return existingRules;
                        }
                        var filtered = {};
                        $.each(argument.split(/\s/), function(index, method) {
                            filtered[method] = existingRules[method];
                            delete existingRules[method];
                        });
                        return filtered;
                }
            }

            var data = $.validator.normalizeRules(
                $.extend({},
                    $.validator.classRules(element),
                    $.validator.attributeRules(element),
                    $.validator.dataRules(element),
                    $.validator.staticRules(element)
                ), element);

            // make sure required is at front
            if (data.required) {
                var param = data.required;
                delete data.required;
                data = $.extend({
                    required: param
                }, data);
            }

            return data;
        }
    });

    // Custom selectors
    $.extend($.expr[":"], {
        // http://docs.jquery.com/Plugins/Validation/blank
        blank: function(a) {
            return !$.trim("" + $(a).val());
        },
        // http://docs.jquery.com/Plugins/Validation/filled
        filled: function(a) {
            return !!$.trim("" + $(a).val());
        },
        // http://docs.jquery.com/Plugins/Validation/unchecked
        unchecked: function(a) {
            return !$(a).prop("checked");
        }
    });

    // constructor for validator
    $.validator = function(options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };

    $.validator.format = function(source, params) {
        if (arguments.length === 1) {
            return function() {
                var args = $.makeArray(arguments);
                args.unshift(source);
                return $.validator.format.apply(this, args);
            };
        }
        if (arguments.length > 2 && params.constructor !== Array) {
            params = $.makeArray(arguments).slice(1);
        }
        if (params.constructor !== Array) {
            params = [params];
        }
        $.each(params, function(i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
                return n;
            });
        });
        return source;
    };

    $.extend($.validator, {

        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "error",
            validClass: "valid",
            errorElement: "label",
            focusInvalid: true,
            errorContainer: $([]),
            errorLabelContainer: $([]),
            onsubmit: true,
            /*ignore: ":hidden",*/
            ignoreTitle: false,
            onfocusin: function(element, event) {
                this.lastActive = element;

                // hide error label and remove error class on focus if enabled
                if (this.settings.focusCleanup && !this.blockFocusCleanup) {
                    if (this.settings.unhighlight) {
                        this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.addWrapper(this.errorsFor(element)).hide();
                }
            },
            onfocusout: function(element, event) {
                if (!this.checkable(element) && (element.name in this.submitted || !this.optional(element))) {
                    this.element(element);
                }
            },
            onkeyup: function(element, event) {
                if (event.which === 9 && this.elementValue(element) === "") {
                    return;
                } else if (element.name in this.submitted || element === this.lastElement) {
                    this.element(element);
                }
            },
            onclick: function(element, event) {
                // click on selects, radiobuttons and checkboxes
                if (element.name in this.submitted) {
                    this.element(element);
                }
                // or option elements, check parent select in that case
                else if (element.parentNode.name in this.submitted) {
                    this.element(element.parentNode);
                }
            },
            highlight: function(element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).addClass(errorClass).removeClass(validClass);
                } else {
                    $(element).addClass(errorClass).removeClass(validClass);
                }
            },
            unhighlight: function(element, errorClass, validClass) {
                if (element.type === "radio") {
                    this.findByName(element.name).removeClass(errorClass).addClass(validClass);
                } else {
                    $(element).removeClass(errorClass).addClass(validClass);
                }
            }
        },

        // http://docs.jquery.com/Plugins/Validation/Validator/setDefaults
        setDefaults: function(settings) {
            $.extend($.validator.defaults, settings);
        },

        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            email2: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            positiveInteger:"Please enter only positive integer.",
            regVali: "enter error.",
            checkIP: "Please enter a valid IP",
            checkBigger: "The latter number should be larger than the previous one.",
            checkSpace: "Cannot include Spaces before or after the input string",
            checkMAC: "Please enter a valid MAC",
            checkUser: "Please enter a valid User",
            checkIPV4: "Please enter a valid IPv4",
            checkIPA: "Please enter a valid IPv4 or IPv4 segement",
            checkIPV46: "Please enter a valid IPv4 or IPv6",
            checkIPS: "Please enter a valid IPv4",
            checkIPName: "Please enter a valid IP name",
            checkDomainName: "please enter a valid domain name",
            checkLinkName:"please enter a valid link name",
            checkDomain: "Please enter a valid domain.",
            checkAuthDomain: "Please enter a valid auth domain.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            checkOption:"Please enter a valid option.",
            checkDataType: "Please enter a valid datatype.",
            maxValue:"Please enter a valid value.",
            maxlength: $.validator.format("Please enter no more than {0} characters."),
            minlength: $.validator.format("Please enter at least {0} characters."),
            rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
            range: $.validator.format("Please enter a value between {0} and {1}."),
            max: $.validator.format("Please enter a value less than or equal to {0}."),
            min: $.validator.format("Please enter a value greater than or equal to {0}.")
        },

        autoCreateRanges: false,

        prototype: {

            init: function() {
                this.labelContainer = $(this.settings.errorLabelContainer);
                this.errorContext = this.labelContainer.length && this.labelContainer || $(this.currentForm);
                this.containers = $(this.settings.errorContainer).add(this.settings.errorLabelContainer);
                this.submitted = {};
                this.valueCache = {};
                this.pendingRequest = 0;
                this.pending = {};
                this.invalid = {};
                this.reset();

                var groups = (this.groups = {});
                $.each(this.settings.groups, function(key, value) {
                    if (typeof value === "string") {
                        value = value.split(/\s/);
                    }
                    $.each(value, function(index, name) {
                        groups[name] = key;
                    });
                });
                var rules = this.settings.rules;
                $.each(rules, function(key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });

                function delegate(event) {
                    var validator = $.data(this[0].form, "validator"),
                        eventType = "on" + event.type.replace(/^validate/, "");
                    if (validator.settings[eventType]) {
                        validator.settings[eventType].call(validator, this[0], event);
                    }
                }

                $(this.currentForm)
                    .validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
                        "[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
                        "[type='email'], [type='email2'], [type='datetime'], [type='date'], [type='month'], " +
                        "[type='week'], [type='time'], [type='datetime-local'], " +
                        "[type='range'], [type='color'] ",
                        "focusin focusout keyup", delegate)
                    .validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);

                if (this.settings.invalidHandler) {
                    $(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
                }
            },

            // http://docs.jquery.com/Plugins/Validation/Validator/form
            form: function() {
                this.checkForm();
                $.extend(this.submitted, this.errorMap);
                this.invalid = $.extend({}, this.errorMap);
                if (!this.valid()) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                }
                this.showErrors();
                return this.valid();
            },

            checkForm: function() {
                this.prepareForm();
                for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
                    this.check(elements[i]);
                }
                return this.valid();
            },

            // http://docs.jquery.com/Plugins/Validation/Validator/element
            element: function(element) {
                element = this.validationTargetFor(this.clean(element));
                this.lastElement = element;
                this.prepareElement(element);
                this.currentElements = $(element);
                var result = this.check(element) !== false;
                if (result) {
                    delete this.invalid[element.name];
                } else {
                    this.invalid[element.name] = true;
                }
                if (!this.numberOfInvalids()) {
                    // Hide error containers on last error
                    this.toHide = this.toHide.add(this.containers);
                }
                this.showErrors();
                return result;
            },

            // http://docs.jquery.com/Plugins/Validation/Validator/showErrors
            showErrors: function(errors) {
                if (errors) {
                    // add items to error list and map
                    $.extend(this.errorMap, errors);
                    this.errorList = [];
                    for (var name in errors) {
                        this.errorList.push({
                            message: errors[name],
                            element: this.findByName(name)[0]
                        });
                    }
                    // remove items from success list
                    this.successList = $.grep(this.successList, function(element) {
                        return !(element.name in errors);
                    });
                }
                if (this.settings.showErrors) {
                    this.settings.showErrors.call(this, this.errorMap, this.errorList);
                } else {
                    this.defaultShowErrors();
                }
            },

            // http://docs.jquery.com/Plugins/Validation/Validator/resetForm
            resetForm: function() {
                if ($.fn.resetForm) {
                    $(this.currentForm).resetForm();
                }
                this.submitted = {};
                this.lastElement = null;
                this.prepareForm();
                this.hideErrors();
                this.elements().removeClass(this.settings.errorClass).removeData("previousValue");
            },

            numberOfInvalids: function() {
                return this.objectLength(this.invalid);
            },

            objectLength: function(obj) {
                var count = 0;
                for (var i in obj) {
                    count++;
                }
                return count;
            },

            hideErrors: function() {
                this.addWrapper(this.toHide).hide();
            },

            valid: function() {
                return this.size() === 0;
            },

            size: function() {
                return this.errorList.length;
            },

            focusInvalid: function() {
                if (this.settings.focusInvalid) {
                    try {
                        $(this.findLastActive() || this.errorList.length && this.errorList[0].element || [])
                            .filter(":visible")
                            .focus()
                            // manually trigger focusin event; without it, focusin handler isn't called, findLastActive won't have anything to find
                            .trigger("focusin");
                    } catch (e) {
                        // ignore IE throwing errors when focusing hidden elements
                    }
                }
            },

            findLastActive: function() {
                var lastActive = this.lastActive;
                return lastActive && $.grep(this.errorList, function(n) {
                    return n.element.name === lastActive.name;
                }).length === 1 && lastActive;
            },

            elements: function() {
                var validator = this,
                    rulesCache = {};

                // select all valid inputs inside the form (no submit or reset buttons)
                return $(this.currentForm)
                    .find("input, select, textarea")
                    .not(":submit, :reset, :image, [disabled]")
                    .not(this.settings.ignore)
                    .filter(function() {
                        if (!this.name && validator.settings.debug && window.console) {
                            console.error("%o has no name assigned", this);
                        }

                        // select only the first element for each name, and only those with rules specified
                        if (this.name in rulesCache || !validator.objectLength($(this).rules())) {
                            return false;
                        }

                        rulesCache[this.name] = true;
                        return true;
                    });
            },

            clean: function(selector) {
                return $(selector)[0];
            },

            errors: function() {
                var errorClass = this.settings.errorClass.replace(" ", ".");
                return $(this.settings.errorElement + "." + errorClass, this.errorContext);
            },

            reset: function() {
                this.successList = [];
                this.errorList = [];
                this.errorMap = {};
                this.toShow = $([]);
                this.toHide = $([]);
                this.currentElements = $([]);
            },

            prepareForm: function() {
                this.reset();
                this.toHide = this.errors().add(this.containers);
            },

            prepareElement: function(element) {
                this.reset();
                this.toHide = this.errorsFor(element);
            },

            elementValue: function(element) {
                var type = $(element).attr("type"),
                    val = $(element).val();

                if (type === "radio" || type === "checkbox") {
                    return $("input[name='" + $(element).attr("name") + "']:checked").val();
                }

                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },

            check: function(element) {
                element = this.validationTargetFor(this.clean(element));

                var rules = $(element).rules();
                var dependencyMismatch = false;
                var val = this.elementValue(element);
                var result;

                for (var method in rules) {
                    var rule = {
                        method: method,
                        parameters: rules[method]
                    };
                    if ('regVali' == method || 'UnRegVali' == method) {
                        regex = rule.parameters;
                    }
                    try {
                        result = $.validator.methods[method].call(this, val, element, rule.parameters);
                        // if a method indicates that the field is optional and therefore valid,
                        // don't mark it as valid when there are no other rules
                        if (result === "dependency-mismatch") {
                            dependencyMismatch = true;
                            continue;
                        }
                        dependencyMismatch = false;

                        if (result === "pending") {
                            this.toHide = this.toHide.not(this.errorsFor(element));
                            return;
                        }

                        if (!result) {
                            this.formatAndAdd(element, rule);
                            return false;
                        }
                    } catch (e) {
                        if (this.settings.debug && window.console) {
                            console.log("Exception occurred when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
                        }
                        throw e;
                    }
                }
                if (dependencyMismatch) {
                    return;
                }
                if (this.objectLength(rules)) {
                    this.successList.push(element);
                }
                return true;
            },

            // return the custom message for the given element and validation method
            // specified in the element's HTML5 data attribute
            customDataMessage: function(element, method) {
                return $(element).data("msg-" + method.toLowerCase()) || (element.attributes && $(element).attr("data-msg-" + method.toLowerCase()));
            },

            // return the custom message for the given element name and validation method
            customMessage: function(name, method) {
                var m = this.settings.messages[name];
                return m && (m.constructor === String ? m : m[method]);
            },

            // return the first defined argument, allowing empty strings
            findDefined: function() {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] !== undefined) {
                        return arguments[i];
                    }
                }
                return undefined;
            },

            defaultMessage: function(element, method) {
                return this.findDefined(
                    this.customMessage(element.name, method),
                    this.customDataMessage(element, method),
                    // title is never undefined, so handle empty string as undefined
                    !this.settings.ignoreTitle && element.title || undefined,
                    $.validator.messages[method],
                    "<strong>Warning: No message defined for " + element.name + "</strong>"
                );
            },

            formatAndAdd: function(element, rule) {
                var message = this.defaultMessage(element, rule.method),
                    theregex = /\$?\{(\d+)\}/g;
                if (typeof message === "function") {
                    message = message.call(this, rule.parameters, element);
                } else if (theregex.test(message)) {
                    message = $.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
                }
                this.errorList.push({
                    message: message,
                    element: element
                });

                this.errorMap[element.name] = message;
                this.submitted[element.name] = message;
            },

            addWrapper: function(toToggle) {
                if (this.settings.wrapper) {
                    toToggle = toToggle.add(toToggle.parent(this.settings.wrapper));
                }
                return toToggle;
            },

            defaultShowErrors: function() {
                var i, elements;
                for (i = 0; this.errorList[i]; i++) {
                    var error = this.errorList[i];
                    if (this.settings.highlight) {
                        this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
                    }
                    this.showLabel(error.element, error.message);
                }
                if (this.errorList.length) {
                    this.toShow = this.toShow.add(this.containers);
                }
                if (this.settings.success) {
                    for (i = 0; this.successList[i]; i++) {
                        this.showLabel(this.successList[i]);
                    }
                }
                if (this.settings.unhighlight) {
                    for (i = 0, elements = this.validElements(); elements[i]; i++) {
                        this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
                    }
                }
                this.toHide = this.toHide.not(this.toShow);
                this.hideErrors();
                this.addWrapper(this.toShow).show();
            },

            validElements: function() {
                return this.currentElements.not(this.invalidElements());
            },

            invalidElements: function() {
                return $(this.errorList).map(function() {
                    return this.element;
                });
            },

            showLabel: function(element, message) {
                var label = this.errorsFor(element);
                if (label.length) {
                    // refresh error/success class
                    label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
                    // replace message on existing label
                    label.html(message);
                } else {
                    // create label
                    label = $("<" + this.settings.errorElement + ">")
                        .attr("for", this.idOrName(element))
                        .addClass(this.settings.errorClass)
                        .html(message || "");
                    if (this.settings.wrapper) {
                        // make sure the element is visible, even in IE
                        // actually showing the wrapped element is handled elsewhere
                        label = label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
                    }
                    if (!this.labelContainer.append(label).length) {
                        if (this.settings.errorPlacement) {
                            this.settings.errorPlacement(label, $(element));
                        } else {
                            label.insertAfter(element);
                        }
                    }
                }
                if (!message && this.settings.success) {
                    label.text("");
                    if (typeof this.settings.success === "string") {
                        label.addClass(this.settings.success);
                    } else {
                        this.settings.success(label, element);
                    }
                }
                this.toShow = this.toShow.add(label);
            },

            errorsFor: function(element) {
                var name = this.idOrName(element);
                return this.errors().filter(function() {
                    return $(this).attr("for") === name;
                });
            },

            idOrName: function(element) {
                return this.groups[element.name] || (this.checkable(element) ? element.name : element.id || element.name);
            },

            validationTargetFor: function(element) {
                // if radio/checkbox, validate first element in group instead
                if (this.checkable(element)) {
                    element = this.findByName(element.name).not(this.settings.ignore)[0];
                }
                return element;
            },

            checkable: function(element) {
                return (/radio|checkbox/i).test(element.type);
            },

            findByName: function(name) {
                return $(this.currentForm).find("[name='" + name + "']");
            },

            getLength: function(value, element) {
                switch (element.nodeName.toLowerCase()) {
                    case "select":
                        return $("option:selected", element).length;
                    case "input":
                        if (this.checkable(element)) {
                            return this.findByName(element.name).filter(":checked").length;
                        }
                }
                return value.length;
            },

            depend: function(param, element) {
                return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element) : true;
            },

            dependTypes: {
                "boolean": function(param, element) {
                    return param;
                },
                "string": function(param, element) {
                    return !!$(param, element.form).length;
                },
                "function": function(param, element) {
                    return param(element);
                }
            },

            optional: function(element) {
                var val = this.elementValue(element);
                return !$.validator.methods.required.call(this, val, element) && "dependency-mismatch";
            },

            startRequest: function(element) {
                if (!this.pending[element.name]) {
                    this.pendingRequest++;
                    this.pending[element.name] = true;
                }
            },

            stopRequest: function(element, valid) {
                this.pendingRequest--;
                // sometimes synchronization fails, make sure pendingRequest is never < 0
                if (this.pendingRequest < 0) {
                    this.pendingRequest = 0;
                }
                delete this.pending[element.name];
                if (valid && this.pendingRequest === 0 && this.formSubmitted && this.form()) {
                    $(this.currentForm).submit();
                    this.formSubmitted = false;
                } else if (!valid && this.pendingRequest === 0 && this.formSubmitted) {
                    $(this.currentForm).triggerHandler("invalid-form", [this]);
                    this.formSubmitted = false;
                }
            },

            previousValue: function(element) {
                return $.data(element, "previousValue") || $.data(element, "previousValue", {
                    old: null,
                    valid: true,
                    message: this.defaultMessage(element, "remote")
                });
            }

        },

        classRuleSettings: {
            required: {
                required: true
            },
            email: {
                email: true
            },
            email2: {
            	email2: true
            },
            url: {
                url: true
            },
            date: {
                date: true
            },
            dateISO: {
                dateISO: true
            },
            number: {
                number: true
            },
            digits: {
                digits: true
            },
            positiveInteger: {
            	positiveInteger: true
            },
            checkDomain: {
                checkDomain: true
            },
            checkLinkName:{
            	checkLinkName: true
            },
            checkAuthDomain: {
            	checkAuthDomain: true
            },
            regVali: {
                regVali: null
            },
            UnRegVali: {
                UnRegVali: null
            },
            checkIP: {
                checkIP: true
            },
            checkUser: {
                checkUser: true
            },
            checkBigger: {
                checkBigger: true
            },
            checkMAC: {
                checkMAC: true
            },
            checkSpace: {
                checkSpace: true
            },
            checkIPV4: {
                checkIPV4: true
            },
            checkOption: {
            	checkOption: true
            },
            checkDataType: {
            	checkDataType: true
            },
            maxValue: {
            	maxValue: true
            },
            checkIPA: {
                checkIPA: true
            },
            checkIPV46: {
            	checkIPV46: true
            },
            checkIPS: {
                checkIPS: true
            },
            checkIPName: {
            	checkIPName: true
            },
            checkDomainName: {
                checkDomainName: true
            },
            creditcard: {
                creditcard: true
            }
        },
        addClassRules: function(className, rules) {
            if (className.constructor === String) {
                this.classRuleSettings[className] = rules;
            } else {
                $.extend(this.classRuleSettings, className);
            }
        },

        classRules: function(element) {
            var rules = {};
            var classes = $(element).attr("class");
            if (classes) {
                $.each(classes.split(" "), function() {
                    if (this in $.validator.classRuleSettings) {
                        $.extend(rules, $.validator.classRuleSettings[this]);
                    }
                });
            }
            return rules;
        },

        attributeRules: function(element) {
            var rules = {};
            var $element = $(element);
            var type = $element[0].getAttribute("type");

            for (var method in $.validator.methods) {
                var value;

                // support for <input required> in both html5 and older browsers
                if (method === "required") {
                    value = $element.get(0).getAttribute(method);
                    // Some browsers return an empty string for the required attribute
                    // and non-HTML5 browsers might have required="" markup
                    if (value === "") {
                        value = true;
                    }
                    // force non-HTML5 browsers to return bool
                    value = !!value;
                } else {
                    value = $element.attr(method);
                }

                // convert the value to a number for number inputs, and for text for backwards compability
                // allows type="date" and others to be compared as strings
                if (/min|max/.test(method) && (type === null || /number|range|text/.test(type))) {
                    value = Number(value);
                }

                if (value) {
                    rules[method] = value;
                } else if (type === method && type !== 'range') {
                    // exception: the jquery validate 'range' method
                    // does not test for the html5 'range' type
                    rules[method] = true;
                }
            }

            // maxlength may be returned as -1, 2147483647 (IE) and 524288 (safari) for text inputs
            if (rules.maxlength && /-1|2147483647|524288/.test(rules.maxlength)) {
                delete rules.maxlength;
            }

            return rules;
        },

        dataRules: function(element) {
            var method, value,
                rules = {},
                $element = $(element);
            for (method in $.validator.methods) {
                value = $element.data("rule-" + method.toLowerCase());
                if (value !== undefined) {
                    rules[method] = value;
                }
            }
            return rules;
        },

        staticRules: function(element) {
            var rules = {};
            var validator = $.data(element.form, "validator");
            if (validator.settings.rules) {
                rules = $.validator.normalizeRule(validator.settings.rules[element.name]) || {};
            }
            return rules;
        },

        normalizeRules: function(rules, element) {
            // handle dependency check
            $.each(rules, function(prop, val) {
                // ignore rule when param is explicitly false, eg. required:false
                if (val === false) {
                    delete rules[prop];
                    return;
                }
                if (val.param || val.depends) {
                    var keepRule = true;
                    switch (typeof val.depends) {
                        case "string":
                            keepRule = !!$(val.depends, element.form).length;
                            break;
                        case "function":
                            keepRule = val.depends.call(element, element);
                            break;
                    }
                    if (keepRule) {
                        rules[prop] = val.param !== undefined ? val.param : true;
                    } else {
                        delete rules[prop];
                    }
                }
            });

            // evaluate parameters
            $.each(rules, function(rule, parameter) {
                rules[rule] = $.isFunction(parameter) ? parameter(element) : parameter;
            });

            // clean number parameters
            $.each(['minlength', 'maxlength'], function() {
                if (rules[this]) {
                    rules[this] = Number(rules[this]);
                }
            });
            $.each(['rangelength', 'range'], function() {
                var parts;
                if (rules[this]) {
                    if ($.isArray(rules[this])) {
                        rules[this] = [Number(rules[this][0]), Number(rules[this][1])];
                    } else if (typeof rules[this] === "string") {
                        parts = rules[this].split(/[\s,]+/);
                        rules[this] = [Number(parts[0]), Number(parts[1])];
                    }
                }
            });

            if ($.validator.autoCreateRanges) {
                // auto-create ranges
                if (rules.min && rules.max) {
                    rules.range = [rules.min, rules.max];
                    delete rules.min;
                    delete rules.max;
                }
                if (rules.minlength && rules.maxlength) {
                    rules.rangelength = [rules.minlength, rules.maxlength];
                    delete rules.minlength;
                    delete rules.maxlength;
                }
            }

            return rules;
        },

        // Converts a simple string to a {string: true} rule, e.g., "required" to {required:true}
        normalizeRule: function(data) {
            if (typeof data === "string") {
                var transformed = {};
                $.each(data.split(/\s/), function() {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },

        // http://docs.jquery.com/Plugins/Validation/Validator/addMethod
        addMethod: function(name, method, message) {
            $.validator.methods[name] = method;
            $.validator.messages[name] = message !== undefined ? message : $.validator.messages[name];
            if (method.length < 3) {
                $.validator.addClassRules(name, $.validator.normalizeRule(name));
            }
        },

        methods: {

            // http://docs.jquery.com/Plugins/Validation/Methods/required
            required: function(value, element, param) {
                // check if dependency is met
                if (!this.depend(param, element)) {
                    return "dependency-mismatch";
                }
                if (element.nodeName.toLowerCase() === "select") {
                    // could be an array for select-multiple or a string, both are fine this way
                    var val = $(element).val();
                    return val && val.length > 0;
                }
                if (this.checkable(element)) {
                    return this.getLength(value, element) > 0;
                }
                return $.trim(value).length > 0;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/email
            email: function(value, element) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
                return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },
            
            email2: function(value, element) {
                return this.optional(element) || /^[0-9a-zA-Z][\w.]+.$/.test(value) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/url
            url: function(value, element) {
                // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
                return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/date
            date: function(value, element) {
                return this.optional(element) || !/Invalid|NaN/.test(new Date(value).toString());
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/dateISO
            dateISO: function(value, element) {
                return this.optional(element) || /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/number
            number: function(value, element) {
                return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/digits
            digits: function(value, element) {
                return this.optional(element) || /^\d+$/.test(value);
            },
            positiveInteger: function(value, element) {
                return this.optional(element) || /^[1-9]\d*$/.test(value);
            },

            regVali: function(value, element) {
                if ('' != regex) {
                    return this.optional(element) || regex.test(value);
                }

            },

            UnRegVali: function(value, element) {
                if ('' != regex) {
                    return this.optional(element) || !regex.test(value);
                }

            },
            checkSpace: function(value, element) {
                return this.optional(element) || validspace(value);
            },
            checkIPV4: function(value, element) {
                return this.optional(element) || validip(value, 1);
            },
            checkIPA: function(value, element) {
                return this.optional(element) || checkIP(value);
            },
            checkIPV46: function(value, element) {
                return this.optional(element) || checkIP46(value);
            },
            checkIPS: function(value, element) {
                return this.optional(element) || validip(value, 3);
            },
            checkIPName: function(value, element) {
                return this.optional(element) || /^[\w.-]+$/.test(value);
            },
            checkMAC: function(value, element) {
                return this.optional(element) || /^[A-Fa-f0-9]{2}(:[A-Fa-f0-9]{2}){5}$/.test(value) || /^[A-Fa-f0-9]{2}(-[A-Fa-f0-9]{2}){5}$/.test(value) || /^[A-Fa-f0-9]{1,}(::[A-Fa-f0-9]{1,})$/.test(value);
            },
            checkUser: function(value, element) {
                return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
            },
            checkIP: function(value, element) {
                return this.optional(element) || validip(value, 2);
            },
            checkBigger: function(value, element) {
                return validateBigger(element);
            },
            
            checkDomain: function(value, element) {
                return this.optional(element) || /^(?=^.{1,255}$)((([a-zA-Z_0-9\-][-a-zA-Z_0-9\-]{0,62})|\*)(\.[a-zA-Z_0-9\-][-a-zA-Z_0-9\-]{0,62})*){0,1}[\.]{0,1}$/.test(value);
            },
            checkLinkName: function(value, element) {
                return this.optional(element) ||  /^[a-zA-Z0-9]+$/.test(value);
            },
            checkAuthDomain: function(value, element) {
                return this.optional(element) || /^[\w.-]+$/.test(value);
            },

            checkDomainName: function(value, element) {
                return this.optional(element) || /^(?=^.{1,255}$)((([a-zA-Z_0-9][-a-zA-Z_0-9]{0,62})|\*)(\.[a-zA-Z_0-9][-a-zA-Z_0-9]{0,62})*){0,1}[\.]{0,1}$/.test(value);
            },
            
            // http://docs.jquery.com/Plugins/Validation/Methods/creditcard
            // based on http://en.wikipedia.org/wiki/Luhn
            creditcard: function(value, element) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }
                // accept only spaces, digits and dashes
                if (/[^0-9 \-]+/.test(value)) {
                    return false;
                }
                var nCheck = 0,
                    nDigit = 0,
                    bEven = false;

                value = value.replace(/\D/g, "");

                for (var n = value.length - 1; n >= 0; n--) {
                    var cDigit = value.charAt(n);
                    nDigit = parseInt(cDigit, 10);
                    if (bEven) {
                        if ((nDigit *= 2) > 9) {
                            nDigit -= 9;
                        }
                    }
                    nCheck += nDigit;
                    bEven = !bEven;
                }

                return (nCheck % 10) === 0;
            },
            checkOption:function(value, element, param) {
                if(param==1){
             	   if(!checkIP46(value)){
             		   $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectIpMsg");
             		   return false;
             	   }
                }else if(param==2){
             	  if(value.length>255){
             		 $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.enterStringLenthLessThan255");
             		  return false
             	  } 
                }else if(param==3){//ASCII字符集，不超过255字节
                	if(value!=null&&value!=""){
                		var s="";
                		for (var i = 0; i < value.length; i++) {
							s=s+value[i].charCodeAt();
						}
                		if(s.length>255){
                			$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.enterAsciiLessThan255");
                			return false;
                		}
                	}else{
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.enterAsciiLessThan255");
            			return false;
                	}
                }else if(param==4){//true/false
                	if(value=="true"||value=="false"){
                		 if(typeof(eval(value)) != "boolean"){
                		   $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.enterTrueOrFalse");
                   		   return false;
                   	   }
                	}else{
                		 $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.enterTrueOrFalse");
                		 return false;
                	}
                }else if(param==5){//范围0~255
                	if(!checkValue579(value,255)){
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.range0To255");
                		return false;
                	}
                }else if(param==6){//范围-128~127
                	if(!checkValue6810(value,127,128)){
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.range128To127");
                		return false;
                	}
                	
                }else if(param==7){//范围0~65535
                	if(!checkValue579(value,65535)){
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.range0To65535");
                		return false;
                	}
                	
                }else if(param==8){//范围-32768~ 32767
                	if(!checkValue6810(value,32767,32768)){
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.range32768To32767");
                		return false;
                	}
                }else if(param==9){//范围0~4294967295
                	if(!checkValue579(value,4294967295)){
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.range0To4294967295");
                		return false;
                	}
                }else if(param==10){//范围-2147483648~2147483647
                	if(!checkValue6810(value,2147483647,2147483648)){
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.range2147483648To2147483647");
                		return false;
                	}
                }else if(param==11){//1.1.1.1;2.2.2.2(中间用分号分割)  //checkIP46
                	if(value!=null&&value!=""){
                		if(value.indexOf(";") != -1){
                   		   for(var i=0;i<value.split(";").length;i++){
                   			 if(!checkIP46(value.split(";")[i])){
                   				  $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIp");
                      			  return false 
                      		   }
                   		   }
                   	   }else{
                   		   if(!checkIP46(value)){
                   			  $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIp");
                   			  return false 
                   		   }
                   	   }
                	}else{
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIp");
                		 return false
                	}
                }else if(param==12){//1;2;3
                   if(!checkValuePlus(value,255)){
                	   $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipArray0To255");
                	   return false
                   }
                }else if(param==13){//-1;2;-3
            	   if(!checkValueNegative(value,127,128)){
            		 $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipArray128To127");
              	     return false
                   }
                }else if(param==14){//1;2;3
                   if(!checkValuePlus(value,65535)){
                	  $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipArray0To65535");
                  	  return false
                   }
                }else if(param==15){//-1;2;-3
                   if(!checkValueNegative(value,32767,32768)){
                	   $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipArray32768To32767");
                  	   return false
                   }
                }else if(param==16){//1;2;3
                   if(!checkValuePlus(value,4294967295)){
                	   $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipArray0To4294967295");
                  	   return false
                   }
                }else if(param==17){//-1;2;-3
                   if(!checkValueNegative(value,2147483647,2147483648)){
                	   $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipArray2147483648To2147483647");
                  	   return false
                   }
                }else if(param==18){//1.1.1.1 2.2.2.2;3.3.3.3 4.4.4.4(对与对间用分号，对内用空格)
                	if(value!=null&&value!=""){
               		   if(value.indexOf(";") != -1){
                  		   for(var i=0;i<value.split(";").length;i++){//解析";"
                  			   var  val=value.split(";")[i];
                  			   if(val.indexOf(" ") != -1){
	                  			   for(var j=0;j<val.split(" ").length;j++){//解析" "
	                  				    if(!checkIP46(val.split(" ")[j])){
	                  				    	$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpArray");
	                  				    	return false 
	                  				 	}
	                  			   }
                  			   }else{
                  				  $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpArray");
                  				  return false 
                  			   }
                  		   }
                  	   }else{//不含";"
                  		   if(value.indexOf(" ") != -1){//不含";".判断含有" "(空格)
                  			   for(var i=0;i<value.split(" ").length;i++){
                    		      if(!checkIP46(value.split(" ")[i])){
                    		    	  $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpArray");
                    			      return false 
                    		      }
                  			   }
                    	   }else{
                    		   $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpArray");
                    		   return false 
                    	   }
                  	   }
                	}else{//为空时
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpArray");
                		return false
                	}
                	
                }else if(param==19){//false 1.1.1.1;2.2.2.3
                	if(value!=null&&value!=""){
                		if(value.indexOf(" ") != -1){
                			if(value.split(" ").length>2){
                				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndIpArray");
                				return false
                			}
                			if(value.split(" ")[0]=="true"||value.split(" ")[0]=="false"){
                				if(typeof(eval(value.split(" ")[0])) != "boolean"){
                					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndIpArray");
                    				return false
                    			}
                			}else{
                				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndIpArray");
                				return false
                			}
                			
                			if(value.split(" ")[1].indexOf(";") != -1){
                				var val=value.split(" ")[1];
                				for (var i = 0; i < val.split(";").length; i++) {
									if(!checkIP46(val.split(";")[i])){
										$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndIpArray");
										return false;
									}
								}
                			}else{
                				if(!checkIP46(value.split(" ")[1])){
                					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndIpArray");
									return false;
								}
                			}
                		}else{
                			$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndIpArray");
                			return false;
                		}
                		
                	}else{
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndIpArray");
                		return false 
                	}
                	
                }else if(param==20){//true dhcp(中间用空格分割)
                	if(value!=null&&value!=""){
                		if(value.indexOf(" ") != -1){
                			if(value.indexOf(" ").length>2){
                				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndString");
                				return false
                			}
                			if(value.split(" ")[0]=="true"||value.split(" ")[0]=="false"){
                				if(typeof(eval(value.split(" ")[0])) != "boolean"){
                					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndString");
                    				return false
                    			}
                			}else{
                				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndString");
                				return false
                			}
                			
                			if(value.split(" ")[1]!=null&&value.split(" ")[1]!=""){
                				if(value.split(" ")[1].length>255&&value.split(" ")[1].length<0){
                					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndString");
                    				return false
                    			}
                			}else{
                				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndString");
                				return false
                			}
                			
                		}else{
                			$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndString");
                			return false
                		}
                	}else{
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipTrueOrFalseAndString");
                		return false
                	}
                	
                }else if(param==22){//www.baidu.com;www.sina.com(域名之间用逗号)  checkDomain
                	var regex=/^(?=^.{1,255}$)((([a-zA-Z_0-9\-\?][-a-zA-Z_0-9\-\?]{0,62})|\*)(\.[a-zA-Z_0-9\-\?][-a-zA-Z_0-9\-\?]{0,62})*){0,1}[\.]{0,1}$/;
                	if(value!=null&&value!=""){
                		if(value.indexOf(";") != -1){//含有";"
                			for(var i=0;i<value.split(";").length;i++){
                				var val=value.split(";")[i];
            					if(!regex.test(val)){
            						$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipDomainName");
                					return false;
                				}
                			}
                		}else{
        					if(!regex.test(value)){
        						$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipDomainName");
            					return false;
            				}
                		}
                	}else{
                		$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipDomainName");
                		return false
                	}
                }else if(param==21){//10.21.17.0/24 10.10.10.10;10.21.18.0/24 10.10.10.10
                   if(value!=null&&value!=""){
                		if(value.indexOf(";") != -1){
                			for (var i = 0; i < value.split(";").length; i++) {
                				if(value.split(";")[i].indexOf(" ") != -1){
                					if(value.split(";")[i].split(" ").length>2){
                						$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                    					return false
                					}
                					var val=value.split(";")[i].split(" ")[0];
                					var val1=value.split(";")[i].split(" ")[1];
                					if(val.indexOf("/") != -1){
                    					if(val.split("/").length>2){
                    						$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                        					return false
                        				}
                    					if(!checkIP46(val.split("/")[0])){
                    						$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
    	                					return false
    	                				}
    	                				if(!validip(val, 3)){
    	                					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
    	                					return false
    	                				}
                    				}else{
                    					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                    					return false
                    				}
                					
                					if(!checkIP(val1)){//路由ip
                						$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                        				return false
                					}
                				}else{
                					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                					return false
                				}
							}
                		}else{
                			if(value.indexOf(" ") != -1){
                				if(value.split(" ").length>2){
            						$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                					return false
            					}
                				var val=value.split(" ")[0];
                				var val1=value.split(" ")[1];
                				if(val!=null&&val!=""&&val1!=null&&val1!=""){
                					if(val.indexOf("/") != -1){
                        				if(val.split("/").length>2){
                        					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                        					return false
                        				}
        	                			if(!checkIP46(val.split("/")[0])){
        	                				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
        	            					return false
        	            				}
        	                			if(!validip(val, 3)){
        	                				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
        	            					return false
        	            				}
                        			}else{
                        				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                        				return false
                        			}
                					if(!checkIP(val1)){//路由ip
                						$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                        				return false
                					}
                				}else{
                					$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                    				return false
                				}
                			}else{
                				$.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
                				return false
                			}
                		}
             	   }else{
             		  $.validator.messages.checkOption=getI18nMessage("lang_key.csmf.jqueryvalidate.tipIpSegmentArray");
             		   return false
             	   }
                }
                 return true
             },
             checkDataType:function(value, element, param) {
            	 if(value==""&&param!='n'){
            		 $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.notNullMsg");
         			 return false;
            	 }
                 if(param=='i'){//整数
                    if(/^((-\d+)|(0+))$/.test(value)){//负数
               		  if(Math.abs(value)>2147483648){
               			   $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectInteger");
               			   return false;
               		  }
                    }else if(/^\d+$/.test(value)){//正数
                   	  if(value>2147483647){
                   		   $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectInteger");
                   		   return false;
              		  }
                    }else{
                    	$.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectInteger");
                    	return false;
                    }
                 }else if(param=='u'){//无符合型
              	  
                 }else if(param=='c'){//Counter32
                	 if(/^\d+$/.test(value)){
                		 if(value>4294967295||value<0){
                			 $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectIntegerRange");
                			 return false; 
                		 }
                 	 }else{
                 		 $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectIntegerRange");
            			 return false;  
                 	 }
                 }else if(param=='s'){//字符串
                	 if(value.length>255){
                  		 $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterStringLenthLessThan255");
                  		  return false
                  	  } 
                 }else if(param=='x'){//16进制字符串
                	 
                 }else if(param=='d'){//10进制字符串
                	 
                 }else if(param=='n'){//空对象
                	 if(value!=null&&value!="null"){
                		 $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterNull");
                 		  return false
                	 }
                 }else if(param=='o'){//对象ID
                	 if(value.indexOf(".")==0){
                		 if(value.split(".").length<4){
                			 $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterOIDType");
                			 return false 
                		 }
                		 for (var i = 1; i < value.split(".").length; i++) {
							if(!/^\d+$/.test(value.split(".")[i])){
								$.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterOIDType");
		                		return false 
							}
						 }
                	 }else{
                		 $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterOIDType");
                		  return false 
                	 }
                 }else if(param=='t'){//计时器
                	 if(!/^\d+$/.test(value)){
                		 $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectTime");
                     	 return false; 
                	 }
                 }else if(param=='a'){//IP地址
	            	 if(!checkIP46(value)){
	            		  $.validator.messages.checkDataType=getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectIpMsg");
	            		  return false;
	            	 }
                 }else if(param=='b'){//比特
                	 
                 }
                 return true;
              },
             maxValue:function(value, element, param) {
            	if(/^\d+$/.test(value)){
            		if(parseInt(value)>parseInt(param)){
            			$.validator.messages.maxValue=getI18nMessage("lang_key.csmf.jqueryvalidate.enterIntegerSmallThan").replace("{param}",param);
            			return false
            		}
            	}else{
            		$.validator.messages.maxValue=getI18nMessage("lang_key.csmf.jqueryvalidate.enterIntegerSmallThan").replace("{param}",param);
            		return false
            	}
            	 return true
             },
            // http://docs.jquery.com/Plugins/Validation/Methods/minlength
            minlength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length >= param;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/maxlength
            maxlength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || length <= param;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/rangelength
            rangelength: function(value, element, param) {
                var length = $.isArray(value) ? value.length : this.getLength($.trim(value), element);
                return this.optional(element) || (length >= param[0] && length <= param[1]);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/min
            min: function(value, element, param) {
                return this.optional(element) || value >= param;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/max
            max: function(value, element, param) {
                return this.optional(element) || value <= param;
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/range
            range: function(value, element, param) {
                return this.optional(element) || (value >= param[0] && value <= param[1]);
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/equalTo
            equalTo: function(value, element, param) {
                // bind to the blur event of the target in order to revalidate whenever the target field is updated
                // TODO find a way to bind the event just once, avoiding the unbind-rebind overhead
                var target = $(param);
                if (this.settings.onfocusout) {
                    target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                        $(element).valid();
                    });
                }
                return value === target.val();
            },

            // http://docs.jquery.com/Plugins/Validation/Methods/remote
            remote: function(value, element, param) {
                if (this.optional(element)) {
                    return "dependency-mismatch";
                }

                var previous = this.previousValue(element);
                if (!this.settings.messages[element.name]) {
                    this.settings.messages[element.name] = {};
                }
                previous.originalMessage = this.settings.messages[element.name].remote;
                this.settings.messages[element.name].remote = previous.message;

                param = typeof param === "string" && {
                    url: param
                } || param;

                if (previous.old === value) {
                    return previous.valid;
                }

                previous.old = value;
                var validator = this;
                this.startRequest(element);
                var data = {};
                data[element.name] = value;
                $.ajax($.extend(true, {
                    url: param,
                    mode: "abort",
                    port: "validate" + element.name,
                    dataType: "json",
                    data: data,
                    success: function(response) {
                        validator.settings.messages[element.name].remote = previous.originalMessage;
                        var valid = response === true || response === "true";
                        if (valid) {
                            var submitted = validator.formSubmitted;
                            validator.prepareElement(element);
                            validator.formSubmitted = submitted;
                            validator.successList.push(element);
                            delete validator.invalid[element.name];
                            validator.showErrors();
                        } else {
                            var errors = {};
                            var message = response || validator.defaultMessage(element, "remote");
                            errors[element.name] = previous.message = $.isFunction(message) ? message(value) : message;
                            validator.invalid[element.name] = true;
                            validator.showErrors(errors);
                        }
                        previous.valid = valid;
                        validator.stopRequest(element, valid);
                    }
                }, param));
                return "pending";
            }

        }

    });

    function validspace(value) {
        if (value.substring(0, 1) == ' ' || value.substring(value.length - 1, value.length) == ' ') {
            return false;
        }
        return true;
    }

    function checkIP(value)
    {
    	var result1 = validip(value, 4);
    	var result2 = isIPv6(value);
    	var result3 = valid(value);
    	if(result1 ==true || result2==true || result3 ==true)
    	{
    		return true;
    	}
    	else
    	{
    		return false;
    	}
    }
    
    function checkIP46(value)
    {
        var result1 = /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(value);
    	var result2 = isIPv6(value);
    	if(result1 ==true || result2==true)
    	{
    		return true;
    	}
    	else
    	{
    		return false;
    	}
    }
   
    function isIPv6(str)
    {
      return /:/.test(str)
        &&str.match(/:/g).length<8
        &&/::/.test(str)
          ?(str.match(/::/g).length==1
            &&/^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(str))
          :/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);
    } 

    function valid(value){
    	var ipsegment = value;
        var value;
        var subnetip_str = "";
        var mask_int = "";
        if(ipsegment.indexOf("/")!= -1)
        {
        	subnetip_str = ipsegment.substring(0, ipsegment.indexOf("/"));
        	mask_int = ipsegment.substring(ipsegment.indexOf("/")+1, ipsegment.length);
        }
        else
        {
        	subnetip_str = ipsegment;
        }
        
        // 校验IP地址格式是否正确
        if(!(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(subnetip_str)) && (!isIPv6(subnetip_str)))
        {
            //alert('请填写合法的IP地址或地址段');
            $('#ip').focus();
            return false;
        }
        
        // 若为IPv6地址
        if(isIPv6(subnetip_str))
        {
        	// 若为IP地址段
            if(mask_int!="")
            {
    	      	if((!(/^\d+$/.test(mask_int))) || (parseInt(mask_int)<1) || (parseInt(mask_int)>127) || (mask_int.indexOf('.') != -1)){
    	        	//alert('请填写合法的IP地址或地址段');
    	            $('#ip').focus();
    	            return false;
    	    	}
    	     }
        }
        return true;
    }    
    function validip(ip, count) {
        var limitcount = 1;
        var message = '';
        if (ip.indexOf("/") != -1) {
            var checkip = /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(ip.split("/")[0]);
            var checkdo = /^[0-9]+$/.test(ip.split("/")[1]);
            if ((!checkip || !checkdo) && count != 3) {
                return false;
            } 
            else if((!checkip || !checkdo) && count == 4)
            {
            	return false;
            }
            else if (ip.substring(ip.length - 3, ip.length).indexOf("/31") != -1) {
                return true;
                limitcount = 2;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/30") != -1) {
                return true;
                limitcount = 2;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/29") != -1) {
                return true;
                limitcount = 6;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/28") != -1) {
                return true;
                limitcount = 14;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/27") != -1) {
                return true;
                limitcount = 30;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/26") != -1) {
                return true;
                limitcount = 62;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/25") != -1) {
                limitcount = 126;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/24") != -1) {
                return true;
                limitcount = 254;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/23") != -1) {
                return true;
                limitcount = 510;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/22") != -1) {
                return true;
                limitcount = 1022;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/21") != -1) {
                limitcount = 2046;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/20") != -1) {
                return true;
                limitcount = 4094;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/19") != -1) {
                return true;
                limitcount = 8190;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/18") != -1) {
                return true;
                limitcount = 16382;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/17") != -1) {
                return true;
                limitcount = 32766;
            } else if (ip.substring(ip.length - 3, ip.length).indexOf("/16") != -1) {
                return true;
                limitcount = 65534;
            } else {
                if (count == 3 || count == 4) {
                    if (ip.substring(ip.length - 3, ip.length).indexOf("/15") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 3, ip.length).indexOf("/14") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 3, ip.length).indexOf("/13") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 3, ip.length).indexOf("/12") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 3, ip.length).indexOf("/11") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 3, ip.length).indexOf("/10") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/9") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/8") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/7") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/6") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/5") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/4") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/3") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/2") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/1") != -1) {
                        return true;
                    } else if (ip.substring(ip.length - 2, ip.length).indexOf("/0") != -1) {
                        return true;
                    } else {
                        var chk = /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(ip.split("/")[1]);
                        if (chk) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                    message = getI18nMessage("lang_key.csmf.jqueryvalidate.ipNumToMuchError");
                }
            }
        } else if (ip.indexOf("-") != -1 && (count == 2 || count == 3)) {
            var ip1 = /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(ip.split("-")[0]);
            var ip2 = /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(ip.split("-")[1]);
            if (!ip1 || !ip2) {
                return false;
            }
            var IPArray1 = ip.split("-")[0].split(".");
            var IPArray2 = ip.split("-")[1].split(".");
            if (IPArray1[0] != IPArray2[0]) {
                return false;
                message = getI18nMessage("lang_key.csmf.jqueryvalidate.ipNumToMuchError");
            } else {
                var num = 0;
                var iplimit = 200000;
                if (IPArray2[3] >= IPArray1[3]) {
                    num = (IPArray2[1] - IPArray1[1]) * 65536 + (IPArray2[2] - IPArray1[2]) * 256 + (IPArray2[3] - IPArray1[3] + 1);
                } else {
                    num = (IPArray2[1] - IPArray1[1]) * 65536 + (IPArray2[2] - IPArray1[2]) * 256 + (IPArray2[3] - IPArray1[3] - 1);
                }
                if (num < 0) {
                    return false;
                    message = getI18nMessage("lang_key.csmf.jqueryvalidate.ipFormatError");
                } else if (num > iplimit) {
                    return false;
                    message = getI18nMessage("lang_key.csmf.jqueryvalidate.ipNumToMuchError");
                } else {
                    limitcount = num;
                    return true;
                }
            }
            return true;
        } else if (ip.indexOf(";") != -1 && count != 1) {
            if (ip == '' || ip == null) {
                return true;
            }
            var ipArr = ip.split(";");
            for (var i = 0; i < ipArr.length; i++) {
                if (!/^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(ipArr[i])) {
                    return false;
                }
            }
            return true;
        } else {
            var result = /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(ip);
            if (!result) {
                return false;
            }
        }
        return true;
    }

    function validateBigger(element) {
        var num1 = element.parentElement.firstChild.value || 0;
        var num2 = element.value || 0;
        var g = /^[1-9]*[1-9][0-9]*$/;
        
        if (isNaN(num1) || isNaN(num2) || (!!num1 & !num2)) {
            $.validator.messages.checkBigger = getI18nMessage("lang_key.csmf.jqueryvalidate.enterDigits");
            return false;
        }
        if (!!num1 && parseInt(num2, 10) <= parseInt(num1, 10)) {
            $.validator.messages.checkBigger = getI18nMessage("lang_key.csmf.jqueryvalidate.latterDigtisBigger");
            return false;
        }
        if(!g.test(num1))
        {
        	$.validator.messages.checkBigger = getI18nMessage("lang_key.csmf.jqueryvalidate.firstFormatError");
            return false;
        }
        if(!g.test(num2))
        {
        	$.validator.messages.checkBigger = getI18nMessage("lang_key.csmf.jqueryvalidate.secondFormatError");
            return false;
        }
        return true;
    }


    // deprecated, use $.validator.format instead
    $.format = $.validator.format;

}(jQuery));

// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
(function($) {
    var pendingRequests = {};
    // Use a prefilter if available (1.5+)
    if ($.ajaxPrefilter) {
        $.ajaxPrefilter(function(settings, _, xhr) {
            var port = settings.port;
            if (settings.mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = xhr;
            }
        });
    } else {
        // Proxy ajax
        var ajax = $.ajax;
        $.ajax = function(settings) {
            var mode = ("mode" in settings ? settings : $.ajaxSettings).mode,
                port = ("port" in settings ? settings : $.ajaxSettings).port;
            if (mode === "abort") {
                if (pendingRequests[port]) {
                    pendingRequests[port].abort();
                }
                pendingRequests[port] = ajax.apply(this, arguments);
                return pendingRequests[port];
            }
            return ajax.apply(this, arguments);
        };
    }
}(jQuery));

// provides delegate(type: String, delegate: Selector, handler: Callback) plugin for easier event delegation
// handler is only called when $(event.target).is(delegate), in the scope of the jquery-object for event.target
(function($) {
    $.extend($.fn, {
        validateDelegate: function(delegate, type, handler) {
            return this.bind(type, function(event) {
                var target = $(event.target);
                if (target.is(delegate)) {
                    return handler.apply(target, arguments);
                }
            });
        }
    });
}(jQuery));



function checkValue579(value,plus){
	 if(/^\d+$/.test(value)){
		   if(value<0||value>plus){
			  return false;
		   }
	 }else{
		   return false;
	 }
	 return  true;
}
function checkValue6810(value,plus,negative){
	 if(/^((-\d+)|(0+))$/.test(value)){
		   if(Math.abs(value)>negative){
			  return false;
		   }
	 }else if(/^\d+$/.test(value)){
		  if(value>plus){
			  return false;
		   }
	 }else{
		  return false;
	 }
	 return  true;
}

function checkValuePlus(value,plus){
  if(value!=null&&value!=""){
	  if(value.indexOf(";") != -1){//数组
   		  for(var i=0;i<value.split(";").length;i++){
   			 if(/^\d+$/.test(value.split(";")[i])){
        		  if(value.split(";")[i]<0||value.split(";")[i]>plus){
        			  return false;
        		  }
             }else{
            	return false;
             }
   		  }
      }else{//单个数
	    	if(/^\d+$/.test(value)){
	 		     if(value<0||value>plus){
	 			   return false;
	 		     }
	        }else{
	        	 return false;
	        }
      }
  }else{
        return false;
  }
  return  true;
}

function checkValueNegative(value,plus,negative){
	if(value!=null&&value!=""){
		if(value.indexOf(";") != -1){//数组
   		  for(var i=0;i<value.split(";").length;i++){
   			 if(/^((-\d+)|(0+))$/.test(value.split(";")[i])){//负数
        		  if(Math.abs(value.split(";")[i])>negative){
        			   return false;
        		  }
             }else if(/^\d+$/.test(value.split(";")[i])){//正数
            	  if(value.split(";")[i]>plus){
            		   return false;
       		      }
             }else{
            	return false;
             }
       	  }
    	}else{//单个数
    		if(/^((-\d+)|(0+))$/.test(value)){//负数
      		  if(Math.abs(value)>negative){
      			   return false;
      		  }
           	}else if(/^\d+$/.test(value)){//正数
           		  if(value>plus){
           			  return false;
      		      }
           	}else{
           		  return false;
           	}
         }
    }else{
    	 return false;
    }
	 return  true;
}
