package com.carson.firewall.controller;

import com.alibaba.fastjson.JSON;

import com.carson.firewall.Annotation.Permission;
import com.carson.firewall.pojo.IP;
import com.carson.firewall.pojo.IPClass;
import com.carson.firewall.repo.IPRepo;
import com.carson.firewall.repo.IPSetRepo;
import com.carson.firewall.repo.PortRepo;
import com.carson.firewall.repo.StrategyRepo;
import com.carson.firewall.util.IPUtil;
import jxl.Sheet;
import jxl.Workbook;
import jxl.read.biff.BiffException;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;
import org.apache.commons.collections4.IterableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;

/**
 * Created by Administrator on 2018/10/24.
 */
@RestController
@RequestMapping("/ip")
public class IPController {
    @Autowired
    IPRepo ipRepo;
    @Autowired
    IPSetRepo ipSetRepo;
    @Autowired
    PortRepo portRepo;
    @Autowired
    StrategyRepo strategyRepo;
    Map<String,Object> result=new HashMap<>();

    @RequestMapping("/list")
    public Map<String,Object> list(HttpServletRequest request){
        result.clear();
        Iterable<IP> all = ipRepo.findAll();
        List<IP> rows = IterableUtils.toList(all);
        result.put("count", rows.size());
        result.put("rows",rows);
        result.put("success",true);
        return result;
    }
    @RequestMapping("/save")

    public Map<String,Object> save(String data,
                                   @RequestParam(required = false)String ipClassName,
                                   HttpServletRequest request){
        result.clear();
        System.out.println(data);
        IP ip = JSON.parseObject(data, IP.class);
        List<IP> ipList=new ArrayList<>();

        if(ip.getIpAddress().contains(",")){
            String[] ips=ip.getIpAddress().split(",");
            for(String ipRange:ips){
                if(ipRange.contains("-")){
                    String ipStart=ipRange.split("-")[0];
                    String ipEnd=ipRange.split("-")[1];
                    IP ip1=new IP();
                    ip1.setCreateTime(new Date());
                    ip1.setUpdateTime(new Date());
                    ip1.setType("Multi");
                    ip1.setName(ip.getName());
                    ip1.setDepartment(ip.getDepartment());
                    ip1.setComment(ip.getComment());
                    ip1.setIpAddressStart(ipStart);
                    ip1.setIpAddressEnd(ipEnd);
                    ip1.setIpAddress(ipStart + "-" + ipEnd);
                    List<String> ipRanges = IPUtil.parseIpRange(ipStart, ipEnd);
                    ip1.setIpRange(ipRanges.toArray(new String[]{}));
                    ip1=ipRepo.save(ip1);
                    ipList.add(ip1);
                }else {
                    IP ip1=new IP();
                    ip1.setCreateTime(new Date());
                    ip1.setUpdateTime(new Date());
                    ip1.setType("Single");
                    ip1.setName(ip.getName());
                    ip1.setDepartment(ip.getDepartment());
                    ip1.setComment(ip.getComment());
                    ip1.setIpAddress(ipRange);
                    ip1.setIpRange(new String[]{ipRange});
                    ip1=ipRepo.save(ip1);
                    ipList.add(ip1);
                }
            }
        }else {
            if(ip.getType()!=null&&ip.getType().equals("Multi")){
                //加入ip段
                List<String> ips = IPUtil.parseIpRange(ip.getIpAddressStart(), ip.getIpAddressEnd());
                ip.setIpRange(ips.toArray(new String[ips.size()]));




            }
            if(ip.getCreateTime()==null){
                ip.setCreateTime(new Date());
            }
            ip.setUpdateTime(new Date());
            ip=ipRepo.save(ip);
            ipList.add(ip);
        }
        if(ipClassName!=null&&!ipClassName.equals("")){
            IPClass ipClass=new IPClass();
            ipClass.setComment(ip.getComment());
            ipClass.setName(ipClassName);
            ipClass.setDepartment(ip.getDepartment());
            ipClass.setIps(ipList);
            ipSetRepo.save(ipClass);
        }
        result.put("success",true);
        return result;
    }
    @RequestMapping("/delete")
    public Map<String,Object> delete(String uuid,HttpServletRequest request){
        result.clear();
        Object object=null;
        if(uuid!=null&&!uuid.equals("")){
            object=ipRepo.findById(uuid).get();
        }
        if(object!=null){
            ipRepo.delete((IP)object);
            result.put("success",true);
        }else {
            result.put("message","not exist");
            result.put("success",false);
        }

        return result;
    }
    @RequestMapping("/download")
     public Map<String,Object> download(String[] ids,HttpServletRequest request ){
        result.clear();
        ArrayList<IP> ips = new ArrayList<IP>();
        for(String id:ids){
            IP ip = ipRepo.findById(id).get();
            ips.add(ip);
        }
        try {
            WritableWorkbook workbook = Workbook.createWorkbook(new File("c:/website/firewall/temp/data.xls"));
            WritableSheet sheet = workbook.createSheet("data", 0);
            Field[] declaredFields = IP.class.getDeclaredFields();
            for(int i=0;i<declaredFields.length;i++){
                sheet.addCell(new Label(i,0,declaredFields[i].getName()));
            }
            for(int row=1;row<=ips.size();row++){
                for(int col=0;col<declaredFields.length;col++){
                    declaredFields[col].setAccessible(true);
                    Object o = declaredFields[col].get(ips.get(row - 1));
                    if(o!=null)
                        sheet.addCell(new Label(col,row, o .toString()));
                }
            }
            workbook.write();
            workbook.close();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (RowsExceededException e) {
            e.printStackTrace();
        } catch (WriteException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        }


        return result;
    }

    @RequestMapping(value="/upload",method= RequestMethod.POST)
    public Map<String,Object> testUploadFile(MultipartHttpServletRequest multiReq,HttpServletRequest request) {
        result.clear();
        result.put("success",true);
        try{
            FileOutputStream fos=new FileOutputStream(new File("ip.xls"));
            FileInputStream fs=(FileInputStream) multiReq.getFile("file").getInputStream();
            byte[] buffer=new byte[1024];
            int len=0;
            while((len=fs.read(buffer))!=-1){
                fos.write(buffer, 0, len);
            }
            fos.close();
            fs.close();
        }catch (Exception e){
            result.put("success",false);
            result.put("message",e.getMessage());
            e.printStackTrace();
        }

        try {
            Workbook workbook = Workbook.getWorkbook(new File("ip.xls"));
            Sheet sheet = workbook.getSheet(0);
            Field[] declaredFields = IP.class.getDeclaredFields();
            int row=sheet.getRows();
            int col=sheet.getColumns();
            for(int i=1;i<row;i++){
                IP ip=new IP();
                for(int j=0;j<col;j++){
                    String contents = sheet.getCell(j, i).getContents();
                    if(contents!=null&&!contents.equals("")){
                        declaredFields[j].setAccessible(true);
                        declaredFields[j].set(ip,contents);
                    }

                }
                System.out.println(ip);
                save(JSON.toJSONString(ip),null,request);
            }
            workbook.close();
        } catch (BiffException e) {
            result.put("success",false);
            result.put("message",e.getMessage());
            e.printStackTrace();
        } catch (IOException e) {
            result.put("success",false);
            result.put("message",e.getMessage());
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            result.put("success",false);
            result.put("message",e.getMessage());
            e.printStackTrace();
        }
        return result;
    }

}
