package com.taskManger.User.Controller;


import com.taskManger.User.DTO.UserAuth;
import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public String Login(@RequestBody UserAuth request){
        if(userService.Login(request))
            return "Login successful!";
        else
            return "Invalid";
    }

}
