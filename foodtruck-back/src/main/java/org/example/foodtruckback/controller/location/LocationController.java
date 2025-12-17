package org.example.foodtruckback.controller.location;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.foodtruckback.common.constants.location.LocationApi;
import org.example.foodtruckback.dto.ResponseDto;
import org.example.foodtruckback.dto.location.request.LocationCreateRequestDto;
import org.example.foodtruckback.dto.location.request.LocationUpdateRequestDto;
import org.example.foodtruckback.dto.location.response.LocationDetailResponseDto;
import org.example.foodtruckback.dto.location.response.LocationListItemResponseDto;
import org.example.foodtruckback.security.user.UserPrincipal;
import org.example.foodtruckback.service.location.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(LocationApi.ROOT)
public class LocationController {
    private final LocationService locationService;

    // create location
    @PostMapping
    public ResponseEntity<ResponseDto<LocationDetailResponseDto>> createLocation(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody LocationCreateRequestDto request
            ) {
        ResponseDto<LocationDetailResponseDto> response = locationService.createLocation(principal,request);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // get location (all)
    @GetMapping
    public ResponseEntity<ResponseDto<List<LocationListItemResponseDto>>> getAllLocation() {
        ResponseDto<List<LocationListItemResponseDto>> response = locationService.getAllLocation();

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // get location (byId)
    @GetMapping(LocationApi.BY_ID)
    public ResponseEntity<ResponseDto<LocationDetailResponseDto>> getLocationById(
            @PathVariable Long locationId
    ) {
        ResponseDto<LocationDetailResponseDto> response = locationService.getLocationById(locationId);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // update location
    @PutMapping(LocationApi.BY_ID)
    public ResponseEntity<ResponseDto<LocationDetailResponseDto>> updateLocation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long locationId,
            @RequestBody LocationUpdateRequestDto request
            ) {
        ResponseDto<LocationDetailResponseDto> response = locationService.updateLocation(principal,locationId, request);

        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // delete location
    @DeleteMapping(LocationApi.BY_ID)
    public ResponseEntity<ResponseDto<Void>> deleteLocation(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long locationId
    ) {
        ResponseDto<Void> response = locationService.deleteLocation(principal,locationId);

        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
