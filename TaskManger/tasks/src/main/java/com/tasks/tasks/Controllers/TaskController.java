package com.tasks.tasks.Controllers;

import com.tasks.tasks.Models.TaskStatus;
import com.tasks.tasks.Models.dto.TaskDto;
import com.tasks.tasks.Services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<TaskDto> getAllTasks() {
        return taskService.getAllTasks();
    }
    @GetMapping("/employee")
    public List<TaskDto> getTasksByEmployee(@RequestParam Long employeeId) {
        return taskService.getTasksByEmployeeId(employeeId);
    }

    @GetMapping("/status")
    public List<TaskDto> getTasksByStatus(@RequestParam String status) {
        TaskStatus taskStatus = TaskStatus.valueOf(status.toUpperCase());
        return taskService.getTasksByStatus(taskStatus);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(@PathVariable Long id, @RequestBody TaskDto taskDTO) {
        return taskService.updateTask(id, taskDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

}
