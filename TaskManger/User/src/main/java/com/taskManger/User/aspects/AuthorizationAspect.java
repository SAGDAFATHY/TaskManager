package com.taskManger.User.aspects;

import com.taskManger.User.annotations.*;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Collection;

@Aspect
@Component
public class AuthorizationAspect {

    @Before("@annotation(authenticated)")
    public void checkAuthenticated(Authenticated authenticated) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }
    }

    @Before("@annotation(managerOnly)")
    public void checkManager(ManagerOnly managerOnly) {
        checkRole("ROLE_MANAGER");
    }

    @Before("@annotation(employeeOnly)")
    public void checkEmployee(EmployeeOnly employeeOnly) {
        checkRole("ROLE_EMPLOYEE");
    }

    private void checkRole(String requiredRole) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new AccessDeniedException("Authentication required");
        }

        Collection<? extends GrantedAuthority> authorities = auth.getAuthorities();
        boolean hasRole = authorities.stream()
                .anyMatch(authority -> authority.getAuthority().equals(requiredRole));

        if (!hasRole) {
            throw new AccessDeniedException("Insufficient privileges");
        }
    }
}

