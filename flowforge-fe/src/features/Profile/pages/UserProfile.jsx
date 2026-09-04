import React from 'react';
import { useProfile } from '../../Profile/hook/useProfile.js'; // Đường dẫn tới hook mới
import './UserProfile.css'; // File CSS giữ nguyên như trước
import { Link } from 'react-router-dom';
const UserProfile = () => {
    // Gọi hook và lấy toàn bộ vũ khí ra xài
    const {
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
    } = useProfile();

    // -- Hiển thị UI khi đang Loading --
    if (loading) {
        return (
            <div className="fluid-wrapper h-screen flex-center">
                <div className="premium-loader"></div>
            </div>
        );
    }

    // -- Hiển thị UI khi lỗi hệ thống --
    if (error && !profile) {
        return (
            <div className="fluid-wrapper h-screen flex-center">
                <p className="error-text">Đã có lỗi xảy ra khi tải hồ sơ. Vui lòng thử lại sau.</p>
            </div>
        );
    }

    // -- Hiển thị UI Chính --
    return (
        <div className="fluid-wrapper profile-page">
            <div className="profile-container relative-z-index">
                <Link to="/" className="profile-back-link">‹ Back to Home</Link>
                <div className="profile-header">
                    <h2>Hồ Sơ Của Tôi</h2>
                    <p>Quản lý thông tin cá nhân để bảo mật tài khoản</p>
                </div>

                <div className="profile-content">
                    {/* Cột trái: Avatar */}
                    <div className="profile-avatar-section">
                        <div className="avatar-wrapper" onClick={handleImageClick}>
                            {profile?.avatarUrl ? (
                                <img src={profile.avatarUrl} alt="Avatar" className="avatar-image" />
                            ) : (
                                <div className="avatar-placeholder">
                                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            
                            <div className="avatar-overlay">
                                <span>{isUploading ? 'Đang tải...' : 'Đổi Ảnh'}</span>
                            </div>
                        </div>
                        {/* Ẩn input file đi, bấm vào avatar sẽ trigger input này qua ref */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                            accept="avatar/*" 
                            hidden 
                        />
                        <p className="avatar-hint">Định dạng JPEG, PNG. Tối đa 2MB.</p>
                    </div>

                    {/* Cột phải: Form thông tin */}
                    <div className="profile-form-section">
                        <form onSubmit={handleSubmit} className="premium-form">
                            <div className="form-group">
                                <label htmlFor="name">Username</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tên đăng nhập"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fullName">Họ và Tên</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Nhập họ và tên đầy đủ"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            {/* Các thông báo trạng thái */}
                            {successMessage && <div className="success-message">{successMessage}</div>}
                            {actionError && <div className="error-message">{actionError}</div>}

                            <button type="submit" className="premium-btn" disabled={isSaving || isUploading}>
                                {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;