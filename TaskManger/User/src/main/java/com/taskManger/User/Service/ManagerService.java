package com.taskManger.User.Service;

import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.DTO.UserInsertDTO;
import com.taskManger.User.Mapper.UserMapper;
import com.taskManger.User.Model.UserEntity;
import com.taskManger.User.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ManagerService {

    @Autowired
    private UserRepository userRepository;

    public void addUser(UserInsertDTO user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exists");
        } else {
            UserEntity newUser = UserMapper.toEntity(user);
            userRepository.save(newUser);
        }
    }

    public List<UserDTO> viewAllUsers()
    {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    public void deleteUser(Integer id)
    {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }



}
