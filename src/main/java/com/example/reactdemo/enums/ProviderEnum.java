package com.example.reactdemo.enums;

public enum ProviderEnum {

    LOCAL((short) 1, "local"),
    JWT((short) 0, "jwt"),
    GOOGLE((short) 2, "google"),
    KAKAO((short) 3, "kakao");

    private final short code;
    private final String roleName;

    ProviderEnum (short code, String roleName) {
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
