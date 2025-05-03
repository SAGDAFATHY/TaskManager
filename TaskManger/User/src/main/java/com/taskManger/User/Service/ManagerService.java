package com.taskManger.User.Service;

import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.Mapper.UserMapper;
import com.taskManger.User.Model.UserEntity;
import com.taskManger.User.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManagerService {

    @Autowired
    private UserRepository userRepository;

    public Boolean addUser(UserDTO user)
    {
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            return false;
        }else {
            UserEntity newUser= UserMapper.toEntity(user);
            UserEntity save = userRepository.save(newUser);
            return save.getId() != null;
        }
    }
}
