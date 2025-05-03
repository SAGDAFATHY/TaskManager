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

    public List<TaskDto> getTasksByEmployeeId(Long employeeId) {
        return taskRepository.findByAssignedTo_Id(employeeId)
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
           // task.setAssignedTo(updatedTask.getAssignedTo());
            return TaskMapper.toDTO(taskRepository.save(task));
        });
    }
}
