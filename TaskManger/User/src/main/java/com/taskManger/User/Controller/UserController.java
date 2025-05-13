package com.taskManger.User.Controller;

import com.taskManger.User.DTO.UserAuth;
import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.Service.UserService;
import com.taskManger.User.annotations.RoleCheck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;



    @PostMapping("/login")
    public ResponseEntity<String> Login(@RequestBody UserAuth request){
        return ResponseEntity.ok(userService.Login(request));
    }
    @RoleCheck(roles={"manager","employee"})
    @PutMapping("/update-pass/{id}")
    public ResponseEntity<String> updatePassword(@PathVariable Integer id, @RequestBody String newPassword)
    {
        userService.updatePassword(id,newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }



    @RoleCheck(roles = {"manager","employee"})
    @GetMapping("view-user-by-id/{id}")
    public ResponseEntity<UserDTO> viewUserById(@PathVariable Integer id)
    {
        UserDTO userDTO = userService.viewUserByiId(id);
        return ResponseEntity.ok(userDTO);
    }
}
