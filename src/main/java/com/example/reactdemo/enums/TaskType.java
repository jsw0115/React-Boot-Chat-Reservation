package com.example.reactdemo.enums;

public enum TaskType {
    CHECK((short)1, ""),
    COUNT((short)2, ""),
    TIMER((short)3, "");

    private final short value;
    private final String name;

    TaskType (short value, String name) {
        this.value = value;
        this.name = name;
    }

    /**
     * code 값 리턴
     * @return code
     * */
    public short getCode() {
        return value;
    }

    /**
     * role name 리턴
     * @return roleName
     * */
    public String getName () {
        return name;
    }
}
