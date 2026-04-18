package org.example.foodtruckback.service.location;

import jakarta.validation.Valid;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.location.request.LocationCreateRequestDto;
import org.example.foodtruckback.dto.location.request.LocationUpdateRequestDto;
import org.example.foodtruckback.dto.location.response.LocationDetailResponseDto;
import org.example.foodtruckback.dto.location.response.LocationListItemResponseDto;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

public interface LocationService {
    ResponseDto<LocationDetailResponseDto> createLocation(@Valid LocationCreateRequestDto request);

    ResponseDto<List<LocationListItemResponseDto>> getAllLocation(String keyword);

    ResponseDto<LocationDetailResponseDto> getLocationById(Long locationId);

    ResponseDto<LocationDetailResponseDto> updateLocation(Long locationId, @RequestBody LocationUpdateRequestDto request);

    ResponseDto<Void> deleteLocation(Long locationId);
}
