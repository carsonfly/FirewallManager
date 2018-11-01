package com.carson.firewall.repo;


import com.carson.firewall.pojo.Port;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Administrator on 2018/9/28.
 */
public interface PortRepo extends CrudRepository<Port,String> {
    Port findOneByPort(Integer port);
    Port findOneByName(String name);
    List<Port> findByNameContaining(String name);
}
