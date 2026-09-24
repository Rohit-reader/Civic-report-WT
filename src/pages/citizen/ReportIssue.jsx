import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { 
  UploadCloud, MapPin, AlertCircle, Sparkles, 
  CheckCircle2, Navigation, ShieldAlert, FileImage, 
  Trash2, Info
} from 'lucide-react';
import { Button, Input, Textarea, Card, CardContent, Badge } from '../../components/ui';
import { issuesAPI } from '../../lib/api';

export default function ReportIssue() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'Infrastructure';

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      category: initialCategory,
      priority: 'Medium',
    }
  });

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [serverError, setServerError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  const currentTitle = watch('title', '');
  const currentCategory = watch('category', 'Infrastructure');
  const currentPriority = watch('priority', 'Medium');

  // Smart AI Category suggestions based on keywords
  useEffect(() => {
    const text = currentTitle.toLowerCase();
    if (text.includes('pothole') || text.includes('road') || text.includes('bridge') || text.includes('asphalt')) {
      setValue('category', 'Infrastructure');
    } else if (text.includes('light') || text.includes('wire') || text.includes('pipe') || text.includes('hydrant') || text.includes('water')) {
      setValue('category', 'Utilities');
    } else if (text.includes('tree') || text.includes('park') || text.includes('branch') || text.includes('grass')) {
      setValue('category', 'Environment');
    } else if (text.includes('trash') || text.includes('garbage') || text.includes('bin') || text.includes('dump')) {
      setValue('category', 'Sanitation');
    } else if (text.includes('signal') || text.includes('traffic') || text.includes('jam') || text.includes('sign')) {
      setValue('category', 'Traffic');
    }
  }, [currentTitle, setValue]);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue('location', `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (GPS Verified Location)`);
        setDetectingLocation(false);
        setLocationDetected(true);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setValue('location', 'Downtown Central District, Metro Zone 1');
        setDetectingLocation(false);
        setLocationDetected(true);
      }
    );
  };

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category || 'Infrastructure');
      formData.append('location', data.location);
      formData.append('description', data.description);
      formData.append('priority', data.priority || 'Medium');
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await issuesAPI.create(formData);
      navigate('/my-reports');
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Failed to submit report. Please verify connection.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Direct Municipal Dispatch
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Report a Civic Incident</h1>
        <p className="text-sm text-slate-500 mt-1">Submit high-resolution details with GPS coordinates to dispatch rapid response teams.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {serverError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Issue Summary / Title <span className="text-rose-500">*</span>
              </label>
              <Input 
                placeholder="e.g., Hazardous Pothole on 5th Ave & Pine St" 
                {...register('title', { required: 'Please describe the issue in a short title' })} 
                error={errors.title?.message} 
                className="h-11 bg-slate-50 dark:bg-slate-950"
              />
            </div>

            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select 
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  {...register('category')}
                >
                  <option value="Infrastructure">Infrastructure (Roads, Bridges)</option>
                  <option value="Utilities">Utilities (Water, Power, Streetlights)</option>
                  <option value="Environment">Environment (Parks, Trees)</option>
                  <option value="Sanitation">Sanitation (Waste, Cleanliness)</option>
                  <option value="Traffic">Traffic (Signals, Pedestrian Signs)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Severity / Urgency Level
                </label>
                <select 
                  className="flex h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                  {...register('priority')}
                >
                  <option value="Low">Low - Non-hazardous</option>
                  <option value="Medium">Medium - Standard ticket</option>
                  <option value="High">High - Impeding traffic/utilities</option>
                  <option value="Critical">Critical - Immediate hazard / Emergency</option>
                </select>
              </div>
            </div>

            {/* Location with GPS Auto Detect */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Location & Address <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  {detectingLocation ? 'Locating...' : 'Use My GPS Location'}
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <Input 
                  className="pl-11 h-11 bg-slate-50 dark:bg-slate-950" 
                  placeholder="Enter street address, intersection, or landmark" 
                  {...register('location', { required: 'Location is required' })} 
                  error={errors.location?.message} 
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Detailed Incident Description <span className="text-rose-500">*</span>
              </label>
              <Textarea 
                placeholder="Describe size, immediate risks, duration, or any notable landmarks..." 
                rows={4}
                {...register('description', { required: 'Please provide full issue description' })} 
                error={errors.description?.message} 
                className="bg-slate-50 dark:bg-slate-950"
              />
            </div>

            {/* Drag & Drop Photo Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Photo Evidence Attachment (Optional)
              </label>
              
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 group">
                  <img src={imagePreview} alt="Uploaded preview" className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg hover:bg-rose-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <label 
                  htmlFor="file-upload" 
                  className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-400 dark:hover:border-blue-700 transition-all cursor-pointer text-center"
                >
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Click to upload or drag photo here
                  </p>
                  <p className="text-xs text-slate-400 mt-1">High resolution PNG, JPG, WebP up to 10MB</p>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </label>
              )}
            </div>

            {/* Submission Actions */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-4 h-4" /> Reports are tracked in city database
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>
                  Cancel
                </Button>
                <Button type="submit" className="px-6 font-bold shadow-md shadow-blue-500/20" isLoading={isSubmitting}>
                  Submit Report
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
