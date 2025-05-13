package com.tasks.tasks.Controllers;

import com.tasks.tasks.Models.TaskStatus;
import com.tasks.tasks.Models.dto.TaskDto;
import com.tasks.tasks.Services.TaskService;
import com.tasks.tasks.annotations.RoleCheck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;
    @GetMapping("/error")
    public String triggerError() {
        throw new RuntimeException("This is a test exception");
    }

    @RoleCheck(roles = {"manager"})
    @GetMapping("/manager")
    public List<TaskDto> getAllTasks() {
        return taskService.getAllTasks();
    }

    @RoleCheck(roles = {"manager"})
    @PostMapping("/manager")
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto,@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.createTask(taskDto));
    }

    @RoleCheck(roles = {"manager"})
    @DeleteMapping("/manager/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id,@RequestHeader("Authorization") String token) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    @RoleCheck(roles = {"manager","employee"})
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id,@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.getTaskById(id,token));
    }
    @RoleCheck(roles = {"employee"})
    @GetMapping("/employee/my-tasks")
    public ResponseEntity<List<TaskDto>> getUserTasks(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.getUserTasks(token));
    }


    @RoleCheck(roles = {"manager","employee"})
    @GetMapping("/filter")
    public List<TaskDto> getTasksByEmployeeAndStatus(@RequestParam Long employeeId, @RequestParam String status,@RequestHeader("Authorization") String token) {
        TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
        return taskService.getTasksByEmployeeAndStatus(employeeId, taskStatus,taskService.getUserId(token));
    }

    @RoleCheck(roles = {"manager","employee"})
    @GetMapping("/employee")
    public List<TaskDto> getTasksByEmployee(@RequestParam Long employeeId,@RequestHeader("Authorization") String token) {
        return taskService.getTasksByEmployeeId(employeeId,taskService.getUserId(token));
    }

    @RoleCheck(roles = {"manager","employee"})
    @GetMapping("/status")
    public List<TaskDto> getTasksByStatus(@RequestParam String status,@RequestHeader("Authorization") String token) {
        TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
        return taskService.getTasksByStatus(taskStatus,taskService.getUserId(token));
    }

    @RoleCheck(roles = {"manager","employee"})
    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @RequestBody TaskDto taskDTO,@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.updateTask(id, taskDTO,taskService.getUserId(token)));
    }

}
