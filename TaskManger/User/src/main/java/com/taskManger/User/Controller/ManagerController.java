package com.taskManger.User.Controller;

import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.Service.ManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/manger")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @PostMapping("/add-user")
    public String addUser(@RequestBody UserDTO request){
        if(managerService.addUser(request))
            return "added successfully";
        else
            return "Failed to add user";
    }
}
