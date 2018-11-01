package com.carson.firewall.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2018/10/24.
 */
@Entity
public class Port {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid")
    @Column(name="port_id")
    String id;
    String port;
    String name;
    String comment;
    @Temporal(TemporalType.TIMESTAMP)
    Date createTime;
    @Temporal(TemporalType.TIMESTAMP)
    Date updateTime;
    //多对多映射
    @ManyToMany(mappedBy = "targetPorts")
    @JsonIgnore
    List<Strategy> targetStrategies=new ArrayList<>();

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public List<Strategy> getTargetStrategies() {
        return targetStrategies;
    }

    public void setTargetStrategies(List<Strategy> targetStrategies) {
        this.targetStrategies = targetStrategies;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    @Override
    public String toString() {
        return "Port{" +
                "id='" + id + '\'' +
                ", port=" + port +
                ", name='" + name + '\'' +
                ", comment='" + comment + '\'' +

                '}';
    }
}
