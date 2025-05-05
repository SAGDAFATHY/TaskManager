package com.tasks.tasks.Services;


import com.tasks.tasks.Models.Mapper.TaskMapper;
import com.tasks.tasks.Models.TaskStatus;
import com.tasks.tasks.Models.dto.TaskDto;
import com.tasks.tasks.Repositeries.TaskRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;

    @Autowired
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

    public Optional<TaskDto> getTaskById(Long id) {
        return Optional.ofNullable(taskRepository.findById(id)
                .map(TaskMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + id)));
    }

    public List<TaskDto> getTasksByEmployeeAndStatus(Long employeeId, TaskStatus status) {
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



    public List<TaskDto> getTasksByEmployeeId(Long employeeId) {
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

    public List<TaskDto> getTasksByStatus(TaskStatus status) {
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

    public Optional<TaskDto> updateTask(Long id, TaskDto updatedTask) {
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

                        return TaskMapper.toDTO(taskRepository.save(task));
                    });
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to update task with id: " + id);
        }
    }
}
