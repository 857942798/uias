var el_validate_email = function(value) {
    if(!value) return true;
    return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
}
var el_validate_positiveInteger = function(value) {
    if(!value){
        return true;
    }
    return /^[1-9]\d*$/.test(value);
}

var el_validate_checkUser = function(value) {
    if(!value) return true;
    return /^[a-zA-Z0-9]+$/.test(value);
}

var el_validate_number = function(value) {
    return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
}

var el_validate_password = function(value) {
    $.validator.messages['password'] = getI18nMessage("lang_key.csmf.password.pwdRule");
    if(value.indexOf("+")>=0) {
        return false;
    }
    var testPassword =/^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{8,12}$/;
    return testPassword.test(value);
}

var el_validate_required = function(value){
    return value && $.trim(value).length > 0;
}

var el_validate_range = function(value,param){
    return value && $.trim(value) > param[0] && $.trim(value)<param[1];
}

var el_validate_maxlength = function(value, param){
    return !value || $.trim(value).length <= param;
}

var el_validate_minlength = function(value, param){
    return value && $.trim(value).length >= param;
}

var el_validate_maxValue = function(value, param){
    if(!value) return true;
    if(parseInt(value)>parseInt(param))
    {
        return false;
    }
    return true;
}
var el_validate_precision = function (value) {
    if(!value){
        return true;
    }
    return  /^\d+(\.\d{1,2})?$/.test(value);
}


var el_validate_max = function(value, param){
    if(!value) return true;
    if(parseInt(value)>parseInt(param)){
    	$.validator.messages['max'] =  getI18nMessage("lang_key.csmf.jqueryvalidate.enterIntegerSmallThan").replace("{param}",param);
    	return false;	
    }
    return true;
}

var el_validate_min = function(value, param){
      if(parseInt(value)<parseInt(param)){
    	$.validator.messages['min'] = getI18nMessage("lang_key.csmf.jqueryvalidate.enterIntegerGreaterThan").replace("{param}",param);
    	return false;	
    }
    return true;
}


var el_validate_checkSpace = function(value){
    if(!value) return true;
    if (value.substring(0, 1) == ' ' || value.substring(value.length - 1, value.length) == ' ') {
        return false;
    }
    return true;
}

/**
 * ip不能为0.0.0.0 和 255.255.255.255
 * @param value
 * @returns {boolean}
 */
var el_validate_informalIP = function(value){
    if(value){
        if(value == "0.0.0.0" || value =="255.255.255.255"){
            var key = "informalIP";
            $.validator.messages[key] = getI18nMessage("不合法的IP地址");
            return false;
        }
    }
    return true;
}

var el_validate_checkIPName = function(value){
    if(!value) return true;
    return /^[\w.-]+$/.test(value);
}

var el_validate_UnRegVali  = function(value, param){
    if ('' != param) {
        return !new RegExp(param).test(value);
    }
    return true;
}

var el_validate_regVali  = function(value, param){
    if(!value){
        return true;
    }
    if ('' != param) {
        return new RegExp(param).test(value);
    }
    return true;
}

var el_validate_regVali  = function(value, param){
    if(!value){
        return true;
    }
    if ('' != param) {
        return new RegExp(param).test(value);
    }
    return true;
}

var el_validate_checkMAC  = function(value){
    if(!value) return true;
    //return /^[A-Fa-f0-9]{2}(:[A-Fa-f0-9]{2}){5}$/.test(value)
   return /^[A-Fa-f0-9]{2}(:[A-Fa-f0-9]{2}){5}$/.test(value) || /^[A-Fa-f0-9]{2}(-[A-Fa-f0-9]{2}){5}$/.test(value) || /^[A-Fa-f0-9]{2}([A-Fa-f0-9]{2}){5}$/.test(value);

}

var el_validate_checkIP  = function(value){
    if(!value) return true;
    var key = "checkIP";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.enterCorrectIpMsg");
    return el_validate_validip(value, 2, key);
}

var el_validate_checkIPV4OrIPV6  = function(value){
    if(!value) return true;
    var key = "checkIPV4OrIPV6";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.enterIPV4OrIPV6");
    var regx= /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/;
    if(value.indexOf(";") != -1){
        for(var i=0;i<value.split(";").length;i++){//解析";"
            var ip=value.split(";")[i];
            if(!regx.test(ip)&&!isIPv6(ip)){
                return false;
            }
        }
    }else{
        if(!regx.test(value)&&!isIPv6(value)){
            return false;
        }
    }
    return true;
}

var el_validate_checkIPV46= function(value){
    if(!value) return true;
    var key = "checkIPV46";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.enterIPV4OrIPV6");
     var result1 = /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(value);
    	var result2 = isIPv6(value);
    	if(result1 ==true || result2==true){
    		return true;
    	}else{
    		return false;
    	}
}

var el_validate_checkIPV4OrIPV4Domain = function(value){
    if(!value) return true;
    var key = "checkIPV4OrIPV4Domain";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.disp.enterIPV4OrIPV4Domain");
    var regx= /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/;
    var regx1=/^(?=^.{1,255}$)((([a-zA-Z_0-9\-\?][-a-zA-Z_0-9\-\?]{0,62})|\*)(\.[a-zA-Z_0-9\-\?][-a-zA-Z_0-9\-\?]{0,62})*){0,1}[\.]{0,1}$/;
    if(value.indexOf(";") != -1){
        for(var i=0;i<value.split(";").length;i++){//解析";"
            var ip=value.split(";")[i];
            if(!regx.test(ip)&&!regx1.test(ip)){
                return false;
            }
        }
    }else{
        if(!regx.test(value)&&!regx1.test(value)){
            return false;
        }
    }
    return true;
}

var el_validate_checkDomain = function(value) {
    if(!value) return true;
    var key = "checkDomain";
    $.validator.messages[key] = getI18nMessage("lang_key.DDI.dns.authserverValidate");
    var ipv6Regex=/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
     var domian=/^(?=^.{1,255}$)((([a-zA-Z_0-9\-][-a-zA-Z_0-9\-]{0,62})|\*)(\.[a-zA-Z_0-9\-][-a-zA-Z_0-9\-]{0,62})*){0,1}[\.]{0,1}$/;
    if(!domian.test(value)&&!ipv6Regex.test(value)){
        return  false;
    }
    return true;
}


/**
 * 校验分号分隔的多个域名
 * @param value
 * @returns {boolean}
 */
var el_validate_checkDomains = function(value) {
    if(!value) return true;
    var key = "checkDomains";
    $.validator.messages[key] = getI18nMessage("lang_key.DDI.dns.formatDomainMessage");

    var domains = value.split(";");
    var domainReg=/^(?=^.{1,255}$)((([a-zA-Z_0-9\-\u4e00-\u9fa5][-a-zA-Z_0-9\-\u4e00-\u9fa5]{0,62})|\*)(\.[a-zA-Z_0-9\-\u4e00-\u9fa5][-a-zA-Z_0-9\-\u4e00-\u9fa5]{0,62})*){0,1}[\.]{0,1}$/;
    for (var i = 0; i < domains.length; i++){
        if(!domainReg.test(domains[i])){
            return  false;
        }
    }
    return true;
}

var el_validate_checkDomainName = function(value) {
    if(!value) return true;
    var key = "checkDomainName";
    var domainReg=/^(?=^.{1,255}$)((([a-zA-Z_0-9\-\u4e00-\u9fa5][-a-zA-Z_0-9\-\u4e00-\u9fa5]{0,62})|\*)(\.[a-zA-Z_0-9\-\u4e00-\u9fa5][-a-zA-Z_0-9\-\u4e00-\u9fa5]{0,62})*){0,1}[\.]{0,1}$/;
    if(!domainReg.test(value)){
        return  false;
    }
    return true;
}

// http://docs.jquery.com/Plugins/Validation/Methods/digits
var el_validate_digits =  function(value) {
    if(!value) return true;
    return  /^\d+$/.test(value);
}


var el_validate_checkIPS  = function(value){
    if(!value) return true;
    var key = "checkIPS";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.incorrectIPV4");
    return el_validate_validip(value, 3, key);
}

var el_validate_checkIPAddr  = function(value){
    if(!value) return true;
    var key = "checkIPAddr";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.incorrectIPV4");
    if(value.indexOf(";") != -1) {
        if (value == '' || value == null)
        {
            return true;
        }
        var ipArr = value.split(";");
        for (var i = 0; i < ipArr.length; i++)
        {
            if (!/^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(ipArr[i])) {
                return false;
            }
        }

    }
    else
    {
        if (!/^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(value)) {
            return false;
        }
    }
    return true;
    //return el_validate_validip(value, 3, key);
}

var el_validate_checkIPV4  = function(value){
    if(!value) return true;
    var key = "checkIPV4";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.incorrectIPV4");
    return el_validate_validip(value, 1, key);
}

var el_validate_checkIPV4NoStartAndEnd  = function(value){
    if(!value) return true;
    var key = "checkIPV4NoStartAndEnd";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.incorrectIPV4");
    if(!el_validate_checkIPAddr(value) || value=="0.0.0.0" || value=="255.255.255.255" ){
        return false;
    }
    return true;
}

var el_validate_checkIPV6  = function(value){
    if(!value) return true;
    var key = "checkIPV6";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.incorrectIPV6");
    var ipv6Regex=/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    return  ipv6Regex.test(value);
}

var el_validate_checkIPV4OrcheckIPV6  = function(value){
    if(!value) return true;
    var key = "checkIPV4OrcheckIPV6";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.enterIPV4OrIPV6");
    if(!el_validate_checkIPV4(value)&&!el_validate_checkIPV6(value)){
        return false;
    }
    return true;
}

var el_validate_checkIPV4OrcheckIPV6NoStartAndEnd  = function(value){
    if(!value) return true;
    var key = "checkIPV4OrcheckIPV6NoStartAndEnd";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.enterIPV4OrIPV6");
    if((!el_validate_checkIPV4(value) || value=="0.0.0.0" || value=="255.255.255.255" )
        &&!el_validate_checkIPV6(value)){
        return false;
    }
    return true;
}


var el_validate_checkIPAddrOrIpv6  = function(value){
    if(!value) return true;
    var key = "checkIPAddrOrIpv6";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.enterIPV4OrIPV6");
    if(value.indexOf(";") != -1) {
        var ipArr = value.split(";");
        for (var i = 0; i < ipArr.length; i++)
        {
            if (!/^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(ipArr[i])&&!el_validate_checkIPV6(ipArr[i])) {
                return false;
            }
        }

    }
    else
    {
        if (!/^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/.test(value)&&!el_validate_checkIPV6(value)) {
            return false;
        }
    }
    return true;
    //return el_validate_validip(value, 3, key);
}


var el_validate_checkIPOrIpv6  = function(value){
    if(!value) return true;
    var key = "checkIPOrIpv6";
    $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.enterIPV4OrIPV6");
    var regex = /^([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9][0-9]|1\d\d|2[0-4]\d|25[0-5])$/;
    var ipv6Regex = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/;
    if(value.indexOf("/") != -1){
        var val1 = value.split("/")[0];
        var val2 = value.split("/")[1];
        if (regex.test(val1)) {
            if(!el_validate_validip(value, 2, key)){
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }
    }
    if(value.indexOf(";") != -1) {
        var ipArr = value.split(";");
        for (var i = 0; i < ipArr.length; i++){
            if (!ipv6Regex.test(ipArr[i])&&!regex.test(ipArr[i])) {
                return false;
            }
        }
    }else{
        if (!ipv6Regex.test(value)&&!regex.test(value)) {
            return false;
        }
    }
    return true;
}




var el_validate_checkLinkName=  function(value) {
    if(!value) return true;
    return   /^[a-zA-Z0-9]+$/.test(value);
}

//支持IPV4或者域名格式
var el_validate_checkIPV4OrcheckDomain  = function(value){
    if(!value) return true;
    var key = "checkIPV4OrcheckDomain";
    $.validator.messages[key] = getI18nMessage("SIP服务器格式非法！");
    var regx = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var domian=/^(?=^.{1,255}$)((([a-zA-Z_0-9\-][-a-zA-Z_0-9\-]{0,62})|\*)(\.[a-zA-Z_0-9\-][-a-zA-Z_0-9\-]{0,62})*){0,1}[\.]{0,1}$/;
    if(!regx.test(value)&&!domian.test(value)){
        return false;
    }
    return true;
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

function el_validate_validip(ip, count, key) {
    if(ip =="")
    {
        return true;
    }
    var limitcount = 1;
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
            limitcount = 2;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/30") != -1) {
            limitcount = 2;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/29") != -1) {
            limitcount = 6;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/28") != -1) {
            limitcount = 14;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/27") != -1) {
            limitcount = 30;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/26") != -1) {
            limitcount = 62;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/25") != -1) {
            limitcount = 126;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/24") != -1) {
            limitcount = 254;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/23") != -1) {
            limitcount = 510;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/22") != -1) {
            limitcount = 1022;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/21") != -1) {
            limitcount = 2046;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/20") != -1) {
            limitcount = 4094;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/19") != -1) {
            limitcount = 8190;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/18") != -1) {
            limitcount = 16382;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/17") != -1) {
            limitcount = 32766;
            return true;
        } else if (ip.substring(ip.length - 3, ip.length).indexOf("/16") != -1) {
            limitcount = 65534;
            return true;
        } else {
            if (count == 3 || count == 4 || count == 1) {
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
                $.validator.messages[key] = getI18nMessage("lang_key.csmf.simpletime.ipFormatErrorMsg");
                return false;
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
            $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.ipNumToMuchError");
            return false;
        } else {
            var num = 0;
            var iplimit = 200000;
            if (IPArray2[3] >= IPArray1[3]) {
                num = (IPArray2[1] - IPArray1[1]) * 65536 + (IPArray2[2] - IPArray1[2]) * 256 + (IPArray2[3] - IPArray1[3] + 1);
            } else {
                num = (IPArray2[1] - IPArray1[1]) * 65536 + (IPArray2[2] - IPArray1[2]) * 256 + (IPArray2[3] - IPArray1[3] - 1);
            }
            if (num < 0) {
                $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.standardIPFormat");
                return false;
            } else if (num > iplimit) {
                $.validator.messages[key] = getI18nMessage("lang_key.csmf.jqueryvalidate.ipNumToMuchError");
                return false;
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

//数字范围必填校验
function el_validate_numberrangerequired(value){
    var key = "numberrangerequired";
    if(value instanceof Array && value.length > 1){
        if (typeof(value[0])=="undefined" && typeof(value[1])=="undefined"){
            $.validator.messages[key] = getI18nMessage(getI18nMessage("lang_key.csmf.simpledialog.requiredField"));
            return false;
        }
    }else{
        $.validator.messages[key] = getI18nMessage(getI18nMessage("lang_key.csmf.simpledialog.requiredField"));
        return false;
    }
    return true;
}
