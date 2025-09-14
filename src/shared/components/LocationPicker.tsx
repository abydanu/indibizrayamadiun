'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { MapPin, Navigation, Map, Satellite } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

declare global {
  interface Window {
    L: any;
  }
}

interface LocationPickerProps {
  value?: string;
  onChange?: (coordinates: string) => void;
  className?: string;
  placeholder?: string;
  error?: string;
  onAddressChange?: (address: string) => void; // Callback to update address field
}

interface Coordinates {
  lat: number;
  lng: number;
}

const LocationPicker = ({ 
  value = '', 
  onChange, 
  className, 
  placeholder = "Klik 'Pilih Lokasi' untuk memilih koordinat",
  error,
  onAddressChange
}: LocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [mapType, setMapType] = useState<'street' | 'satellite'>('satellite');

  useEffect(() => {
    if (value && value.includes(',')) {
      const [lat, lng] = value.split(',').map(coord => parseFloat(coord.trim()));
      if (!isNaN(lat) && !isNaN(lng)) {
        setCoordinates({ lat, lng });
      }
    }
  }, [value]);

  // Reverse geocoding function to convert coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        const address = data.display_name;
        if (onAddressChange) {
          onAddressChange(address);
        }
        console.log('Reverse geocoding successful:', address);
        return address;
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
    return null;
  };

  useEffect(() => {
    if (isMapOpen && !window.L) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
      };
      document.head.appendChild(script);
    }
  }, [isMapOpen]);

  useEffect(() => {
    if (isMapOpen && mapRef.current && !map && window.L) {
      const L = window.L;
      
      try {
        if ((mapRef.current as any)._leaflet_id) {
          delete (mapRef.current as any)._leaflet_id;
        }
        mapRef.current.innerHTML = '';
      } catch (error) {
        console.log('Map cleanup error:', error);
      }
      
      // Default to Indonesia center
      const defaultLat = coordinates?.lat || -7.2575;
      const defaultLng = coordinates?.lng || 112.7521;

      const newMap = L.map(mapRef.current).setView([defaultLat, defaultLng], 16);

      // Define different map layers
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, Maxar, Earthstar Geographics',
        maxZoom: 19
      });

      const hybridLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19
      });

      // Add default layer (satellite for better accuracy)
      if (mapType === 'satellite') {
        satelliteLayer.addTo(newMap);
        hybridLayer.addTo(newMap);
      } else {
        streetLayer.addTo(newMap);
      }

      // Store layers for switching
      (newMap as any).streetLayer = streetLayer;
      (newMap as any).satelliteLayer = satelliteLayer;
      (newMap as any).hybridLayer = hybridLayer;

      // Add existing marker if coordinates exist
      if (coordinates) {
        const newMarker = L.marker([coordinates.lat, coordinates.lng])
          .addTo(newMap)
          .bindPopup(`Koordinat: ${coordinates.lat}, ${coordinates.lng}`)
          .openPopup();
        setMarker(newMarker);
      }

      // Add click event to map
      newMap.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        const newCoords = { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) };
        
        setCoordinates(newCoords);
        
        // Remove existing marker
        if (marker) {
          newMap.removeLayer(marker);
        }
        
        // Add new marker
        const newMarker = L.marker([lat, lng])
          .addTo(newMap)
          .bindPopup(`Koordinat: ${newCoords.lat}, ${newCoords.lng}`)
          .openPopup();
        
        setMarker(newMarker);
        
        // Reverse geocode to get address
        reverseGeocode(newCoords.lat, newCoords.lng);
      });

      setMap(newMap);
    }

    // Cleanup map when modal closes
    return () => {
      if (!isMapOpen && map) {
        try {
          // Check if map is still valid before removing
          if (map.getContainer && map.getContainer()) {
            map.remove();
          }
          if (mapRef.current) {
            (mapRef.current as any)._leaflet_id = null;
            mapRef.current.innerHTML = '';
          }
        } catch (error) {
          // Silently handle cleanup errors as they're expected during component unmount
          console.debug('Map cleanup handled:', error instanceof Error ? error.message : 'Unknown error');
        }
        setMap(null);
        setMarker(null);
      }
    };
  }, [isMapOpen, coordinates, map, marker]);

  const getCurrentLocation = async () => {
    setIsLoading(true);
    
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      toast.error('Geolocation tidak didukung oleh browser ini.');
      setIsLoading(false);
      return;
    }

    try {
      // Detect device type
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Request permission first (especially important for mobile)
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          
          if (permission.state === 'denied') {
            toast.error('Akses lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser.');
            setIsLoading(false);
            return;
          }
        } catch (permError) {
          console.log('Permission API not supported, continuing...');
        }
      }


      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          const newCoords = { 
            lat: parseFloat(latitude.toFixed(6)), 
            lng: parseFloat(longitude.toFixed(6)) 
          };
          
          setCoordinates(newCoords);
          
          if (map) {
            map.setView([latitude, longitude], 18);
            
            // Remove existing marker
            if (marker) {
              map.removeLayer(marker);
            }
            
            // Add new marker with accuracy info
            const L = window.L;
            if (L) {
              const accuracyText = accuracy ? ` (Akurasi: ±${Math.round(accuracy)}m)` : '';
              const newMarker = L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup(`Lokasi Saat Ini: ${newCoords.lat}, ${newCoords.lng}${accuracyText}`)
                .openPopup();
              
              setMarker(newMarker);
              
              // Add accuracy circle for mobile
              if (isMobile && accuracy && accuracy < 100) {
                L.circle([latitude, longitude], {
                  radius: accuracy,
                  color: '#3388ff',
                  fillColor: '#3388ff',
                  fillOpacity: 0.1,
                  weight: 2
                }).addTo(map);
              }
            }
            
            // Reverse geocode GPS location to get address
            reverseGeocode(newCoords.lat, newCoords.lng);
          }
          
          setIsLoading(false);
          
          // Show success message with accuracy info
          if (accuracy) {
            toast.success(`Lokasi berhasil ditemukan! Akurasi: ±${Math.round(accuracy)} meter`);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          let errorMessage = 'Tidak dapat mengakses lokasi. ';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              if (isAndroid) {
                errorMessage += 'ANDROID - Akses lokasi ditolak:\n\n1. Buka Pengaturan HP > Aplikasi > Chrome/Browser\n2. Pilih "Izin" > "Lokasi" > Izinkan\n3. Atau ketik chrome://settings/content/location di address bar\n4. Refresh halaman dan coba lagi';
              } else {
                errorMessage += 'Akses lokasi ditolak. Silakan aktifkan izin lokasi di pengaturan browser.';
              }
              break;
            case error.POSITION_UNAVAILABLE:
              if (isAndroid) {
                errorMessage += 'ANDROID - Lokasi tidak tersedia:\n\n1. Pastikan GPS aktif: Pengaturan > Lokasi > ON\n2. Pilih "Mode Akurasi Tinggi"\n3. Keluar ke area terbuka (tidak di dalam gedung)\n4. Tunggu 30 detik untuk sinyal GPS';
              } else {
                errorMessage += 'Lokasi tidak tersedia. Pastikan GPS aktif dan Anda berada di area dengan sinyal yang baik.';
              }
              break;
            case error.TIMEOUT:
              if (isAndroid) {
                errorMessage += 'ANDROID - Timeout:\n\n1. Keluar ke area terbuka\n2. Restart GPS: Matikan dan nyalakan kembali lokasi\n3. Tunggu lebih lama (30-60 detik)\n4. Coba gunakan aplikasi Maps dulu untuk "warm up" GPS';
              } else {
                errorMessage += 'Pencarian lokasi timeout. Coba lagi atau pindah ke area dengan sinyal GPS yang lebih baik.';
              }
              break;
            default:
              errorMessage += `Terjadi kesalahan (Code: ${error.code}). Coba refresh halaman atau restart browser.`;
              break;
          }
          
          toast.error(errorMessage);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: isAndroid ? 20000 : 15000, 
          maximumAge: isAndroid ? 60000 : 30000 
        }
      );
    } catch (error) {
      console.error('Permission error:', error);
      toast.error('Tidak dapat memeriksa izin lokasi. Pastikan browser mendukung fitur lokasi.');
      setIsLoading(false);
    }
  };

  const handleSaveCoordinates = () => {
    if (coordinates && onChange) {
      const coordString = `${coordinates.lat}, ${coordinates.lng}`;
      onChange(coordString);
      setIsMapOpen(false);
      toast.success('Koordinat berhasil disimpan!');
    } else {
      toast.error('Tidak ada koordinat yang dipilih. Silakan pilih lokasi terlebih dahulu.');
    }
  };

  const formatCoordinates = (coords: Coordinates) => {
    return `${coords.lat}, ${coords.lng}`;
  };

  const switchMapType = () => {
    if (map && window.L) {
      const L = window.L;
      
      if (mapType === 'satellite') {
        map.removeLayer((map as any).satelliteLayer);
        map.removeLayer((map as any).hybridLayer);
        (map as any).streetLayer.addTo(map);
        setMapType('street');
      } else {
        map.removeLayer((map as any).streetLayer);
        (map as any).satelliteLayer.addTo(map);
        (map as any).hybridLayer.addTo(map);
        setMapType('satellite');
      }
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="md:flex grid gap-2">
        <Input
          value={coordinates ? formatCoordinates(coordinates) : ''}
          placeholder={placeholder}
          readOnly
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsMapOpen(true)}
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <MapPin className="w-4 h-4" />
          Pilih Lokasi
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {isMapOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
              <h3 className="text-lg font-semibold">Pilih Lokasi</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMapOpen(false)}
              >
                ✕
              </Button>
            </div>
            
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex gap-2 items-center flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getCurrentLocation}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  {isLoading ? 'Mencari Lokasi...' : 'Aktifkan Lokasi'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={switchMapType}
                  className="flex items-center gap-2"
                >
                  {mapType === 'satellite' ? (
                    <>
                      <Map className="w-4 h-4" />
                      Peta Jalan
                    </>
                  ) : (
                    <>
                      <Satellite className="w-4 h-4" />
                      Satelit
                    </>
                  )}
                </Button>
                
                {coordinates && (
                  <div className="text-sm text-gray-600">
                    Koordinat: {formatCoordinates(coordinates)}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 relative min-h-0">
              <div 
                ref={mapRef} 
                className="w-full h-full"
                style={{ minHeight: '300px' }}
              />
              
              <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
                <p className="text-sm text-gray-700">
                  <strong>Cara menggunakan:</strong><br />
                  • Klik pada peta untuk memilih lokasi<br />
                  • Atau gunakan tombol "Aktifkan Lokasi"<br />
                  • Di mobile: pastikan GPS aktif & izinkan akses lokasi<br />
                  • Koordinat akan ditampilkan otomatis
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsMapOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="button"
                onClick={handleSaveCoordinates}
                disabled={!coordinates}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Simpan Koordinat
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
