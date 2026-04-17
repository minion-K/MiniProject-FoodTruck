package org.example.foodtruckback.service.policy;

import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.UserStatus;
import org.example.foodtruckback.entity.user.User;
import org.example.foodtruckback.exception.BusinessException;

public class UserPolicy {
    public static void validateActive(User user) {
        if(user == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND);
        }

        if(user.getStatus() != UserStatus.ACTIVE) {
            throw new BusinessException(ErrorCode.USER_SUSPENDED);
        }
    }
}
