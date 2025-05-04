package com.taskManger.User.Controller;


import com.taskManger.User.DTO.UserAuth;
import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.Service.UserService;
import com.taskManger.User.annotations.Authenticated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    @Authenticated
    @PutMapping("/update-pass/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable Integer id, @RequestBody String newPassword)
    {
        userService.updatePassword(id,newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }

    @GetMapping("view-user-by-id/{id}")
    public ResponseEntity<UserDTO> viewUserById(@PathVariable Integer id)
    {
        UserDTO userDTO = userService.viewUserByiId(id);
        return ResponseEntity.ok(userDTO);
    }
}
