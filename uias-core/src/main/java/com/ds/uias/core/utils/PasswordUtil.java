package com.ds.uias.core.utils;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;

import java.util.Map;

/**
 * @author : dongsheng
 * @version : V1.0
 * @description : TODO
 * @date : 2020/10/29 9:23
 */
public class PasswordUtil {

    private static Logger logger = LoggerFactory.getLogger(PasswordUtil.class);

    private static final ObjectMapper objectMapper = new ObjectMapper();

    public static Map<String, String> parsePayload(String payload, String salt) {
        if (StringUtils.isEmpty(payload)) {
            return null;
        }

        StringBuilder param = new StringBuilder();
        try {
            if (!StringUtils.isEmpty(payload)) {
                //将前端分段加密的数据分段解密出来
                for (int i = 0; i < payload.length(); i += 256) {
                    int j = i + 256;
                    if (j < payload.length()) {
                        param.append(RSAUtils.decodePassword(salt, payload.substring(i, j)));
                    } else {
                        param.append(RSAUtils.decodePassword(salt, payload.substring(i, payload.length())));
                    }
                }
                return objectMapper.readValue(param.toString(), new TypeReference<Map<String, String>>() {
                });
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
        return null;
    }
}
