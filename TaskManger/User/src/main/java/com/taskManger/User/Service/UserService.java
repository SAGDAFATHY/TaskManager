package com.taskManger.User.Service;

import com.taskManger.User.DTO.UserAuth;
import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.Mapper.UserMapper;
import com.taskManger.User.Model.UserEntity;
import com.taskManger.User.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public boolean Login(UserAuth userAuth)
    {
        return userRepository.findByEmail(userAuth.getEmail())
                .map(user -> user.getPassword().equals(userAuth.getPassword()))
                .orElse(false);
    }

}

