package com.tasks.tasks.aspects;


import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class ExceptionHandlingAspect {

    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandlingAspect.class);

    @Pointcut("within(com.taskManger.User..*)")
    public void applicationPackagePointcut() {}

    @Pointcut("within(@org.springframework.web.bind.annotation.RestController *)")
    public void controllerPointcut() {}

    @Around("applicationPackagePointcut() && controllerPointcut()")
    public Object logExceptions(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            return joinPoint.proceed();
        } catch (Throwable ex) {
            String className = joinPoint.getSignature().getDeclaringTypeName();
            String methodName = joinPoint.getSignature().getName();

            logger.error("Exception in {}.{}() with message: {}", className, methodName,
                    ex.getMessage() != null ? ex.getMessage() : "No message");

            throw ex; // لازم نرميه تاني عشان يوصله الـ GlobalExceptionHandler
        }
    }
}
