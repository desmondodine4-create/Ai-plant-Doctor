import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Camera,
  HelpCircle,
  Loader2,
  RotateCcw,
  ScanLine,
  Upload,
  X,
} from 'lucide-react';
import type { DiagnosisResult } from '../types';

interface DiagnoseViewProps {
  autoTrigger?: 'camera' | 'gallery' | null;
  onConsumedTrigger: () => void;
  autoSaveHistory: boolean;
  onSaveDiagnosis: (result: DiagnosisResult) => void;
  onDiagnosisReady: (result: DiagnosisResult) => void;
}

async function compressImageToDataUrl(fileOrBlob: Blob): Promise<{ dataUrl: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the selected image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Invalid or unsupported image format.'));
      img.onload = () => {
        const maxSide = 1280;
        let { width, height } = img;
        if (width > maxSide || height > maxSide) {
          if (width >= height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas compression unavailable.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve({ dataUrl, mimeType: 'image/jpeg' });
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(fileOrBlob);
  });
}

export const DiagnoseView: React.FC<DiagnoseViewProps> = ({
  autoTrigger,
  onConsumedTrigger,
  autoSaveHistory,
  onSaveDiagnosis,
  onDiagnosisReady,
}) => {
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const mobileCameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [plantHint, setPlantHint] = useState('');
  const [notes, setNotes] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uncertaintyReason, setUncertaintyReason] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const openCamera = async () => {
    setError(null);
    setUncertaintyReason(null);
    if (!navigator.mediaDevices?.getUserMedia) {
      mobileCameraInputRef.current?.click();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      });
    } catch {
      mobileCameraInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (autoTrigger === 'camera') {
      onConsumedTrigger();
      openCamera();
    } else if (autoTrigger === 'gallery') {
      onConsumedTrigger();
      galleryInputRef.current?.click();
    }
  }, [autoTrigger, onConsumedTrigger]);

  const handleSelectedFile = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid JPEG, PNG, or WebP photograph.');
      return;
    }
    try {
      stopCamera();
      const compressed = await compressImageToDataUrl(file);
      setPreviewUrl(compressed.dataUrl);
      setMimeType(compressed.mimeType);
      setError(null);
      setUncertaintyReason(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to process image.');
    }
  };

  const captureFromVideo = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    const maxSide = 1280;
    let w = video.videoWidth;
    let h = video.videoHeight;
    if (w > maxSide || h > maxSide) {
      if (w >= h) {
        h = Math.round((h * maxSide) / w);
        w = maxSide;
      } else {
        w = Math.round((w * maxSide) / h);
        h = maxSide;
      }
    }
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    stopCamera();
    setPreviewUrl(dataUrl);
    setMimeType('image/jpeg');
    setError(null);
    setUncertaintyReason(null);
  };

  const submitDiagnosis = async () => {
    if (!previewUrl || analyzing) return;
    if (!navigator.onLine) {
      setError('Internet connection required to run Gemini plant diagnosis.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setUncertaintyReason(null);

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewUrl,
          mimeType,
          plantHint: plantHint.trim(),
          notes: notes.trim(),
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Failed to analyze plant image.');
      }

      if (payload.isUncertain || payload.isPlantImage === false) {
        setUncertaintyReason(
          payload.uncertaintyReason ||
            'The image is unclear or does not clearly show a plant leaf or stem. Please retake a sharper close-up photo in bright natural light.',
        );
        return;
      }

      const result: DiagnosisResult = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        createdAt: new Date().toISOString(),
        imageDataUrl: previewUrl,
        isPlantImage: Boolean(payload.isPlantImage),
        isUncertain: Boolean(payload.isUncertain),
        uncertaintyReason: String(payload.uncertaintyReason ?? ''),
        plantName: String(payload.plantName || 'Unknown Plant'),
        scientificName: String(payload.scientificName ?? ''),
        isHealthy: Boolean(payload.isHealthy),
        diseaseName: String(payload.diseaseName || 'Unidentified Condition'),
        confidenceLevel: String(payload.confidenceLevel || 'Medium'),
        confidenceScore: Number(payload.confidenceScore ?? 0),
        severity: String(payload.severity || 'None'),
        diseaseDescription: String(payload.diseaseDescription ?? ''),
        symptomsDetected: Array.isArray(payload.symptomsDetected) ? payload.symptomsDetected : [],
        possibleCauses: Array.isArray(payload.possibleCauses) ? payload.possibleCauses : [],
        recommendedTreatment: String(payload.recommendedTreatment ?? ''),
        stepByStepTreatment: Array.isArray(payload.stepByStepTreatment)
          ? payload.stepByStepTreatment
          : [],
        preventionTips: Array.isArray(payload.preventionTips) ? payload.preventionTips : [],
        followUpCare: Array.isArray(payload.followUpCare) ? payload.followUpCare : [],
      };

      if (autoSaveHistory) {
        onSaveDiagnosis(result);
      }
      onDiagnosisReady(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to analyze photograph. Please check your connection and try again.',
      );
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F2417]">AI Plant Diagnosis</h1>
        <p className="mt-1 text-sm text-[#4B6353]">
          Take a close-up photo or upload an existing image from your device for Gemini disease
          analysis.
        </p>
      </div>

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          handleSelectedFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
      <input
        ref={mobileCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handleSelectedFile(e.target.files?.[0]);
          e.target.value = '';
        }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleSelectedFile(e.dataTransfer.files?.[0]);
            }}
            className={`relative overflow-hidden rounded-3xl border bg-white transition-colors ${
              dragOver ? 'border-[#16A34A] bg-[#ECFDF5]' : 'border-[#DCE8DE]'
            }`}
          >
            {cameraActive ? (
              <div className="relative h-[360px] w-full bg-black">
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-4 px-4">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-black/70 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={captureFromVideo}
                    className="inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-[#052E16] shadow-md hover:bg-[#4ADE80]"
                  >
                    <Camera className="h-5 w-5" />
                    Capture Leaf Photo
                  </button>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="relative h-[360px] w-full bg-[#0F2417]">
                <img
                  src={previewUrl}
                  alt="Plant photograph preview for AI diagnosis"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-contain"
                />
                <button
                  type="button"
                  disabled={analyzing}
                  onClick={() => {
                    setPreviewUrl(null);
                    setError(null);
                    setUncertaintyReason(null);
                  }}
                  aria-label="Remove selected image"
                  className="absolute top-3 right-3 flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-black/65 text-white hover:bg-black transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex h-[320px] flex-col items-center justify-center p-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#DCFCE7] text-[#14532D]">
                  <ScanLine className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-base font-bold text-[#0F2417]">
                  Camera Capture or Gallery Upload
                </h2>
                <p className="mt-1.5 max-w-md text-xs leading-relaxed text-[#4B6353]">
                  Hold your camera 15–30 cm away from affected leaves or stems in natural daylight,
                  or drag and drop an image file here.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={analyzing}
              onClick={openCamera}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-[#14532D] px-5 py-3 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-50 transition-colors"
            >
              <Camera className="h-4 w-4" />
              Open Camera
            </button>
            <button
              type="button"
              disabled={analyzing}
              onClick={() => galleryInputRef.current?.click()}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-5 py-3 text-sm font-semibold text-[#0F2417] hover:bg-[#F1F7F2] disabled:opacity-50 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Select from Gallery
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#DCE8DE] bg-white p-5 space-y-4">
            <h2 className="text-base font-bold text-[#0F2417]">Field Context (Optional)</h2>

            <div>
              <label
                htmlFor="plant-hint"
                className="block text-xs font-semibold text-[#3E5646] mb-1.5"
              >
                Plant or Crop Name
              </label>
              <input
                id="plant-hint"
                type="text"
                value={plantHint}
                onChange={(e) => setPlantHint(e.target.value)}
                placeholder="e.g., Tomato, Cassava, Maize, Pepper"
                className="min-h-[44px] w-full rounded-xl border border-[#DCE8DE] bg-[#F6FAF6] px-3.5 py-2 text-sm text-[#0F2417] placeholder:text-[#6B8574] focus:border-[#16A34A] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="field-notes"
                className="block text-xs font-semibold text-[#3E5646] mb-1.5"
              >
                Observed Symptoms & Conditions
              </label>
              <textarea
                id="field-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Spots appeared on older leaves after heavy rain"
                className="w-full rounded-xl border border-[#DCE8DE] bg-[#F6FAF6] px-3.5 py-2.5 text-sm text-[#0F2417] placeholder:text-[#6B8574] focus:border-[#16A34A] focus:outline-none"
              />
            </div>

            {uncertaintyReason && (
              <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="h-5 w-5 shrink-0 text-[#B45309] mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-[#92400E]">
                      Clearer Photograph Required
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#78350F]">
                      {uncertaintyReason}
                    </p>
                    <button
                      type="button"
                      onClick={openCamera}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#92400E] underline"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Retake Photo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-4">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#B91C1C] mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#991B1B]">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!previewUrl || analyzing}
              onClick={submitDiagnosis}
              className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-3 text-sm font-bold text-white hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing Plant with Gemini AI...
                </>
              ) : (
                'Analyze Plant Health'
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-[#DCE8DE] bg-white p-5">
            <h3 className="text-sm font-bold text-[#0F2417]">Photo Quality Checklist</h3>
            <ul className="mt-2.5 space-y-2 text-xs leading-relaxed text-[#3E5646]">
              <li>1. Photograph in natural daylight without harsh camera flash glare.</li>
              <li>2. Fill most of the frame with the affected leaf, stem, or pod.</li>
              <li>3. Hold steady so spots, rust pustules, or curl patterns stay sharp.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
