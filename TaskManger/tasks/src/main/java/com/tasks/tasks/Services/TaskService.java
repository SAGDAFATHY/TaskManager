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

    //@Autowired
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll()
                .stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TaskDto createTask(TaskDto taskDto) {
        var task = TaskMapper.toEntity(taskDto);
        var saved = taskRepository.save(task);
        return TaskMapper.toDTO(saved);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public Optional<TaskDto> getTaskById(Long id) {
        return taskRepository.findById(id).map(TaskMapper::toDTO);
    }

    public List<TaskDto> getTasksByEmployeeAndStatus(Long employeeId, TaskStatus status) {
        return taskRepository.findByAssignedToAndStatus(employeeId, status)
                .stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }



    public List<TaskDto> getTasksByEmployeeId(Long employeeId) {
        return taskRepository.findByAssignedTo(employeeId)
                .stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    public List<TaskDto> getTasksByStatus(TaskStatus status) {
        return taskRepository.findByStatus(status)
                .stream()
                .map(TaskMapper::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<TaskDto> updateTask(Long id, TaskDto updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(updatedTask.getTitle());
            task.setDescription(updatedTask.getDescription());
            task.setDeadline(updatedTask.getDeadline());
            task.setStatus(updatedTask.getStatus());
            task.setAssignedTo(updatedTask.getAssignedTo());
            return TaskMapper.toDTO(taskRepository.save(task));
        });
    }
}
