package com.example.reactdemo.web.model.models;

/**
 * API 통신 중 사용할 결과 모델
 * @since 2025.05.24
 * @author jsw01
*/
public class JsonResultApiModel {

    public short resultCode = 0;
    public boolean isSuccess = false;
    public String responseCode;
    public Object jsonResult;
    public String statusName;
    public String message;
}
