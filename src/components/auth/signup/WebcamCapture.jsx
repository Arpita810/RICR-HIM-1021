import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function WebcamCapture({ onCapture, label = 'Live Face Capture' }) {
      const webcamRef = useRef(null);
      const [captured, setCaptured] = useState(null);
      const [active, setActive] = useState(false);
      const [error, setError] = useState('');

      const capture = useCallback(() => {
            const img = webcamRef.current?.getScreenshot();
            if (img) {
                  setCaptured(img);
                  setActive(false);
                  onCapture?.(img);
            }
      }, [onCapture]);

      const retake = () => {
            setCaptured(null);
            setActive(true);
            onCapture?.(null);
      };

      return (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Camera className="w-4 h-4 text-blue-500" />
                        {label}
                  </p>

                  {!active && !captured && (
                        <button
                              type="button"
                              onClick={() => { setActive(true); setError(''); }}
                              className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-sm text-blue-600 font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                              <Camera className="w-4 h-4" />
                              Open Camera & Capture Selfie
                        </button>
                  )}

                  {active && (
                        <div className="space-y-3">
                              <div className="rounded-xl overflow-hidden border border-gray-200">
                                    <Webcam
                                          ref={webcamRef}
                                          audio={false}
                                          screenshotFormat="image/jpeg"
                                          videoConstraints={{ width: 400, height: 300, facingMode: 'user' }}
                                          onUserMediaError={() => setError('Camera access denied. Please allow camera permission.')}
                                          className="w-full"
                                    />
                              </div>
                              {error && <p className="text-xs text-red-500">{error}</p>}
                              <div className="flex gap-2">
                                    <button
                                          type="button"
                                          onClick={capture}
                                          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2"
                                    >
                                          <Camera className="w-4 h-4" /> Capture Photo
                                    </button>
                                    <button
                                          type="button"
                                          onClick={() => setActive(false)}
                                          className="px-4 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl"
                                    >
                                          Cancel
                                    </button>
                              </div>
                        </div>
                  )}

                  {captured && (
                        <div className="space-y-3">
                              <div className="relative rounded-xl overflow-hidden border-2 border-emerald-300">
                                    <img src={captured} alt="Captured" className="w-full" />
                                    <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1">
                                          <CheckCircle2 className="w-4 h-4" />
                                    </div>
                              </div>
                              <button
                                    type="button"
                                    onClick={retake}
                                    className="w-full py-2 border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold hover:bg-gray-50 flex items-center justify-center gap-2"
                              >
                                    <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                              </button>
                        </div>
                  )}
            </div>
      );
}
