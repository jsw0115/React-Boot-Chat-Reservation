package com.example.reactdemo.web.model.dto.user;

import jakarta.validation.constraints.NotBlank;

public class LoginRequestDto {

    @NotBlank
    private String userAccountId;

    @NotBlank
    private String password;

    // getter, setter
    public String getUserAccountId() {
        return userAccountId;
    }
    public void setUserAccountId(String userAccountId) {
        this.userAccountId = userAccountId;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
