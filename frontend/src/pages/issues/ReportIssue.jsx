import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCloudinaryUploads } from '../../services/cloudinary';
import { useToast } from '../../context/ToastContext';
import { DashboardLayout } from '../../components/layout';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const ReportIssue = () => {
    const { isAuthenticated } = useAuth(); // Removed unused user variable
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', {
                state: {
                    from: '/report-issue',
                    message: 'Please login to report an issue'
                }
            });
        }
    }, [isAuthenticated, navigate]);

    // Camera refs
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        address: '',
        latitude: '',
        longitude: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [videoStream, setVideoStream] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null); // Data URL for preview
    const [capturedBlob, setCapturedBlob] = useState(null);   // Blob for upload
    const [capturedMeta, setCapturedMeta] = useState({ width: 0, height: 0, size: 0 });

    // Categories for dropdown - updated to match backend
    const categories = [
        'Roads & Infrastructure',
        'Waste Management',
        'Electricity',
        'Water Supply',
        'Sewage & Drainage',
        'Traffic & Transportation',
        'Public Safety',
        'Parks & Recreation',
        'Street Lighting',
        'Noise Pollution',
        'Other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Camera controls
    const ensureVideoReady = () => new Promise((resolve, reject) => {
        const video = videoRef.current;
        if (!video) {
            // Defer until next frame to allow render to place the element
            let waited = 0;
            const tick = () => {
                const v = videoRef.current;
                if (v && v.videoWidth > 0 && v.videoHeight > 0) return resolve();
                waited += 100;
                if (waited >= 1500) return reject(new Error('Camera ready timeout'));
                setTimeout(tick, 100);
            };
            return tick();
        }
        if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) return resolve();
        const onLoaded = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                cleanup();
                resolve();
            }
        };
        const onCanPlay = () => { if (video.videoWidth > 0 && video.videoHeight > 0) { cleanup(); resolve(); } };
        const onTimeout = setTimeout(() => { cleanup(); reject(new Error('Camera ready timeout')); }, 4000);
        const cleanup = () => {
            clearTimeout(onTimeout);
            video.removeEventListener('loadeddata', onLoaded);
            video.removeEventListener('canplay', onCanPlay);
        };
        video.addEventListener('loadeddata', onLoaded);
        video.addEventListener('canplay', onCanPlay);
    });

    const startCamera = async () => {
        try {
            // Stop any existing stream before starting a new one
            if (videoStream) {
                videoStream.getTracks().forEach(t => t.stop());
            }

            // Prefer back camera + decent resolution
            const constraints = {
                video: {
                    facingMode: { ideal: 'environment' },
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            };

            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch {
                // Fallback to any available camera
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            }

            // Set state first so <video> is rendered, attach stream in effect below
            setVideoStream(stream);
            setIsCameraOn(true);
            setCapturedPhoto(null);
            setCapturedBlob(null);

            // Allow UI to render before we check readiness
            setTimeout(() => {
                ensureVideoReady().catch(() => {
                    setErrors(prev => ({ ...prev, images: 'Camera not ready yet. Please wait a moment and try again.' }));
                });
            }, 0);
        } catch (err) {
            console.error('Camera access error:', err);
            const isInsecure = typeof window !== 'undefined' && window.location.protocol !== 'https:' && window.location.hostname !== 'localhost';
            const hint = isInsecure ? ' Note: Camera requires HTTPS on non-localhost.' : '';
            setErrors(prev => ({ ...prev, images: `Unable to access camera. Please allow camera permissions.${hint}` }));
        }
    };

    const stopCamera = () => {
        if (videoStream) {
            videoStream.getTracks().forEach(t => t.stop());
            setVideoStream(null);
        }
        setIsCameraOn(false);
    };

    const capturePhoto = async () => {
        try {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            if (!video || !canvas) return;

            // Ensure metadata is loaded so dimensions are valid
            if (!(video.videoWidth > 0 && video.videoHeight > 0)) {
                try { await ensureVideoReady(); } catch {
                    setErrors(prev => ({ ...prev, images: 'Camera not ready yet. Please wait a moment and try again.' }));
                    return;
                }
            }

            const width = video.videoWidth || 640;
            const height = video.videoHeight || 480;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, width, height);

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9));
            if (!blob) {
                setErrors(prev => ({ ...prev, images: 'Failed to capture photo. Please try again.' }));
                return;
            }
            setCapturedBlob(blob);
            setCapturedMeta({ width, height, size: blob.size });

            const reader = new FileReader();
            reader.onloadend = () => setCapturedPhoto(reader.result);
            reader.readAsDataURL(blob);

            // Freeze camera to emphasize the captured preview
            stopCamera();

            // Capture geolocation at capture time
            setIsUsingCurrentLocation(true);
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const { latitude, longitude } = pos.coords;
                        setFormData(prev => ({
                            ...prev,
                            latitude: latitude.toString(),
                            longitude: longitude.toString(),
                            address: `Coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                        }));
                        setIsUsingCurrentLocation(false);
                    },
                    (geoErr) => {
                        console.error('Geolocation error:', geoErr);
                        setErrors(prev => ({ ...prev, location: 'Unable to fetch location. Please enable location access.' }));
                        setIsUsingCurrentLocation(false);
                    }
                );
            } else {
                setErrors(prev => ({ ...prev, location: 'Geolocation not supported on this device.' }));
                setIsUsingCurrentLocation(false);
            }
        } catch (err) {
            console.error('Capture error:', err);
            setErrors(prev => ({ ...prev, images: 'Failed to capture photo. Please try again.' }));
        }
    };

    // Attach stream to video element after it renders
    useEffect(() => {
        const attach = async () => {
            if (!isCameraOn || !videoStream) return;
            const video = videoRef.current;
            if (!video) return;
            try {
                video.setAttribute('playsinline', 'true');
                video.setAttribute('autoplay', 'true');
                video.setAttribute('muted', 'true');
                if (video.srcObject !== videoStream) {
                    video.srcObject = videoStream;
                }
                await video.play();
            } catch {
                // Will retry on metadata/canplay
            }
        };
        attach();
    }, [isCameraOn, videoStream]);

    const retakePhoto = () => {
        setCapturedPhoto(null);
        setCapturedBlob(null);
        setCapturedMeta({ width: 0, height: 0, size: 0 });
        if (!isCameraOn) startCamera();
    };

    // Stop camera on unmount to release device resources
    useEffect(() => {
        return () => {
            if (videoStream) {
                videoStream.getTracks().forEach(t => t.stop());
            }
        };
    }, [videoStream]);

    // Location is automatically captured when photo is taken

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.trim().length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.trim().length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        // Require coordinates and one captured image
        if (!formData.latitude || !formData.longitude) {
            newErrors.location = 'Location is required and is captured when you take a photo.';
        }
        if (!capturedBlob) {
            newErrors.images = 'Please capture a photo using the camera.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const { uploadWithToast } = useCloudinaryUploads();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // If we have a captured blob, upload it to Cloudinary first (direct)
            let imageUrls = [];
            if (capturedBlob) {
                try {
                    const file = new File([capturedBlob], 'capture.jpg', { type: capturedBlob.type || 'image/jpeg' });
                    const url = await uploadWithToast(file);
                    imageUrls.push(url);
                } catch (upErr) {
                    console.error('Cloudinary upload failed:', upErr);
                }
            }

            // Add location data as JSON string
            const hasCoords = formData.latitude && formData.longitude;
            const locationData = {
                coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
                // Ensure address is provided (backend requires it)
                address: formData.address && formData.address.trim()
                    ? formData.address
                    : (hasCoords
                        ? `Coordinates: ${parseFloat(formData.latitude)}, ${parseFloat(formData.longitude)}`
                        : ''),
                city: '', // You might want to extract this from address
                state: '', // You might want to extract this from address
                pincode: '' // You might want to extract this from address
            };
            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                location: locationData,
                images: imageUrls
            };

            const { data: result } = await api.post('/issues', payload);

            if (result && result.success) {
                toast.push('Issue reported successfully', { type: 'success' });
                // Navigate to dashboard
                navigate('/dashboard', {
                    state: {
                        issueSubmitted: true,
                        message: result.message || 'Your issue has been successfully reported. You can track its status from your dashboard.'
                    }
                });
            } else {
                throw new Error(result?.message || 'Failed to submit issue');
            }
        } catch (err) {
            console.error('Error submitting issue:', err);
            setErrors(prev => ({ ...prev, general: err?.response?.data?.message || err.message || 'Failed to submit issue' }));
            toast.push('Failed to report issue', { type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="container">
                <div className="page-header">
                    <h1>Report an Issue</h1>
                    <p>
                        Report a civic issue in your community and help make your neighborhood better.
                    </p>
                </div>

                <div className="report-issue-container">
                    {errors.general && (
                        <div className="alert alert-danger">{errors.general}</div>
                    )}

                    <form onSubmit={handleSubmit} className="report-form">
                        <div className="form-group">
                            <label htmlFor="title">Issue Title *</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={errors.title ? 'input-error' : ''}
                                placeholder="Enter a brief, descriptive title"
                                disabled={isSubmitting}
                            />
                            {errors.title && <div className="error-message">{errors.title}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className={errors.description ? 'input-error' : ''}
                                placeholder="Provide details about the issue"
                                rows="4"
                                disabled={isSubmitting}
                            ></textarea>
                            {errors.description && <div className="error-message">{errors.description}</div>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={errors.category ? 'input-error' : ''}
                                disabled={isSubmitting}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category && <div className="error-message">{errors.category}</div>}
                        </div>

                        <div className="form-group">
                            <label>Camera & Location *</label>
                            <div className="camera-container">
                                {!isCameraOn && !capturedPhoto && (
                                    <button
                                        type="button"
                                        className="btn btn-outline"
                                        onClick={startCamera}
                                        disabled={isSubmitting}
                                    >
                                        Open Camera
                                    </button>
                                )}

                                {isCameraOn && (
                                    <div className="camera-view">
                                        <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxWidth: 480, borderRadius: 8 }} />
                                        <div className="camera-actions">
                                            <button
                                                type="button"
                                                className="btn btn-primary"
                                                onClick={capturePhoto}
                                                disabled={isSubmitting || isUsingCurrentLocation}
                                            >
                                                {isUsingCurrentLocation ? 'Capturing…' : 'Capture Photo'}
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-outline"
                                                onClick={stopCamera}
                                                disabled={isSubmitting}
                                            >
                                                Stop Camera
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {capturedPhoto && (
                                    <div className="capture-preview">
                                        <img src={capturedPhoto} alt="Captured" style={{ width: '100%', maxWidth: 480, borderRadius: 8 }} />
                                        <div className="capture-details" style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
                                            {capturedMeta.width && capturedMeta.height && (
                                                <span>
                                                    {capturedMeta.width}×{capturedMeta.height}px · {(capturedMeta.size / 1024).toFixed(1)} KB
                                                </span>
                                            )}
                                        </div>
                                        <div className="camera-actions">
                                            <button type="button" className="btn btn-outline" onClick={retakePhoto} disabled={isSubmitting}>
                                                Retake
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <canvas ref={canvasRef} style={{ display: 'none' }} />
                            </div>
                            {errors.images && <div className="error-message">{errors.images}</div>}
                            <div className="location-summary" style={{ marginTop: 8 }}>
                                <strong>Location:</strong>{' '}
                                {formData.latitude && formData.longitude
                                    ? `${formData.address || 'Coordinates captured'}`
                                    : 'Will be captured when you take a photo'}
                            </div>
                            {errors.location && <div className="error-message">{errors.location}</div>}
                        </div>

                        {/* Upload removed: only live camera capture is allowed */}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => navigate(-1)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Issue'}
                            </button>
                        </div>
                    </form>

                    <div className="report-guidelines">
                        <h3>Guidelines for Reporting</h3>
                        <ul>
                            <li>Be clear and specific about the issue</li>
                            <li>Include photos to help officials understand the problem</li>
                            <li>Provide accurate location information</li>
                            <li>Avoid including personal information of others</li>
                            <li>Report emergency situations to appropriate authorities directly</li>
                        </ul>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReportIssue;
