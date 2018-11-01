package com.carson.firewall.repo;


import com.carson.firewall.pojo.User;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2018/9/28.
 */
public interface UserRepo extends CrudRepository<User,String> {
    User findOneByName(String name);
    User findOneByNameAndPassword(String name, String password);

}
