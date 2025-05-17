package com.example.reactdemo.enums;

/**
 * User 권한 Enum
 * @since 2025.05.17
 * */
public enum UserRole {

    GUEST_ROLE((short) 0, "GUEST_ROLE"),
    USER_ROLE((short) 1, "USER_ROLE"),
    READABLE_ROLE((short) 2, "READABLE_ROLE"),
    MODIFY_ROLE((short) 3, "MODIFY_ROLE"),
    ADMIN_ROLE((short) 4, "ADMIN_ROLE"),
    MANAGER_ROLE((short) 5, "MANAGER_ROLE"),
    SUPER_ADMIN_ROLE((short) 6, "SUPER_ADMIN_ROLE");

    private final short code;
    private final String roleName;

    UserRole (short code, String roleName) {
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

    /**
     * short 값을 이용해 enum 찾기
     *
     * @return UserRole
     */
    public static UserRole fromCode(short code) {
        for (UserRole role : UserRole.values()) {
            if (role.code == code) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid Role code: " + code);
    }
}
