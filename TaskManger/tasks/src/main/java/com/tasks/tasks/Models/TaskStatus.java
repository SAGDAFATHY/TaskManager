package com.tasks.tasks.Models;

public enum TaskStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED;
    public static TaskStatus fromString(String value) {
        return value == null ? null : TaskStatus.valueOf(value.toUpperCase());
    }
}
