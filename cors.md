## CORS(跨域资源请求)
 对可能对服务器数据产生副作用的http请求方法(特别是get以外的请求)，需要首先使用options方法发出一个预请求(preflight request)，确认服务器是否允许跨域。

 + 简单请求
 请求不会发出CORS预检请求。
 请求首部的origin字段，响应首部Acess-Control-Allow-Origin完成跨域访问控制。

 + 预检请求
使用options方法

预请求(request)携带了下面两个字段：
> Access-Control-Request-Method: POST //实际请求将使用post方法 </br>  
>Access-Control-Request-Headers: X-PINGOTHER

预请求的响应：
>Access-Control-Allow-Origin: http://foo.example</br>
Access-Control-Allow-Methods: POST, GET, OPTIONS  //服务器允许使用的方法</br>
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type</br>
Access-Control-Max-Age: 86400 //该响应的有效时间，在有效时间内浏览器无需为同一请求再次发出预请求

+ 预请求与重定向

大多数浏览器不支持针对于预检请求的重定向。如果一个预检请求发生了重定向，浏览器将报告错误

+ 附带身份凭证的请求
基于Http cookie和Http 认证信息发送身份凭证，一般对于跨域的XMLHttpRequest或Fetch请求是不会发出身份凭证信息。需要发送凭证信息，要设置一个特殊标志位。
标志位 withCredentials 设置为 true，如果服务器端的响应中未携带 Access-Control-Allow-Credentials: true ，浏览器将不会把响应内容返回给请求的发送者。

> 附带身份凭证的请求，服务器不得设置Access-Control-Allow-Origin: *,否则请求将会失败。响应首部中也携带了 Set-Cookie 字段，尝试对 Cookie 进行修改。如果操作失败，将会抛出异常。
