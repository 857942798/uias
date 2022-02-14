package com.ds.uias.core.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author: dongsheng
 * @CreateTime: 2020/12/30
 * @Description: 用户信息
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfo {

    private int userid;
    private String username;
    private String password;

}
