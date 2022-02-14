<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8" />
    <title>SSO Client-2</title>
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.js"></script>
    <script type="text/javascript">
        function logout() {
            var location = (window.location+'').split('/');
            var basePath = location[0]+'//'+location[2]+'/'+location[3];
            var JsonData = {
                redirect_url: "http://ssoclient1.com:8081/sso-web-sample-1/",
                sub_system_code: "web_1",
            };
            $.ajax({
                type:'POST',
                url:basePath+"/sso/logout",
                data:JsonData,
                dataType:"json",
                xhrFields: {withCredentials:true},	//前端适配：允许session跨域
                crossDomain: true,
                success:function(data){
                    if(data.code=='0000'){
                        window.location.href = "http://ssoclient2.com:8082/sso-web-sample-2/";
                    }else{
                        ErroAlert(data.msg);
                    }
                }
            })
        }
    </script>
</head>
<body>

    <div style="text-align: center;margin-top: 100px;">
        <h1>login success.这是web2</h1>
        <input type='button' value='登出' onclick="logout()">

<#--        <div>点击获取token</div>-->
<#--        <p></p>-->

    </div>
</body>
<#--<script type="text/javascript">-->
<#--        window.addEventListener('message', function(e) {-->
<#--        if (e.source != window.parent)-->
<#--        return;-->
<#--        localStorage.setItem('token','123456');-->
<#--        window.parent.postMessage('finished', '*');-->
<#--    }, false);-->
<#--</script>-->
<#--<script type="text/javascript">-->
<#--    document.querySelector('div').addEventListener('click', function(){-->
<#--        document.querySelector('p').innerHTML = localStorage.getItem('token');-->
<#--    }, false);-->
<#--</script>-->
</html>