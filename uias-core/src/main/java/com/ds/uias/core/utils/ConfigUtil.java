package com.ds.uias.core.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * @author : dongsheng
 * @version : V1.0
 * @description : TODO
 * @date : 2021/1/10 12:08
 */
public class ConfigUtil {

    public static Properties loadConfig(String appPath, String configPath) {
        if (!appPath.endsWith(File.separator)) {
            appPath = appPath + File.separator;
        }
        FileInputStream in = null;
        try {
            String realFileName = appPath + "WEB-INF/classes/" + configPath;
            realFileName = realFileName.replace("\\", "/");
            Properties properties = new Properties();
            in = new FileInputStream(new File(realFileName));
            properties.load(in);
            return properties;
        }catch (IOException e){
        }finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return null;
    }

    public static boolean isEmpty(CharSequence cs){
        return cs == null || cs.length() == 0 || "null".contentEquals(cs);
    }
}
