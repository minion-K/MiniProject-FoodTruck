package org.example.foodtruckback.service.policy;

import org.example.foodtruckback.common.enums.ErrorCode;
import org.example.foodtruckback.common.enums.TruckStatus;
import org.example.foodtruckback.entity.truck.Truck;
import org.example.foodtruckback.exception.BusinessException;

public class TruckPolicy {
    public static void validateActive(Truck truck) {
        if(truck == null) {
            throw new BusinessException(ErrorCode.TRUCK_NOT_FOUND);
        }

        if(truck.getStatus() == TruckStatus.SUSPENDED) {
            throw new BusinessException(ErrorCode.TRUCK_SUSPENDED);
        }
    }
}
