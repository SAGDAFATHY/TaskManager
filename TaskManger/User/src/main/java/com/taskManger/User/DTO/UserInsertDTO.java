package com.taskManger.User.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserInsertDTO {
    private String name;
    private String email;
    private String role;
    private String password;
}
