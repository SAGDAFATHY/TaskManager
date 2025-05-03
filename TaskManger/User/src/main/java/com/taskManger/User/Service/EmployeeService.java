package com.taskManger.User.Service;

import com.taskManger.User.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {
    @Autowired
    private UserRepository userRepository;
}
