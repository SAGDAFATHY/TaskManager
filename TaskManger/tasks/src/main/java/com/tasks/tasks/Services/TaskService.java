package com.tasks.tasks.Services;


import com.tasks.tasks.Models.Mapper.TaskMapper;
import com.tasks.tasks.Models.TaskStatus;
import com.tasks.tasks.Models.dto.TaskDto;
import com.tasks.tasks.Repositeries.TaskRepository;
import com.tasks.tasks.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

   // @Autowired
    private final TaskRepository taskRepository;
    @Autowired
    private final JwtUtil jwtUtil;
    public Long getUserId(String token)
    {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractUserId(token).longValue();
    }
    public String getRoleFromToken(String token)
    {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractUserRole(token);
    }
    public List<TaskDto> getAllTasks() {
        try {
            return taskRepository.findAll()
                    .stream()
                    .map(TaskMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to retrieve tasks: " + e.getMessage());
        }
    }

    public TaskDto createTask(TaskDto taskDto) {
        if (taskDto == null) {
            throw new IllegalArgumentException("Task data cannot be null");
        }

        if (taskDto.getTitle() == null || taskDto.getTitle().isBlank()) {
            throw new IllegalArgumentException("Task title is required");
        }

        try {
            var task = TaskMapper.toEntity(taskDto);
            task.setCreatedAt(LocalDateTime.now());
            var saved = taskRepository.save(task);
            return TaskMapper.toDTO(saved);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to create task: " + e.getMessage());
        }
    }

    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new IllegalArgumentException("Task not found with id: " + id);
        }

        try {
            taskRepository.deleteById(id);
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to delete task with id: " + id);
        }
    }

    public Optional<TaskDto> getTaskById(Long id , String token) {
        Long userId = getUserId(token);
        String role = getRoleFromToken(token);
        if (role.equals("manager")) {
            return taskRepository.findById(id)
                    .map(TaskMapper::toDTO);

        } else {
            return taskRepository.findByIdAndAssignedTo(id, userId)
                    .map(TaskMapper::toDTO);
        }
    }

    public List<TaskDto> getUserTasks(String token) {
        Long userId = getUserId(token);
        return taskRepository.findByAssignedTo(userId)
                .stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }
//    public Optional<TaskDto> getTaskByIdbyuser(Long id,Integer userId) {
//        return Optional.ofNullable(taskRepository.findById(id)
//                .filter(task.getAssignedTo().equals(userId))
//                .map(TaskMapper::toDTO)
//                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id)));
//    }

    public List<TaskDto> getTasksByEmployeeAndStatus(Long employeeId, TaskStatus status, Long userId) {
        try {
            return taskRepository.findByAssignedToAndStatus(employeeId, status)
                    .stream()
                    .map(TaskMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Failed to retrieve tasks for employee " + employeeId +
                            " with status " + status
            );
        }
    }



    public List<TaskDto> getTasksByEmployeeId(Long employeeId,Long userId) {
        try {
            return taskRepository.findByAssignedTo(employeeId)
                    .stream()
                    .map(TaskMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Failed to retrieve tasks for employee " + employeeId
            );
        }
    }

    public List<TaskDto> getTasksByStatus(TaskStatus status,Long userId) {
        try {
            return taskRepository.findByStatus(status)
                    .stream()
                    .map(TaskMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new IllegalArgumentException(
                    "Failed to retrieve tasks with status " + status
            );
        }
    }

    public Optional<TaskDto> updateTask(Long id, TaskDto updatedTask,Long userId) {
        if (updatedTask == null) {
            throw new IllegalArgumentException("Updated task data cannot be null");
        }

        try {
            return taskRepository.findById(id)
                    .map(task -> {
                        if (updatedTask.getTitle() != null) {
                            task.setTitle(updatedTask.getTitle());
                        }
                        if (updatedTask.getDescription() != null) {
                            task.setDescription(updatedTask.getDescription());
                        }
                        if (updatedTask.getDeadline() != null) {
                            task.setDeadline(updatedTask.getDeadline());
                        }
                        if (updatedTask.getStatus() != null) {
                            task.setStatus(updatedTask.getStatus());
                        }
                        if (updatedTask.getAssignedTo() != null) {
                            task.setAssignedTo(updatedTask.getAssignedTo());
                        }
                        var taskUpdated = taskRepository.save(task);
                        taskUpdated.setUpdateAt(LocalDateTime.now());
                        return TaskMapper.toDTO(taskUpdated);
                    });
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to update task with id: " + id);
        }
    }
}
