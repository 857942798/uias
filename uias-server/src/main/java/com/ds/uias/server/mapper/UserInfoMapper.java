package com.ds.uias.server.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

/**
 * @author: dongsheng
 * @CreateTime: 2021/1/18
 * @Description:
 */
@Mapper
public interface UserInfoMapper {
    Map<String,Object> getUserByName(String name);
}
