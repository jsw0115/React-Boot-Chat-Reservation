package com.example.reactdemo.web.model.dto.user;

import jakarta.validation.constraints.NotBlank;

public class CheckIdRequestDto {

    @NotBlank
    private String userAccountId;

    // getter, setter
    public String getUserAccountId() {
        return userAccountId;
    }
    public void setUserAccountId(String userAccountId) {
        this.userAccountId = userAccountId;
    }
}
