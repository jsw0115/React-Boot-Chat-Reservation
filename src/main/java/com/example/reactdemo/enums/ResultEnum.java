package com.example.reactdemo.enums;

/**
 * 결과 값 Enum
 * @since 2025.05.24
 */
public enum ResultEnum {

    SUCCESS((short) 1, "success"),
    FAIL((short) 0, "fail"),
    DUPLICATION((short) 2, "duplication"),
    EXCEPTION((short) 3, "exception");

    private final short code;
    private final String roleName;

    ResultEnum (short code, String roleName) {
        this.code = code;
        this.roleName = roleName;
    }

    /**
     * code 값 리턴
     * @return code
     * */
    public short getCode() {
        return code;
    }

    /**
     * role name 리턴
     * @return roleName
     * */
    public String getRoleName () {
        return roleName;
    }
}
