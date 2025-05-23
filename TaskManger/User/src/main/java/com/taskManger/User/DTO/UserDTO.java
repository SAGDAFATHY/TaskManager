package com.taskManger.User.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDTO {
    private Integer id;
    private String name;
    private String email;
    private String role;
}
