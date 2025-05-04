package com.taskManger.User.Controller;

import com.taskManger.User.DTO.UserDTO;
import com.taskManger.User.DTO.UserInsertDTO;
import com.taskManger.User.Service.ManagerService;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/manager")
public class ManagerController {

    @Autowired
    private ManagerService managerService;

    @PostMapping("/add-user")
    public ResponseEntity<String> addUser(@RequestBody UserInsertDTO request) {
        managerService.addUser(request);
        return ResponseEntity.ok("User added successfully");
    }

    @GetMapping("/view-all-users")
    public  ResponseEntity<List<UserDTO>> viewAllUsers()
    {
        List<UserDTO> userDTOList = managerService.viewAllUsers();
        return ResponseEntity.ok(userDTOList);
    }

    @DeleteMapping("/delete-user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Integer id) {
        managerService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }



}
