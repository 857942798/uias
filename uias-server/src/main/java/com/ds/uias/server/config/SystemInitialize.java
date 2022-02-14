package com.ds.uias.server.config;

import com.ds.uias.core.config.SSOConfig;
import com.ds.uias.server.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * @author: dongsheng
 * @CreateTime: 2021/1/12
 * @Description:
 */
@Component
public class SystemInitialize implements ApplicationRunner {
    @Autowired
    private RedisUtil redisUtil;
//    @Autowired
//    private SubSystemInfoMapper subSystemInfoMapper;
    @Value("${subsystem1.code}")
    private String subsystem1_code;
    @Value("${subsystem1.url}")
    private String subsystem1_url;
    @Value("${subsystem2.code}")
    private String subsystem2_code;
    @Value("${subsystem2.url}")
    private String subsystem2_url;

    @Override
    public void run(ApplicationArguments args) throws Exception {
//        // 查询数据库，将子系统信息保存到redis,以hash存储
//        List<Map<String,Object>> mapInfos=subSystemInfoMapper.getSubSystemInfo();
//        for (Map<String,Object> sysInfo:mapInfos){
//            Map<String, Object> map=new HashMap<>();
//            map.put("url",sysInfo.get("url"));
//            map.put("code",sysInfo.get(SSOConfig.SUB_SYSTEM_CODE));
//            String subsys= SSOConfig.SUB_SYSTEM_INFO_PREFIX+sysInfo.get(SSOConfig.SUB_SYSTEM_CODE);
//            redisUtil.hPutAll(subsys,map);
//        }
        Map<String, Object> map1=new HashMap<>();
        map1.put("url",subsystem1_url);
        map1.put("code",subsystem1_code);
        String subsys1= SSOConfig.SUB_SYSTEM_INFO_PREFIX+subsystem1_code;
        redisUtil.hPutAll(subsys1,map1);
        Map<String, Object> map2=new HashMap<>();
        map2.put("url",subsystem2_url);
        map2.put("code",subsystem2_code);
        String subsys2= SSOConfig.SUB_SYSTEM_INFO_PREFIX+subsystem2_code;
        redisUtil.hPutAll(subsys2,map2);
    }
}
