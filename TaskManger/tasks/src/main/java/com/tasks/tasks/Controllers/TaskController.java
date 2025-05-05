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
    @GetMapping("/get-all-tasks")
    public List<TaskDto> getAllTasks(@RequestHeader("Authorization") String token) {
        return taskService.getAllTasks(taskService.getUserId(token));
    }

    @RoleCheck(roles = {"manager"})
    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto taskDto,@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(taskService.createTask(taskDto,taskService.getUserId(token)));
    }

    @RoleCheck(roles = {"manager"})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id,@RequestHeader("Authorization") String token) {
        taskService.deleteTask(id,taskService.getUserId(token));
        return ResponseEntity.noContent().build();
    }

    @RoleCheck(roles = {"manager","employee"})
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id,@RequestHeader("Authorization") String token) {
        return taskService.getTaskById(id,taskService.getUserId(token))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
        return taskService.updateTask(id, taskDTO,taskService.getUserId(token))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
