package org.example.foodtruckback.controller.location;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.location.LocationApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.location.request.LocationCreateRequestDto;
import org.example.foodtruckback.dto.location.request.LocationUpdateRequestDto;
import org.example.foodtruckback.dto.location.response.LocationDetailResponseDto;
import org.example.foodtruckback.dto.location.response.LocationListItemResponseDto;
import org.example.foodtruckback.service.location.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(LocationApi.ROOT)
public class LocationController {
    private final LocationService locationService;

    @PostMapping
    public ResponseEntity<ResponseDto<LocationDetailResponseDto>> createLocation(
            @Valid @RequestBody LocationCreateRequestDto request
    ) {
        ResponseDto<LocationDetailResponseDto> response = locationService.createLocation(request);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping
    public ResponseEntity<ResponseDto<List<LocationListItemResponseDto>>> getAllLocation(
            @RequestParam(required = false) String keyword
    ) {
        ResponseDto<List<LocationListItemResponseDto>> response = locationService.getAllLocation(keyword);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping(LocationApi.BY_ID)
    public ResponseEntity<ResponseDto<LocationDetailResponseDto>> getLocationById(
            @PathVariable Long locationId
    ) {
        ResponseDto<LocationDetailResponseDto> response = locationService.getLocationById(locationId);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping(LocationApi.BY_ID)
    public ResponseEntity<ResponseDto<LocationDetailResponseDto>> updateLocation(
            @PathVariable Long locationId,
            @Valid @RequestBody LocationUpdateRequestDto request
    ) {
        ResponseDto<LocationDetailResponseDto> response = locationService.updateLocation(locationId, request);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping(LocationApi.BY_ID)
    public ResponseEntity<ResponseDto<Void>> deleteLocation(
            @PathVariable Long locationId
    ) {
        ResponseDto<Void> response = locationService.deleteLocation(locationId);

        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
