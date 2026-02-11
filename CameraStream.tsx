
import React, { useRef, useEffect, useState } from 'react';
import { SystemState } from '../types';

interface CameraStreamProps {
  onFrameCapture: (base64: string) => void;
  isProcessing: boolean;
  state: SystemState;
}

const CameraStream: React.FC<CameraStreamProps> = ({ onFrameCapture, isProcessing, state }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!streamActive) return;

    const interval = setInterval(() => {
      if (videoRef.current && canvasRef.current && !isProcessing) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
          onFrameCapture(base64);
        }
      }
    }, 2000); // Sample every 4 seconds to balance real-time feel with API quotas

    return () => clearInterval(interval);
  }, [streamActive, isProcessing, onFrameCapture]);

  return (
    <div className="relative w-full h-full bg-slate-900 flex items-center justify-center">
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline 
        className="w-full h-full object-cover"
      />
      
      {/* HUD Overlays */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-cyan-500/20 m-4">
        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500"></div>

        {/* Scanlines & Processing Visuals */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className="scanline w-full absolute top-0"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)]"></div>
        </div>

        {/* Tracking Grid */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
            {Array.from({length: 36}).map((_, i) => (
                <div key={i} className="border-[0.5px] border-cyan-500/30"></div>
            ))}
        </div>

        {/* Status Indicators */}
        <div className="absolute top-8 right-8 text-right font-mono space-y-2">
            <div className="text-cyan-400 text-xs flex items-center justify-end gap-2">
                REC <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            </div>
            <div className="text-slate-400 text-[10px]">FPS: 30.0</div>
            <div className="text-slate-400 text-[10px]">RES: 1280x720</div>
            <div className="text-slate-400 text-[10px]">ISO: 400</div>
        </div>

        {/* Dynamic Tracking Boxes (Simulated) */}
        {isProcessing && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500 glow-cyan animate-spin-slow rounded-lg opacity-40"></div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraStream;
