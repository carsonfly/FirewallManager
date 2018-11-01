package com.carson.firewall.controller;

import com.alibaba.fastjson.JSON;

import com.carson.firewall.Annotation.Permission;
import com.carson.firewall.pojo.User;
import com.carson.firewall.repo.*;
import org.apache.commons.collections4.IterableUtils;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2018/10/24.
 */
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    IPRepo ipRepo;
    @Autowired
    IPSetRepo ipSetRepo;
    @Autowired
    PortRepo portRepo;
    @Autowired
    StrategyRepo strategyRepo;
    @Autowired
    UserRepo userRepo;
    Map<String,Object> result=new HashMap<>();
    @RequestMapping("/list")
    public Map<String,Object> list(HttpServletRequest request){
        result.clear();

        Iterable<User> all = userRepo.findAll();
        List<User> rows = IterableUtils.toList(all);
        result.put("count", rows.size());
        result.put("rows",rows);
        result.put("success",true);
        return result;
    }
    @RequestMapping("/save")
    public Map<String,Object> save(String data,HttpServletRequest request){
        result.clear();


        System.out.println(data);
        User user=JSON.parseObject(data,User.class);
        if(user.getCreateTime()==null){
            user.setCreateTime(new Date());
        }
        user.setUpdateTime(new Date());
        userRepo.save(user);
        result.put("success",true);
        return result;
    }
    @Permission(loginReqired = false)
    @RequestMapping("/login")
    public Map<String,Object> login(String userName,String userPassword,HttpServletRequest request){
        result.clear();

        User user = userRepo.findOneByNameAndPassword(userName, userPassword);
        if(user!=null){
            request.getSession().setAttribute("isLogin", true);
            request.getSession().setAttribute("username",user.getName());
            result.put("success",true);
        }else {
            result.put("success",false);
        }

        return result;
    }
    @Permission(loginReqired = false)
    @RequestMapping("/logout")
    public Map<String,Object> logout(HttpServletRequest request){
        result.clear();
        request.getSession().removeAttribute("username");
        request.getSession().removeAttribute("isLogin");
        result.put("success",true);
        return result;
    }
    @Permission(loginReqired = false)
    @RequestMapping("/isLogin")
    public Map<String,Object> isLogin(HttpServletRequest request){
        result.clear();
        Object isLogin = request.getSession().getAttribute("isLogin");
        result.put("isLogin",isLogin);
        result.put("success",true);
        return result;
    }
    @RequestMapping("/delete")
    public Map<String,Object> delete(String uuid,HttpServletRequest request){
        result.clear();

        Object object=null;
        if(uuid!=null&&!uuid.equals("")){
            object=userRepo.findById(uuid).get();
        }
        if(object!=null){
            userRepo.delete((User)object);
            result.put("success",true);
        }else {
            result.put("message","not exist");
            result.put("success",false);
        }

        return result;
    }



}
