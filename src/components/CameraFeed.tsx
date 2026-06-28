import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Request back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        setHasPermission(false);
        setError(err.message || "Failed to access camera");
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, backgroundColor: '#000' }}>
      {hasPermission === false && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white', padding: 20, textAlign: 'center' }}>
          <CameraOff size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
          <h2>Camera Access Denied</h2>
          <p style={{ marginTop: 8, opacity: 0.7 }}>Please enable camera permissions in your browser settings to use the AR tracer.</p>
          <p style={{ marginTop: 8, opacity: 0.5, fontSize: 12 }}>{error}</p>
        </div>
      )}
      
      {hasPermission === null && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'white' }}>
          <Camera size={32} style={{ animation: 'pulse 2s infinite', opacity: 0.5 }} />
          <p style={{ marginTop: 16 }}>Requesting camera access...</p>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: hasPermission ? 'block' : 'none'
        }}
      />
    </div>
  );
}
