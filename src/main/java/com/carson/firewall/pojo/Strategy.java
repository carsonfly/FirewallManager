package com.carson.firewall.pojo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2018/10/24.
 */
@Entity
public class Strategy {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid")
    @Column(name="strategy_id")
    String id;

    String name;
    String department;
    String comment;
    String type;
    @Temporal(TemporalType.TIMESTAMP)
    Date createTime;
    @Temporal(TemporalType.TIMESTAMP)
    Date updateTime;

    @ManyToMany(targetEntity = IP.class, fetch = FetchType.LAZY)
    @JoinTable(name = "Strategy_Source_IP", joinColumns = @JoinColumn(name = "strategy_id"), inverseJoinColumns = @JoinColumn(name = "ip_id"))
    List<IP> sourceIps=new ArrayList<>();

    @ManyToMany(targetEntity = IP.class, fetch = FetchType.LAZY)
    @JoinTable(name = "Strategy_Target_IP", joinColumns = @JoinColumn(name = "strategy_id"), inverseJoinColumns = @JoinColumn(name = "ip_id"))
    List<IP> targetIps=new ArrayList<>();

    @ManyToMany(targetEntity = IPClass.class, fetch = FetchType.LAZY)
    @JoinTable(name = "Strategy_Source_IPClass", joinColumns = @JoinColumn(name = "strategy_id"), inverseJoinColumns = @JoinColumn(name = "ip_class_id"))
    List<IPClass> sourceIpClasses=new ArrayList<>();

    @ManyToMany(targetEntity = IPClass.class, fetch = FetchType.LAZY)
    @JoinTable(name = "Strategy_Target_IPClass", joinColumns = @JoinColumn(name = "strategy_id"), inverseJoinColumns = @JoinColumn(name = "ip_class_id"))
    List<IPClass> targetIpClasses=new ArrayList<>();

    @ManyToMany(targetEntity = Port.class, fetch = FetchType.LAZY)
    @JoinTable(name = "Strategy_Target_Port", joinColumns = @JoinColumn(name = "strategy_id"), inverseJoinColumns = @JoinColumn(name = "port_id"))
    List<Port> targetPorts=new ArrayList<>();

    @Override
    public String toString() {
        return "Strategy{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", department='" + department + '\'' +
                ", comment='" + comment + '\'' +
                ", type='" + type + '\'' +
                ", sourceIps=" + sourceIps +
                ", targetIps=" + targetIps +
                ", sourceIpClasses=" + sourceIpClasses +
                ", targetIpClasses=" + targetIpClasses +
                ", targetPorts=" + targetPorts +
                '}';
    }

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

    public List<IP> getSourceIps() {
        return sourceIps;
    }

    public void setSourceIps(List<IP> sourceIps) {
        this.sourceIps = sourceIps;
    }

    public List<IP> getTargetIps() {
        return targetIps;
    }

    public void setTargetIps(List<IP> targetIps) {
        this.targetIps = targetIps;
    }

    public List<IPClass> getSourceIpClasses() {
        return sourceIpClasses;
    }

    public void setSourceIpClasses(List<IPClass> sourceIpClasses) {
        this.sourceIpClasses = sourceIpClasses;
    }

    public List<IPClass> getTargetIpClasses() {
        return targetIpClasses;
    }

    public void setTargetIpClasses(List<IPClass> targetIpClasses) {
        this.targetIpClasses = targetIpClasses;
    }

    public List<Port> getTargetPorts() {
        return targetPorts;
    }

    public void setTargetPorts(List<Port> targetPorts) {
        this.targetPorts = targetPorts;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


}
