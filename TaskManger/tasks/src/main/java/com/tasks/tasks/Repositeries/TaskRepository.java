package com.tasks.tasks.Repositeries;

import com.tasks.tasks.Models.Entity.Task;
import com.tasks.tasks.Models.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.List;
@Repository
public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByAssignedTo(Long employeeId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByAssignedToAndStatus(Long employeeId, TaskStatus status);
}
