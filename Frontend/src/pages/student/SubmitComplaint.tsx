import React, { useRef, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import Input from '../../components/shared/Input';
import Select from '../../components/shared/Select';
import Button from '../../components/shared/Button';
import { useForm } from 'react-hook-form';
import { CATEGORIES } from '../../utils/constants';
import { showToast } from '../../components/shared/Toast';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createComplaintApi } from '../../api/complaintsApi';

interface SubmitForm {
  title: string;
  description: string;
  category: string;
  priority: string;
}

const SubmitComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SubmitForm>();
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);
  const title = watch('title', '');
  const description = watch('description', '');

  const onSubmit = async (data: SubmitForm) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('priority', data.priority);
    if (file) formData.append('attachment', file);

    try {
      await createComplaintApi(formData);
      showToast('Complaint submitted successfully', 'success');
      navigate('/student/complaints');
    } catch (e: any) {
      const backendErrors = e?.response?.data?.errors;
      const firstValidationMessage = Array.isArray(backendErrors) && backendErrors.length > 0 ? backendErrors[0]?.msg : null;
      showToast(firstValidationMessage || e?.response?.data?.message || 'Submission failed', 'error');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    validateAndSetFile(f);
  };

  const validateAndSetFile = (f: File | undefined) => {
    if (!f) return;
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowed.includes(f.type)) { showToast('Only JPG, PNG and PDF files are allowed', 'error'); return; }
    if (f.size > 5 * 1024 * 1024) { showToast('File must be under 5MB', 'error'); return; }
    setFile(f);
  };

  return (
    <MainLayout>
      <h1 className="text-xl font-medium tracking-tight mb-8">Submit a Complaint</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="flex-[3] space-y-5">
          <div>
            <Input label="Title" placeholder="Brief summary of your complaint" error={errors.title?.message}
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 10, message: 'Title must be at least 10 characters' },
                maxLength: { value: 100, message: 'Title must be at most 100 characters' },
              })} />
            <p className="text-xs text-text-muted text-right mt-1">{title.length}/100</p>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">Description</label>
            <textarea
              className="w-full min-h-[120px] rounded-md bg-elevated border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors resize-y"
              placeholder="Describe your issue in detail..."
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters' },
                maxLength: { value: 500, message: 'Description must be at most 500 characters' },
              })}
            />
            <p className="text-xs text-text-muted text-right mt-1">{description.length}/500</p>
            {errors.description && <span className="text-xs text-danger">{errors.description.message}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Category" placeholder="Select category"
              options={CATEGORIES.map((c) => ({ value: c, label: c }))}
              error={errors.category?.message}
              {...register('category', { required: 'Category is required' })} />
            <div>
              <Select label="Priority" placeholder="Select priority"
                options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }]}
                error={errors.priority?.message}
                {...register('priority', { required: 'Priority is required' })} />
              <p className="text-xs text-text-secondary mt-1">Critical issues are automatically detected</p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-secondary mb-1.5 block">Attachment</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('file-input')?.click()}
              className="border border-dashed border-border rounded-md p-6 text-center hover:bg-elevated transition-colors"
            >
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  {file.type.startsWith('image') ? <ImageIcon className="w-5 h-5 text-accent" /> : <FileText className="w-5 h-5 text-accent" />}
                  <span className="text-sm text-text-primary">{file.name}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs text-danger ml-2">Remove</button>
                </div>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Drag & drop or click to upload</p>
                  <p className="text-xs text-text-muted mt-1">JPG, PNG, PDF — max 5MB</p>
                </>
              )}
            </div>
            <input id="file-input" type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => validateAndSetFile(e.target.files?.[0])} />
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" className="w-full sm:w-auto" onClick={() => navigate(-1)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </div>
        </form>

        <div className="flex-[2] w-full order-last lg:order-none">
          <div className="bg-elevated rounded-lg p-5 lg:sticky lg:top-7">
            <h3 className="text-sm font-medium mb-3">Before you submit</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>• Be specific about the issue and include relevant details</li>
              <li>• Attach supporting documents or photos if available</li>
              <li>• Check if a similar complaint has already been filed</li>
              <li>• You'll receive updates via email and your dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SubmitComplaint;
