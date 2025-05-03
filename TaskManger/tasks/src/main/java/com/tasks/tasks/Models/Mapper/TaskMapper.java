package com.tasks.tasks.Models.Mapper;


import com.tasks.tasks.Models.Entity.Task;
import com.tasks.tasks.Models.Entity.User;
import com.tasks.tasks.Models.dto.TaskDto;

public class TaskMapper {
    public static TaskDto toDTO(Task task) {
        return TaskDto.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .deadline(task.getDeadline())
                .status(task.getStatus())
                .assignedTo(task.getAssignedTo().getId())
                .build();
    }

    public static Task toEntity(TaskDto dto, User user) {
        return Task.builder()
                .id(dto.getId())
                .title(dto.getTitle())
                .description(dto.getDescription())
                .deadline(dto.getDeadline())
                .status(dto.getStatus())
                .assignedTo(user)
                .build();
    }
}
