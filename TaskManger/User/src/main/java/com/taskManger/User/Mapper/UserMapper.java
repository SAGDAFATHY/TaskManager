package com.taskManger.User.Mapper;

import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.Model.UserEntity;

public class UserMapper {
    public static UserDTO toDto(UserEntity userEntity){
        return UserDTO.builder()
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .role(userEntity.getRole())
                .build();
    }
    public static UserEntity toEntity(UserDTO userDTO)
    {
        return UserEntity.builder()
                .email(userDTO.getEmail())
                .name(userDTO.getName())
                .role(userDTO.getRole())
                .password(userDTO.getPassword())
                .build();
    }
}
