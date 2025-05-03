package com.tasks.tasks.Models.dto;


import com.tasks.tasks.Models.TaskStatus;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private TaskStatus status;
    private Long assignedTo;
}
