import { useState, useEffect, useRef } from 'react';
import profileService from '../services/profileService';
import { useAuth } from '../../../features/auth/AuthProvider';

export const useProfile = () => {
    const { user } = useAuth();
    
    // Core States
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form & UI States
    const [formData, setFormData] = useState({ name: '', fullName: '', phone: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [actionError, setActionError] = useState(''); // Lỗi khi submit hoặc upload
    
    // Ref cho thẻ input file
    const fileInputRef = useRef(null);

    // 1. Fetch data ban đầu
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await profileService.getProfile();
                setProfile(response.data);
                // Đồng bộ data lấy được vào form
                setFormData({
                    name: response.data.name || '',
                    fullName: response.data.fullName || '',
                    phone: response.data.phone || ''
                });
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    // 2. Logic xử lý gõ phím vào Form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 3. Logic xử lý Submit Form
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');
        setActionError('');
        
        try {
            const response = await profileService.updateProfile(formData.name, formData.fullName, formData.phone);
            setProfile(response.data); // Cập nhật lại state profile mới nhất
            setSuccessMessage('Cập nhật hồ sơ thành công!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setActionError('Cập nhật thất bại. Vui lòng kiểm tra lại.');
            console.error("Lỗi cập nhật profile:", err);
        } finally {
            setIsSaving(false);
        }
    };

    // 4. Logic mở cửa sổ chọn file
    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // 5. Logic xử lý khi chọn xong ảnh
    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setSuccessMessage('');
        setActionError('');
        
        try {
            const response = await profileService.addImage(file);
            // Cập nhật imageUrl vào profile hiện tại
            setProfile(prev => ({ ...prev, imageUrl: response.data.imageUrl }));
            setSuccessMessage('Cập nhật ảnh đại diện thành công!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setActionError('Lỗi tải ảnh lên. Vui lòng thử lại.');
            console.error("Lỗi upload ảnh:", err);
        } finally {
            setIsUploading(false);
            // Reset input file để có thể chọn lại đúng file đó nếu muốn
            if (e.target) e.target.value = null; 
        }
    };

    // Trả về TẤT CẢ mọi thứ mà Component UI cần
    return {
        profile,
        loading,
        error,
        formData,
        isSaving,
        isUploading,
        successMessage,
        actionError,
        fileInputRef,
        handleInputChange,
        handleSubmit,
        handleImageClick,
        handleImageChange
    };
};