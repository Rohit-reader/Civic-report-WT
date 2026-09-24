import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { UploadCloud, MapPin, AlertCircle } from 'lucide-react';
import { Button, Input, Textarea, Card, CardContent } from '../../components/ui';
import { issuesAPI } from '../../lib/api';

export default function ReportIssue() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('category', data.category || 'Infrastructure');
      formData.append('location', data.location);
      formData.append('description', data.description);
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      await issuesAPI.create(formData);
      navigate('/my-reports');
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || 'Failed to submit report.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Report an Issue</h1>
        <p className="text-slate-500 mt-1">Provide details about the civic issue to help us resolve it quickly.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          {serverError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Issue Title</label>
                <Input placeholder="e.g., Large pothole on Main St" {...register('title', { required: 'Title is required' })} error={errors.title?.message} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  {...register('category')}
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Environment">Environment</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input className="pl-10" placeholder="Enter street address or drag map pin" {...register('location', { required: 'Location is required' })} error={errors.location?.message} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <Textarea placeholder="Describe the issue in detail..." {...register('description', { required: 'Description is required' })} error={errors.description?.message} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Photo Upload</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md dark:border-slate-700 hover:border-blue-500 transition-colors">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="relative w-full h-48 mb-4">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                        <button type="button" onClick={() => setImagePreview(null)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full px-3 py-1 text-xs hover:bg-red-700">Remove</button>
                      </div>
                    ) : (
                      <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    )}
                    <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none dark:bg-slate-900">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => navigate('/dashboard')}>Cancel</Button>
              <Button type="submit" isLoading={isSubmitting}>Submit Report</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
