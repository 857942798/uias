<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>主页</title>
    <script type="text/javascript" src="jquery/jquery-1.10.2.min.js"></script>
    <script type="text/javascript">
            function doLogout(){
                var location = (window.location+'').split('/');
                var basePath = location[0]+'//'+location[2]+'/'+location[3];
                var JsonData = {
                    sso_token:'${sso_token}',
                };
                $.ajax({
                    type:'POST',
                    url:basePath+'/doLogout',
                    data:JsonData,
                    dataType:"json",
                    success:function(data){
                        if(data.code=='0000'){
                            window.location.href = basePath+"/login";
                        }else{
                            alert(data.msg);
                        }
                    }
                })
            }
    </script>
</head>
<body>
<div style="text-align: center;margin-top: 100px;">
    <h1>统一认证中心登录成功。</h1>
    <input type='button' value='用户登出' onclick="doLogout()">
</div>
</body>
</html>