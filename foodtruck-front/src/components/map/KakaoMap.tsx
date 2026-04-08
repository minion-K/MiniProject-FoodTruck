import React, { useEffect, useRef, useState } from 'react'
import markerActive from "@/assets/images/marker-active.png";
import markerInactive from "@/assets/images/marker_inactive.png";
import myLocationMarker from "@/assets/images/marker_me.png";

interface Marker {
  lat: number;
  lng: number;
  isActive: boolean;
}

interface Props {
  center: {
    lat: number;
    lng: number;
  };
  markers: Marker[];
  level?: number;
  onClick?: (lat: number, lng: number) => void;
  myLocation?: {lat: number, lng: number} | null;
}

function KakaoMap({center, markers, level = 4, onClick, myLocation}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<kakao.maps.Marker[]>([]);
  const myMarkerRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if(!mapRef.current) return;
    if(!window.kakao || !window.kakao.maps) return;

    window.kakao.maps.load(() => {
      if(!mapInstance.current) {
        mapInstance.current = new window.kakao.maps.Map(
          mapRef.current!,
          {
            center: new window.kakao.maps.LatLng(center.lat, center.lng),
            level
          }
        );
        setLoading(true);
      };

        if(onClick) {
          window.kakao.maps.event.addListener(
            mapInstance.current,
            "click",
            (mouseEvent: any) => {
              const latlng = mouseEvent.latLng;
              onClick(latlng.getLat(), latlng.getLng());
            }
          );
        }
      });
  }, []);

  useEffect(() => {
    if(!mapInstance.current) return;

    mapInstance.current.setCenter(
      new window.kakao.maps.LatLng(center.lat, center.lng)
    );
  }, [center]);

  useEffect(() => {
    if(!mapInstance.current) return;

    markerInstance.current.forEach(marker => marker.setMap(null));
    markerInstance.current = [];

    markers.forEach(marker => {
      const pos = new window.kakao.maps.LatLng(marker.lat, marker.lng);
      const  imageSrc = marker.isActive
        ? markerActive
        : markerInactive;
      const imageSize = new window.kakao.maps.Size(36, 36);
      const markerImg = new window.kakao.maps.MarkerImage(imageSrc, imageSize);
      const mk = new window.kakao.maps.Marker({
        position: pos,
        image: markerImg
      });
      
      mk.setMap(mapInstance.current);
      markerInstance.current.push(mk);
    });
  }, [markers]);

  useEffect(() => {
    if(!mapInstance.current || !myLocation) return;

    const pos = new window.kakao.maps.LatLng(
      myLocation.lat,
      myLocation.lng
    );

    if(!myMarkerRef.current) {
      const imageSize = new window.kakao.maps.Size(48, 48);
      const markerImg = new window.kakao.maps.MarkerImage(
        myLocationMarker, imageSize,
        {
          offset: new window.kakao.maps.Point(24, 48)
        }
      );
      
      myMarkerRef.current = new window.kakao.maps.Marker({
        position: pos,
        image: markerImg,
      });

      myMarkerRef.current?.setMap(mapInstance.current);
    } else {
      myMarkerRef.current.setPosition(pos);
    }
  }, [myLocation, loading]);
  
  return (
    <div
      ref={mapRef}
      style={{width: "100%", height: "100%"}}
    />
  )
}

export default KakaoMap
