import { Upload, Lock, Unlock, Image as ImageIcon } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';

interface ControlsProps {
  onImageUpload: (url: string) => void;
  opacity: number;
  onOpacityChange: (opacity: number) => void;
  isLocked: boolean;
  onLockToggle: () => void;
  hasImage: boolean;
}

export default function Controls({
  onImageUpload,
  opacity,
  onOpacityChange,
  isLocked,
  onLockToggle,
  hasImage
}: ControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageUpload(url);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      padding: '20px 20px 30px',
      zIndex: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      <div className="glass-panel" style={{
        borderRadius: 24,
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }}>
        {hasImage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%' }}>
            <ImageIcon size={20} style={{ opacity: 0.7 }} />
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={opacity}
              onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
            />
            <span style={{ fontSize: 12, minWidth: 32, textAlign: 'right' }}>
              {Math.round(opacity * 100)}%
            </span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
          <button 
            className="glass-button" 
            onClick={() => fileInputRef.current?.click()}
            title="Upload Image"
          >
            <Upload size={24} />
          </button>
          
          <button 
            className={`glass-button ${isLocked ? 'active' : ''}`}
            onClick={onLockToggle}
            title={isLocked ? "Unlock Position" : "Lock Position"}
            disabled={!hasImage}
            style={{ opacity: !hasImage ? 0.5 : 1, pointerEvents: !hasImage ? 'none' : 'auto' }}
          >
            {isLocked ? <Lock size={24} /> : <Unlock size={24} />}
          </button>
        </div>
      </div>
      
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </div>
  );
}
