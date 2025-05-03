package com.tasks.tasks.Models.Entity;

import com.tasks.tasks.Models.TaskStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name="tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    private Long id;

    private String title;

    private String description;

    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo; // Assuming a User entity exists
}
