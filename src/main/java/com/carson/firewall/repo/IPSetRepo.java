package com.carson.firewall.repo;


import com.carson.firewall.pojo.IPClass;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Administrator on 2018/9/28.
 */
public interface IPSetRepo extends CrudRepository<IPClass,String> {
    IPClass findOneByName(String name);

}
