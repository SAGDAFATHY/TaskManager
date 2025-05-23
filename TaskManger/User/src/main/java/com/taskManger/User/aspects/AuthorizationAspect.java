package com.taskManger.User.aspects;

import com.taskManger.User.annotations.*;
import com.taskManger.User.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
import java.util.Arrays;
import java.util.Collection;

@Aspect
@Component
public class AuthorizationAspect {
    @Autowired
    private HttpServletRequest request;

    @Autowired
    private JwtUtil jwtUtil;

    @Before("@annotation(roleCheck)")
    public void checkRole(RoleCheck roleCheck) throws AccessDeniedException {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new AccessDeniedException("Missing or invalid Authorization header");
        }

        String token = authHeader.substring(7); // Strip "Bearer "
        String userRole;

        try {
            userRole = jwtUtil.extractUserRole(token);
        } catch (Exception e) {
            throw new AccessDeniedException("Invalid token");
        }

        if (userRole == null || Arrays.stream(roleCheck.roles()).noneMatch(r -> r.equalsIgnoreCase(userRole))) {
            throw new AccessDeniedException("Access Denied: Role not permitted");
        }
    }


}

