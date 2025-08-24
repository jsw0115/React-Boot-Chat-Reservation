package com.example.reactdemo.enums;

/**
 * @since 2025.08.24
 */
public enum RepeatType {
    NONE((short)0, "NONE"),
    DAILY((short)1, "DAILY"),
    WEEKLY((short)2, "WEEKLY"),
    MONTHLY((short)3, "MONTHLY"),
    YEARLY((short)4, "YEARLY"),
    INTERVAL((short)5, "INTERVAL");

    private final short value;
    private final String name;

    RepeatType(short value, String name) {
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
