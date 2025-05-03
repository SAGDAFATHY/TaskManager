package com.tasks.tasks.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

@Aspect
@Component
public class TransactionAspect {
    @Autowired
    private PlatformTransactionManager transactionManager;

    // This will wrap any method with @TransactionalMethod
    @Around("@annotation(TransactionalMethod)")
    public Object manageTransaction(ProceedingJoinPoint joinPoint) throws Throwable {
        TransactionStatus status = transactionManager.getTransaction(new DefaultTransactionDefinition());

        try {
            // Execute the original method
            Object result = joinPoint.proceed();

            // If no exceptions, commit
            transactionManager.commit(status);
            return result;
        } catch (Exception e) {
            // If exception occurs, rollback
            transactionManager.rollback(status);
            throw e;
        }
    }
}
