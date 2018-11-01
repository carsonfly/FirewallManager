package com.carson.firewall.aspect;

import com.alibaba.fastjson.JSONObject;
import com.carson.firewall.Annotation.Permission;
import com.sun.xml.internal.ws.client.ResponseContextReceiver;
import org.aopalliance.intercept.Joinpoint;
import org.apache.log4j.Logger;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by Administrator on 2018/10/31.
 */
@Component
@Aspect
public class LoginAspect  {

    private Logger log = Logger.getLogger(LoginAspect.class);
    Map<String,Object> result=new HashMap<>();
    @Pointcut("execution(public * com.carson.firewall.controller.*.*(..))")
    public void checkLogin(){

    }
    @Around("checkLogin()") //指定拦截器规则；也可以直接把“execution(* com.xjj.........)”写进这里
    public Object Interceptor(ProceedingJoinPoint pjp){
        long beginTime = System.currentTimeMillis();
        MethodSignature signature = (MethodSignature) pjp.getSignature();
        Method method = signature.getMethod(); //获取被拦截的方法
        String methodName = method.getName(); //获取被拦截的方法名

        Set<Object> allParams = new LinkedHashSet<>(); //保存所有请求参数，用于输出到日志中

        //log.info("请求开始，方法 :"+methodName);
        log.info("方法执行前...");
        ServletRequestAttributes sra=(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        HttpServletRequest request=sra.getRequest();
        log.info("url:"+request.getRequestURI());
        //log.info("ip:"+request.getRemoteHost());
        log.info("method:"+request.getMethod());
//        log.info("class_method:"+joinPoint.getSignature().getDeclaringTypeName()+"."+joinPoint.getSignature().getName());
//        log.info("args:"+joinPoint.getArgs());

        Object res = null;

        Object[] args = pjp.getArgs();
        for(Object arg : args){
            //logger.debug("arg: {}", arg);
            if (arg instanceof Map<?, ?>) {
                //提取方法中的MAP参数，用于记录进日志中
                @SuppressWarnings("unchecked")
                Map<String, Object> map = (Map<String, Object>) arg;

                allParams.add(map);
            }else if(arg instanceof HttpServletRequest) {
                request = (HttpServletRequest) arg;
                if (isLoginRequired(method)) {
                    if (!isLogin(request)) {
                        log.warn("you have not login");
                        result.put("success", false);
                        result.put("message", "you have not login");

                        res = new JSONObject(result);
                    }
                }
            }
        }

        try {
            if(res == null){
                log.info("继续执行被拦截的方法:"+methodName+"\n 参数:"+allParams);
                // 一切正常的情况下，继续执行被拦截的方法
                res = pjp.proceed();
            }
        } catch (Throwable e) {
            log.info("exception: ", e);
            res = new JSONObject(result);
        }

        if(res!=null){
            long costMs = System.currentTimeMillis() - beginTime;
            log.info(methodName+"请求结束，耗时："+costMs);
        }

        return res;
    }

    /**
     * 判断一个方法是否需要登录
     * @param method
     * @return
     */
    private boolean isLoginRequired(Method method){


        boolean result = true;
        if(method.isAnnotationPresent(Permission.class)){
            result = method.getAnnotation(Permission.class).loginReqired();
        }
        if(result)
        {
            log.info(method.getName()+"需要登陆才能执行");
        }
        return result;
    }

    //判断是否已经登录
    private boolean isLogin(HttpServletRequest request) {
        Object isLogin = request.getSession().getAttribute("isLogin");



        if(isLogin!=null){
            log.info("已登陆");
            return true;
        }
        else{
            log.info("未登陆");
            return false;
        }

		/*String token = XWebUtils.getCookieByName(request, WebConstants.CookieName.AdminToken);
		if("1".equals(redisOperator.get(RedisConstants.Prefix.ADMIN_TOKEN+token))){
			return true;
		}else {
			return false;
		}*/
    }


//    @Before("checkLogin()")
//    public void doBefore(JoinPoint joinPoint) {
//        log.info("方法执行前...");
//        ServletRequestAttributes sra=(ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
//        HttpServletRequest request=sra.getRequest();
//        log.info("url:"+request.getRequestURI());
//        log.info("ip:"+request.getRemoteHost());
//        log.info("method:"+request.getMethod());
//        log.info("class_method:"+joinPoint.getSignature().getDeclaringTypeName()+"."+joinPoint.getSignature().getName());
//        log.info("args:"+joinPoint.getArgs());
//    }
//
//    @After("checkLogin()")
//    public void doAfter(JoinPoint joinPoint){
//        log.info("方法执行后...");
//    }
//
//    @AfterReturning(returning="result",pointcut="checkLogin()")
//    public void doAfterReturning(Object result){
//        log.info("执行返回值："+result);
//    }
}
