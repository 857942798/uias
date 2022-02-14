package com.ds.uias.server.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Redis工具类
 *
 * @author dongsheng
 * @date 2020-08-11
 */
@Component
public class RedisUtil {
    private Logger log = LoggerFactory.getLogger(this.getClass());
    @Autowired
    private StringRedisTemplate redisTpl; //jdbcTemplate

    /**
     * 功能描述：设置key-value到redis中,并设置过期时间
     * @param key
     * @param value
     * @param time
     * @param timeUnit
     * @return
     */
    public boolean set(String key ,String value,long time,TimeUnit timeUnit){
        try{
            redisTpl.opsForValue().set(key, value,time,timeUnit);
            return true;
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }
    /**
     * 功能描述：通过key获取缓存里面的值
     * @param key
     * @return
     */
    public String get(String key){
        return redisTpl.opsForValue().get(key);
    }

    /**
     * 功能描述：设置某个key过期时间
     * @param key
     * @param time
     * @return
     */
    public boolean expire(String key,long time,TimeUnit timeUnit){
        try {
            if(time>0){
                redisTpl.expire(key, time, timeUnit);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    /**
     * 功能描述：设置某个key过期时间
     * @param key
     * @param time
     * @return
     */
    public boolean expire(String key,long time){
        try {
            if(time>0){
                redisTpl.expire(key, time, TimeUnit.SECONDS);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
    /**
     * 功能描述：根据key 获取过期时间
     * @param key
     * @return
     */
    public long getExpire(String key){
        return redisTpl.getExpire(key,TimeUnit.SECONDS);
    }

    /**
     * 递增
     * @param key 键
     * @return
     */
    public long incr(String key, long delta){
        return redisTpl.opsForValue().increment(key, delta);
    }

    /**
     * 递减
     * @param key 键
     * @param delta 要减少几
     * @return
     */
    public long decr(String key, long delta){
        return redisTpl.opsForValue().increment(key, -delta);
    }

    /**
     * 删除key
     */
    public void delete(String key) {
        redisTpl.delete(key);
    }

    /**
     * 是否存在key
     */
    public boolean hasKey(String key) {
        return Boolean.TRUE.equals(redisTpl.hasKey(key));
    }

    /**
     * 存储在list头部
     */
    public Long lLeftPush(String key, String value) {
        return redisTpl.opsForList().leftPush(key, value);
    }
    /**
     * 获取列表指定范围内的元素
     */
    public List<String> lRange(String key, long start, long end) {
        return redisTpl.opsForList().range(key, start, end);
    }
    /**
     * 获取列表长度
     */
    public Long lSize(String key) {
        return redisTpl.opsForList().size(key);
    }
    /**
     * 获取存储在哈希表中指定字段的值
     */
    public Object hGet(String key, String field) {
        return redisTpl.opsForHash().get(key, field);
    }
    /**
     * 获取所有给定字段的值
     */
    public Map<Object, Object> hEntries(String key) {
        return redisTpl.opsForHash().entries(key);
    }
    /**
     * 将map中的键值添加至指定key中
     */
    public void hPutAll(String key, Map<String, Object> maps) {
        redisTpl.opsForHash().putAll(key, maps);
    }
    /**
     * 给hashMap设置一个键值
     */
    public void hPut(String key, String hashKey, Object value) {
        redisTpl.opsForHash().put(key, hashKey, value);
    }
    /**
     * 仅当hashKey不存在时才设置
     */
    public Boolean hPutIfAbsent(String key, String hashKey, Object value) {
        return redisTpl.opsForHash().putIfAbsent(key, hashKey, value);
    }
}
