package com.ds.uias.server.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * @author: dongsheng
 * @CreateTime: 2021/1/18
 * @Description:
 */
@Mapper
public interface SubSystemInfoMapper {
    List<Map<String,Object>> getSubSystemInfo();
}
