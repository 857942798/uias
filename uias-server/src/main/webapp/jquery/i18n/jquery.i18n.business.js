$(function(){
    jQuery.i18n.properties({
        name : '', //资源文件名称
        path : 'i18n/loadPageI18nMsg/', //资源文件路径
        mode : 'map', //用Map的方式使用资源文件中的值
        cache:true,
        language : getLocalLang(),
        callback: function () {//加载成功后设置显示内容
        	setJqueryI18Message();
        }
    });
});

function setJqueryI18Message(){
    try {
        //placeholder属性
        $('[data-i18n-placeholder]').each(function () {
        	if($.i18n.map.hasOwnProperty($(this).data('i18n-placeholder'))){
        		$(this).attr('placeholder', $.i18n.prop($(this).data('i18n-placeholder')));
        	}else{
        		$(this).attr('placeholder', $(this).data('i18n-placeholder'));
        		console.log("No such key:"+$(this).data('i18n-placeholder'));
        	}
        });
        
        //HTML
        $('[data-i18n-text]').each(function () {
            //如果text里面还有html需要过滤掉
            var html = $(this).html();
            var reg = /<(.*)>/;
            if (reg.test(html)) {
                var htmlValue = reg.exec(html)[0];
                if($.i18n.map.hasOwnProperty($(this).data('i18n-text'))){
                	$(this).html(htmlValue + $.i18n.prop($(this).data('i18n-text')));
                }else{
                	$(this).html(htmlValue + $(this).data('i18n-text'));
            		console.log("No such key:"+$(this).data('i18n-text'));
            	}
            }
            else {
            	if($.i18n.map.hasOwnProperty($(this).data('i18n-text'))){
            		$(this).text($.i18n.prop($(this).data('i18n-text')));
            	}else{
            		$(this).html($(this).data('i18n-text'));
            		console.log("No such key:"+$(this).data('i18n-text'));
            	}
            }
        });
        
        //value属性
        $('[data-i18n-value]').each(function () {
        	if($.i18n.map.hasOwnProperty($(this).data('i18n-value'))){
        		$(this).val($.i18n.prop($(this).data('i18n-value')));
        	}else{
        		$(this).val($(this).data('i18n-value'));
        		console.log("No such key:"+$(this).data('i18n-value'));
        	}
        });
        
        //title属性
        $('[data-i18n-title]').each(function () {
        	if($.i18n.map.hasOwnProperty($(this).data('i18n-title'))){
        		$(this).attr('title', $.i18n.prop($(this).data('i18n-title')));
        	}else{
        		$(this).attr('title', $(this).data('i18n-title'));
        		console.log("No such key:"+$(this).data('i18n-title'));
        	}
        });
    }
    catch(ex){ }
}

function setLanguage(language){
	jQuery.i18n.properties({
        name : '', //资源文件名称
        path : 'i18n/loadPageI18nMsg/', //资源文件路径
        mode : 'map', //用Map的方式使用资源文件中的值
        cache:true,
        language : language,
        callback: function () {//加载成功后设置显示内容
        	setJqueryI18Message();
        }
    });
}
