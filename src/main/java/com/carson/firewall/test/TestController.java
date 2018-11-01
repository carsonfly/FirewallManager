package com.carson.firewall.test;

import com.carson.firewall.pojo.User;
import com.carson.firewall.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2018/10/31.
 */
@RestController
@RequestMapping("/test")
public class TestController {
    @Autowired
    UserRepo userRepo;

    Map<String,Object> result=new HashMap<>();
//    @RequestMapping("/addUser")
//    public Map<String,Object> addUser(String name,String password){
//        User user=new User();
//        user.setName(name);
//        user.setPassword(password);
//        user.setType("manager");
//        userRepo.save(user);
//        result.put("success",true);
//        return  result;
//    }
}
