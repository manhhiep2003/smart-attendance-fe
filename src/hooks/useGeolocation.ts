import { useState, useEffect } from 'react';

interface GeolocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation(requireWatch: boolean = false) {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: 'Trình duyệt của bạn không hỗ trợ định vị GPS.',
        loading: false,
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'Lỗi không xác định khi lấy GPS.';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Bạn đã từ chối quyền truy cập vị trí.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Không thể xác định vị trí hiện tại.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Quá thời gian yêu cầu lấy vị trí.';
          break;
      }
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
    };

    const options = {
      enableHighAccuracy: true, 
      timeout: 10000,
      maximumAge: 0,
    };

    let watcherId: number;

    if (requireWatch) {
      watcherId = navigator.geolocation.watchPosition(onSuccess, onError, options);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }

    return () => {
      if (requireWatch && watcherId) {
        navigator.geolocation.clearWatch(watcherId);
      }
    };
  }, [requireWatch]);

  return state;
}