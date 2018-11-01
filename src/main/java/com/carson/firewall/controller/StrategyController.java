package com.carson.firewall.controller;

import com.alibaba.fastjson.JSON;

import com.carson.firewall.pojo.Strategy;
import com.carson.firewall.repo.IPRepo;
import com.carson.firewall.repo.IPSetRepo;
import com.carson.firewall.repo.PortRepo;
import com.carson.firewall.repo.StrategyRepo;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;
import org.apache.commons.collections4.IterableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.*;

/**
 * Created by Administrator on 2018/10/24.
 */
@RestController
@RequestMapping("/strategy")
public class StrategyController {
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
        Iterable<Strategy> all = strategyRepo.findAll();
        List<Strategy> rows = IterableUtils.toList(all);
        result.put("count", rows.size());
        result.put("rows",rows);
        result.put("success",true);
        return result;
    }
    @RequestMapping("/save")
    public Map<String,Object> save(String data,HttpServletRequest request){
        result.clear();
        System.out.println(data);
        Strategy strategy=JSON.parseObject(data, Strategy.class);
        if(strategy.getCreateTime()==null){
            strategy.setCreateTime(new Date());
        }
        strategy.setUpdateTime(new Date());
        strategyRepo.save(strategy);
        result.put("success",true);
        return result;
    }
    @RequestMapping("/delete")
    public Map<String,Object> delete(String uuid,HttpServletRequest request){
        result.clear();
        Object object=null;
        if(uuid!=null&&!uuid.equals("")){
            object= strategyRepo.findById(uuid).get();
        }
        if(object!=null){
            strategyRepo.delete((Strategy)object);
            result.put("success",true);
        }else {
            result.put("message","not exist");
            result.put("success",false);
        }

        return result;
    }
    @RequestMapping("/download")
    public Map<String,Object> download(String[] ids ,HttpServletRequest request){
        result.clear();
        ArrayList<Strategy> ips = new ArrayList<>();
        for(String id:ids){
            Strategy strategy = strategyRepo.findById(id).get();
            ips.add(strategy);
        }
        try {
            WritableWorkbook workbook = Workbook.createWorkbook(new File("c:/website/firewall/temp/data.xls"));
            WritableSheet sheet = workbook.createSheet("data", 0);
            Field[] declaredFields = Strategy.class.getDeclaredFields();
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
}
