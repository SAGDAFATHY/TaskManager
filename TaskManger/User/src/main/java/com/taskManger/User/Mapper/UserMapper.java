package com.taskManger.User.Mapper;

import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.DTO.UserInsertDTO;
import com.taskManger.User.Model.UserEntity;

public class UserMapper {
    public static UserInsertDTO toInsertDto(UserEntity userEntity){
        return UserInsertDTO.builder()
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .password(userEntity.getPassword())
                .role(userEntity.getRole())
                .build();
    }

    public static UserDTO toDto(UserEntity userEntity){
        return UserDTO.builder()
                .id(userEntity.getId())
                .name(userEntity.getName())
                .email(userEntity.getEmail())
                .role(userEntity.getRole())
                .build();
    }

    public static UserEntity toEntity(UserInsertDTO userDTO)
    {
        return UserEntity.builder()
                .email(userDTO.getEmail())
                .name(userDTO.getName())
                .role(userDTO.getRole())
                .password(userDTO.getPassword())
                .build();
    }
}
