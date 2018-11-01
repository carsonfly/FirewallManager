package com.carson.firewall.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by Administrator on 2018/9/28.
 */
@Entity
public class IP {
    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid")
    @Column(name="ip_id")
    String ip_id;
    @Column
    String ipAddress;
    String ipAddressStart;
    String ipAddressEnd;
    String[] ipRange;
    String name;
    String department;
    String comment;
    String type;
    @Temporal(TemporalType.TIMESTAMP)
    Date createTime;
    @Temporal(TemporalType.TIMESTAMP)
    Date updateTime;

    //多对多映射
    @JsonIgnore
    @ManyToMany(mappedBy = "ips")
    List<IPClass> ipClasses=new ArrayList<>();

    //多对多映射
    @JsonIgnore
    @ManyToMany(mappedBy = "sourceIps")
    List<Strategy> sourceStrategies=new ArrayList<>();
    //多对多映射
    @JsonIgnore
    @ManyToMany(mappedBy = "targetIps")
    List<Strategy> targetStrategies=new ArrayList<>();

    @Override
    public String toString() {
        return "IP{" +
                "ip_id='" + ip_id + '\'' +
                ", ipAddress='" + ipAddress + '\'' +
                ", ipAddressStart='" + ipAddressStart + '\'' +
                ", ipAddressEnd='" + ipAddressEnd + '\'' +
                ", name='" + name + '\'' +
                ", department='" + department + '\'' +
                ", comment='" + comment + '\'' +
                ", type='" + type + '\'' +
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

    public String[] getIpRange() {
        return ipRange;
    }

    public void setIpRange(String[] ipRange) {
        this.ipRange = ipRange;
    }

    public String getIpAddressStart() {
        return ipAddressStart;
    }

    public void setIpAddressStart(String ipAddressStart) {
        this.ipAddressStart = ipAddressStart;
    }

    public String getIpAddressEnd() {
        return ipAddressEnd;
    }

    public void setIpAddressEnd(String ipAddressEnd) {
        this.ipAddressEnd = ipAddressEnd;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<Strategy> getSourceStrategies() {
        return sourceStrategies;
    }

    public void setSourceStrategies(List<Strategy> sourceStrategies) {
        this.sourceStrategies = sourceStrategies;
    }

    public List<Strategy> getTargetStrategies() {
        return targetStrategies;
    }

    public void setTargetStrategies(List<Strategy> targetStrategies) {
        this.targetStrategies = targetStrategies;
    }

    public String getIp_id() {
        return ip_id;
    }

    public void setIp_id(String ip_id) {
        this.ip_id = ip_id;
    }

    public List<IPClass> getIpClasses() {
        return ipClasses;
    }

    public void setIpClasses(List<IPClass> ipClasses) {
        this.ipClasses = ipClasses;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }




    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
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
}
