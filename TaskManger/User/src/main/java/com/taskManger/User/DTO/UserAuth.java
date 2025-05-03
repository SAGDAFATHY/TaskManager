package com.taskManger.User.DTO;

import lombok.Builder;
import lombok.Data;


@Builder
@Data

public class UserAuth {
    private String email;
    private String password;
}
