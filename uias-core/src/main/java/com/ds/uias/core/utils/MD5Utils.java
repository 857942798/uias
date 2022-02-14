package com.ds.uias.core.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class MD5Utils {
	/**
	 * @Author:zzh @Email:zhangzihaopk@foxmail.com  @Time:2016/8/5
	 */
		public static final Logger logger = LoggerFactory.getLogger(MD5Utils.class);
	    static MessageDigest messageDigest = null;

	    /**
	     * 判断新密码和旧密码是否正确  返回true 和 false
	     *
	     * @param newStr
	     * @param oldMD5Str
	     * @return
	     */
	    public final static boolean checkMD5(String newStr, String oldMD5Str) {
	        String temp = encoderByMd5(newStr);
	        return (temp != null && temp.equals(oldMD5Str)) ? true : false;
	    }

	    /**
	     * 对给定的字符串进行加密
	     *
	     * @param source
	     * @return 加密后的16进制的字符串
	     */
	    public final static String encoderByMd5(String source) {
	        String tmp = source.substring(0, 1)
	                + source.subSequence(source.length() - 1, source.length());
	        tmp = md5(tmp);
	        return md5(source + tmp);
	    }

	    public static String md5(String source) {

	        if (logger.isDebugEnabled()) {
	        }
	        char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd',
	                'e', 'f'};
	        try {

	            byte[] strTemp = source.getBytes();
	            // 使用MD5创建MessageDigest对象
	            MessageDigest mdTemp = MessageDigest.getInstance("MD5");
	            mdTemp.update(strTemp);
	            byte[] md = mdTemp.digest();
	            int j = md.length;
	            char str[] = new char[j * 2];
	            int k = 0;
	            for (int i = 0; i < j; i++) {
	                byte b = md[i];
	                str[k++] = hexDigits[b >> 4 & 0xf];
	                str[k++] = hexDigits[b & 0xf];
	            }

	            if (logger.isDebugEnabled()) {
	                logger.debug("after encrypt：" + new String(str));
	            }
	            return new String(str);
	        } catch (Exception e) {
	            logger.error("md5 error：" + source, e);
	            return null;
	        }

	    }


	    public static String encodeByMD5(String str) {
	        try {
	            if (messageDigest == null)
	                messageDigest = MessageDigest.getInstance("MD5");
	            messageDigest.reset();
	            messageDigest.update(str.getBytes("UTF-8"));
	        } catch (NoSuchAlgorithmException e) {
	            logger.error("NoSuchAlgorithmException caught!", e);

	        } catch (UnsupportedEncodingException e) {
	            logger.error("UnsupportedEncodingException error!", e);
	        }
	        if (messageDigest == null)
	            return "";
	        byte[] byteArray = messageDigest.digest();

	        StringBuffer md5StrBuff = new StringBuffer();

	        for (int i = 0; i < byteArray.length; i++) {
	            if (Integer.toHexString(0xFF & byteArray[i]).length() == 1)
	                md5StrBuff.append("0").append(Integer.toHexString(0xFF & byteArray[i]));
	            else
	                md5StrBuff.append(Integer.toHexString(0xFF & byteArray[i]));
	        }
	        return md5StrBuff.toString();
	    }
}