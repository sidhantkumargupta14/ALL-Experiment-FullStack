import React, { useState, useEffect } from 'react';

// ============================================================
// PLATFORM RULES
// ============================================================

const PLATFORM_RULES = {
    twitter: {
        id: 'twitter',
        name: 'Twitter/X',
        icon: '🐦',
        charLimit: 18,
        maxImages: 4,
    },
    instagram: {
        id: 'instagram',
        name: 'Instagram',
        icon: '📸',
        charLimit: 45,
        maxImages: 10,
    },
    facebook: {
        id: 'facebook',
        name: 'Facebook',
        icon: '📘',
        charLimit: 40,
        maxImages: 10,
    },
    linkedin: {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: '💼',
        charLimit: 50,
        maxImages: 9,
    },
    threads: {
        id: 'threads',
        name: 'Threads',
        icon: '🧵',
        charLimit: 60,
        maxImages: 10,
    }
};

// ============================================================
// DRAFT STORAGE
// ============================================================

const STORAGE_KEY = 'post_drafts';

const getDraftsFromStorage = () => {
    try {
        const drafts = localStorage.getItem(STORAGE_KEY);
        return drafts ? JSON.parse(drafts) : [];
    } catch {
        return [];
    }
};

const saveDraftToStorage = (draft) => {
    const drafts = getDraftsFromStorage();
    drafts.push(draft);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
    return draft;
};

const updateDraftInStorage = (id, updatedData) => {
    const drafts = getDraftsFromStorage();
    const index = drafts.findIndex(d => d.id === id);
    if (index !== -1) {
        drafts[index] = { ...drafts[index], ...updatedData, updatedAt: new Date().toISOString() };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
        return drafts[index];
    }
    return null;
};

const deleteDraftFromStorage = (id) => {
    const drafts = getDraftsFromStorage();
    const filtered = drafts.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
};

// ============================================================
// MAIN APP
// ============================================================

function App() {
    const [selectedPlatforms, setSelectedPlatforms] = useState(['twitter']);
    const [postContent, setPostContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState([]);
    const [isPosting, setIsPosting] = useState(false);
    const [editingDraftId, setEditingDraftId] = useState(null);
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDrafts();
    }, []);

    const loadDrafts = () => {
        setLoading(true);
        setError(null);
        try {
            setDrafts(getDraftsFromStorage());
        } catch (err) {
            setError('Error loading drafts: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveDraft = () => {
        if (postContent.trim().length === 0) {
            alert('Please write some content before saving as draft.');
            return;
        }

        const draftData = {
            content: postContent,
            platforms: selectedPlatforms,
            media: mediaFiles.map(f => f.name)
        };

        setLoading(true);
        try {
            if (editingDraftId) {
                const updated = updateDraftInStorage(editingDraftId, draftData);
                if (updated) {
                    setDrafts(prev => prev.map(d => d.id === editingDraftId ? updated : d));
                    alert('✅ Draft updated successfully!');
                    setEditingDraftId(null);
                }
            } else {
                const newDraft = {
                    id: Date.now().toString(),
                    ...draftData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                saveDraftToStorage(newDraft);
                setDrafts(prev => [newDraft, ...prev]);
                alert('✅ Draft saved successfully!');
            }
            setPostContent('');
            setMediaFiles([]);
            setSelectedPlatforms(['twitter']);
        } catch (err) {
            setError('Failed to save draft: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditDraft = (draftId) => {
        const draft = drafts.find(d => d.id === draftId);
        if (draft) {
            setPostContent(draft.content);
            setSelectedPlatforms(draft.platforms);
            setMediaFiles(draft.media.map(name => ({ name })));
            setEditingDraftId(draftId);
            document.querySelector('.composer-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleDeleteDraft = (draftId) => {
        if (!window.confirm('Are you sure you want to delete this draft?')) return;
        setLoading(true);
        try {
            deleteDraftFromStorage(draftId);
            setDrafts(prev => prev.filter(d => d.id !== draftId));
            if (editingDraftId === draftId) {
                setEditingDraftId(null);
                setPostContent('');
                setMediaFiles([]);
            }
        } catch (err) {
            setError('Failed to delete draft: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePublishDraft = async (draftId) => {
        const draft = drafts.find(d => d.id === draftId);
        if (draft) {
            setIsPosting(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            alert(`🚀 Published "${draft.content.substring(0, 50)}..." to ${draft.platforms.length} platforms!`);
            setIsPosting(false);
            await handleDeleteDraft(draftId);
        }
    };

    const cancelEditing = () => {
        setEditingDraftId(null);
        setPostContent('');
        setMediaFiles([]);
        setSelectedPlatforms(['twitter']);
    };

    const handlePublish = async () => {
        if (postContent.trim().length === 0) {
            alert('Please write some content before publishing.');
            return;
        }

        const errors = validatePost();
        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return;
        }

        setIsPosting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        alert(`✅ Post published to ${selectedPlatforms.length} platforms!`);
        setIsPosting(false);
        setPostContent('');
        setMediaFiles([]);
        setSelectedPlatforms(['twitter']);
    };

    const validatePost = () => {
        const errors = [];
        const charCount = postContent.length;
        selectedPlatforms.forEach(platformId => {
            const rule = PLATFORM_RULES[platformId];
            if (charCount > rule.charLimit) {
                errors.push(`${rule.name}: Exceeds limit by ${charCount - rule.charLimit} characters`);
            }
        });
        return errors;
    };

    const getCharInfo = (platformId) => {
        const rule = PLATFORM_RULES[platformId];
        const count = postContent.length;
        const limit = rule.charLimit;
        const percentage = (count / limit) * 100;
        let color = '#22c55e';
        if (percentage >= 100) color = '#ef4444';
        else if (percentage >= 90) color = '#eab308';
        else if (percentage >= 70) color = '#f97316';
        return { count, limit, percentage, color };
    };

    const hasErrors = () => {
        return validatePost().length > 0;
    };

    const togglePlatform = (platformId) => {
        if (selectedPlatforms.includes(platformId)) {
            if (selectedPlatforms.length === 1) return;
            setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
        } else {
            setSelectedPlatforms([...selectedPlatforms, platformId]);
        }
    };

    const handleMediaUpload = (e) => {
        const files = Array.from(e.target.files);
        setMediaFiles([...mediaFiles, ...files]);
    };

    const removeMedia = (index) => {
        setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>✏️ Multi-Platform Post Composer</h1>
                <p style={styles.subtitle}>Write once, publish everywhere</p>

                {/* Platform Selection */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>📱 Select Platforms</h3>
                    <div style={styles.platformGrid}>
                        {Object.values(PLATFORM_RULES).map(platform => (
                            <button
                                key={platform.id}
                                style={{
                                    ...styles.platformBtn,
                                    ...(selectedPlatforms.includes(platform.id) ? styles.platformBtnSelected : {})
                                }}
                                onClick={() => togglePlatform(platform.id)}
                            >
                                <span style={styles.platformIcon}>{platform.icon}</span>
                                <span>{platform.name}</span>
                                <span style={styles.platformLimit}>{platform.charLimit} chars</span>
                                {selectedPlatforms.includes(platform.id) && (
                                    <span style={styles.checkMark}>✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                    <div style={styles.selectedSummary}>
                        <span>Posting to: </span>
                        {selectedPlatforms.map(id => (
                            <span key={id} style={styles.platformTag}>
                                {PLATFORM_RULES[id].icon} {PLATFORM_RULES[id].name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Character Counters */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>📝 Character Limits</h3>
                    {selectedPlatforms.map(id => {
                        const info = getCharInfo(id);
                        return (
                            <div key={id} style={styles.counterContainer}>
                                <div style={styles.counterHeader}>
                                    <span>{PLATFORM_RULES[id].icon} {PLATFORM_RULES[id].name}</span>
                                    <span style={{ color: info.color, fontWeight: 'bold' }}>
                                        {info.count} / {info.limit}
                                    </span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div style={{
                                        ...styles.progressFill,
                                        width: `${Math.min(info.percentage, 100)}%`,
                                        backgroundColor: info.color
                                    }} />
                                </div>
                                {info.count > info.limit && (
                                    <div style={styles.errorMsg}>
                                        ⚠️ Exceeded by {info.count - info.limit} characters
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Content Input */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>✍️ Write Your Post</h3>
                    <textarea
                        style={styles.textarea}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder={`Write your post here... (${selectedPlatforms.length} platforms selected)`}
                        rows={6}
                    />
                    {editingDraftId && (
                        <div style={styles.editingBadge}>
                            ✏️ Editing Draft #{editingDraftId}
                            <button style={styles.cancelEditBtn} onClick={cancelEditing}>Cancel</button>
                        </div>
                    )}
                </div>

                {/* Media Upload */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>📎 Add Media</h3>
                    <div style={styles.uploadArea}>
                        <input
                            type="file"
                            id="media-upload"
                            multiple
                            accept="image/*,video/*"
                            onChange={handleMediaUpload}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="media-upload" style={styles.uploadBtn}>
                            📤 Choose Files
                        </label>
                        <span style={styles.uploadHint}>
                            Max {Math.max(...selectedPlatforms.map(id => PLATFORM_RULES[id].maxImages))} images
                        </span>
                    </div>
                    {mediaFiles.length > 0 && (
                        <div style={styles.mediaPreview}>
                            {mediaFiles.map((file, index) => (
                                <div key={index} style={styles.mediaItem}>
                                    {file.type?.startsWith('image/') ? (
                                        <img src={URL.createObjectURL(file)} alt={file.name} style={styles.mediaThumb} />
                                    ) : (
                                        <div style={styles.mediaPlaceholder}>🎬 Video</div>
                                    )}
                                    <button style={styles.removeMedia} onClick={() => removeMedia(index)}>✕</button>
                                    <div style={styles.mediaInfo}>
                                        <span>{file.name}</span>
                                        <span>{(file.size / 1024).toFixed(0)} KB</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Validation Messages */}
                {validatePost().length > 0 && (
                    <div style={styles.section}>
                        <h3 style={styles.sectionTitle}>⚠️ Validation Errors</h3>
                        {validatePost().map((error, index) => (
                            <div key={index} style={styles.validationError}>
                                🔴 {error}
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div style={styles.actionSection}>
                    <div style={styles.actionButtons}>
                        <button
                            style={{
                                ...styles.draftBtn,
                                ...(postContent.trim().length === 0 ? styles.disabledBtn : {})
                            }}
                            onClick={handleSaveDraft}
                            disabled={postContent.trim().length === 0 || loading}
                        >
                            💾 Save as Draft
                        </button>
                        {editingDraftId && (
                            <button style={styles.cancelEditBtn} onClick={cancelEditing}>
                                ❌ Cancel Edit
                            </button>
                        )}
                        <button
                            style={{
                                ...styles.publishBtn,
                                ...(hasErrors() || postContent.trim().length === 0 ? styles.disabledBtn : {})
                            }}
                            onClick={handlePublish}
                            disabled={hasErrors() || postContent.trim().length === 0 || isPosting || loading}
                        >
                            {isPosting ? '🔄 Publishing...' : '🚀 Publish'}
                        </button>
                    </div>
                    <div style={styles.stats}>
                        <span>📊 Characters: {postContent.length}</span>
                        <span>📎 Media: {mediaFiles.length}</span>
                        <span>🎯 Platforms: {selectedPlatforms.length}</span>
                        {editingDraftId && <span style={styles.editingBadge}>✏️ Editing</span>}
                    </div>
                </div>

                {/* ============================================================
                DRAFT LIST - FIXED TEXT WRAPPING
                ============================================================ */}
                <div style={styles.draftSection}>
                    <div style={styles.draftHeader}>
                        <h2 style={styles.draftTitle}>📂 My Drafts ({drafts.length})</h2>
                        <button style={styles.refreshBtn} onClick={loadDrafts} disabled={loading}>
                            {loading ? '🔄' : '🔄 Refresh'}
                        </button>
                    </div>

                    {loading && <div style={styles.loading}>Loading drafts...</div>}
                    {error && <div style={styles.errorMsg}>{error}</div>}

                    {drafts.length === 0 && !loading && (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>📝</span>
                            <h3>No Drafts Yet</h3>
                            <p>Start writing a post and save it as a draft!</p>
                        </div>
                    )}

                    <div style={styles.draftGrid}>
                        {drafts.map(draft => (
                            <div key={draft.id} style={styles.draftCard}>
                                <div style={styles.draftCardHeader}>
                                    <div style={styles.draftPlatforms}>
                                        {draft.platforms.map(id => (
                                            <span key={id} style={styles.draftPlatformTag}>
                                                {PLATFORM_RULES[id]?.icon} {PLATFORM_RULES[id]?.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={styles.draftActions}>
                                        <button style={styles.editDraftBtn} onClick={() => handleEditDraft(draft.id)}>
                                            ✏️
                                        </button>
                                        <button style={styles.publishDraftBtn} onClick={() => handlePublishDraft(draft.id)}>
                                            🚀
                                        </button>
                                        <button style={styles.deleteDraftBtn} onClick={() => handleDeleteDraft(draft.id)}>
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                
                                {/* FIXED: This is the key change - using div with proper styles */}
                                <div style={styles.draftContent}>
                                    <div style={styles.draftText}>
                                        {draft.content || '(Empty draft)'}
                                    </div>
                                </div>
                                
                                <div style={styles.draftFooter}>
                                    <span>📎 {draft.media?.length || 0} files</span>
                                    <span>Characters: {draft.content?.length || 0}</span>
                                    <span>Updated: {new Date(draft.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================
// CSS STYLES - FIXED WRAPPING
// ============================================================

const styles = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        padding: '40px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    },
    card: {
        maxWidth: '900px',
        width: '100%',
        background: 'white',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    },
    title: {
        fontSize: '2.5rem',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: '4px'
    },
    subtitle: {
        textAlign: 'center',
        color: '#94a3b8',
        marginBottom: '30px'
    },
    section: {
        background: '#f8fafc',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '20px',
        border: '1px solid #e2e8f0'
    },
    sectionTitle: {
        color: '#334155',
        marginBottom: '15px',
        fontSize: '1.1rem'
    },
    platformGrid: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '12px'
    },
    platformBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        border: '2px solid #cbd5e1',
        borderRadius: '10px',
        background: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontSize: '14px'
    },
    platformBtnSelected: {
        borderColor: '#3b82f6',
        background: '#eff6ff',
        boxShadow: '0 0 0 3px rgba(59,130,246,0.2)'
    },
    platformIcon: { fontSize: '20px' },
    platformLimit: {
        fontSize: '11px',
        color: '#94a3b8',
        background: '#f1f5f9',
        padding: '2px 8px',
        borderRadius: '12px'
    },
    checkMark: {
        color: '#22c55e',
        fontWeight: 'bold',
        marginLeft: '4px'
    },
    selectedSummary: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        padding: '8px 12px',
        background: 'white',
        borderRadius: '8px',
        fontSize: '14px'
    },
    platformTag: {
        background: '#e2e8f0',
        padding: '2px 10px',
        borderRadius: '12px',
        fontSize: '13px'
    },
    counterContainer: {
        marginBottom: '12px'
    },
    counterHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '4px',
        fontSize: '14px',
        fontWeight: '500'
    },
    progressBar: {
        width: '100%',
        height: '6px',
        background: '#e2e8f0',
        borderRadius: '4px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        borderRadius: '4px',
        transition: 'width 0.3s ease'
    },
    textarea: {
        width: '100%',
        padding: '16px',
        border: '2px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '16px',
        fontFamily: 'inherit',
        resize: 'vertical',
        minHeight: '120px',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word'
    },
    uploadArea: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
    },
    uploadBtn: {
        padding: '10px 24px',
        background: '#3b82f6',
        color: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background 0.3s'
    },
    uploadHint: {
        color: '#94a3b8',
        fontSize: '13px'
    },
    mediaPreview: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '12px',
        marginTop: '12px'
    },
    mediaItem: {
        position: 'relative',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        background: 'white'
    },
    mediaThumb: {
        width: '100%',
        height: '120px',
        objectFit: 'cover'
    },
    mediaPlaceholder: {
        width: '100%',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f1f5f9',
        fontSize: '30px'
    },
    removeMedia: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        background: 'rgba(239,68,68,0.9)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '24px',
        height: '24px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    mediaInfo: {
        padding: '6px',
        fontSize: '11px',
        color: '#64748b',
        display: 'flex',
        justifyContent: 'space-between'
    },
    validationError: {
        padding: '10px 14px',
        background: '#fee2e2',
        color: '#991b1b',
        borderRadius: '6px',
        marginBottom: '6px',
        borderLeft: '4px solid #ef4444'
    },
    actionSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginTop: '20px'
    },
    actionButtons: {
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        flex: 1
    },
    draftBtn: {
        padding: '12px 24px',
        background: '#f59e0b',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    publishBtn: {
        padding: '12px 32px',
        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s'
    },
    disabledBtn: {
        opacity: 0.5,
        cursor: 'not-allowed'
    },
    cancelEditBtn: {
        padding: '12px 20px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    stats: {
        display: 'flex',
        gap: '20px',
        color: '#64748b',
        fontSize: '14px',
        flexWrap: 'wrap'
    },
    editingBadge: {
        padding: '4px 12px',
        background: '#fef3c7',
        color: '#78350f',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    },
    draftSection: {
        marginTop: '40px',
        paddingTop: '30px',
        borderTop: '2px solid #e2e8f0'
    },
    draftHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
    },
    draftTitle: {
        fontSize: '1.5rem',
        color: '#1e293b'
    },
    refreshBtn: {
        padding: '6px 16px',
        background: '#f1f5f9',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        cursor: 'pointer'
    },
    loading: {
        textAlign: 'center',
        padding: '40px',
        color: '#94a3b8'
    },
    errorMsg: {
        color: '#ef4444',
        fontSize: '13px',
        marginTop: '4px'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#94a3b8'
    },
    emptyIcon: {
        fontSize: '60px',
        display: 'block',
        marginBottom: '16px'
    },
    draftGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px'
    },
    draftCard: {
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '16px',
        transition: 'box-shadow 0.3s'
    },
    draftCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
    },
    draftPlatforms: {
        display: 'flex',
        gap: '6px',
        flexWrap: 'wrap'
    },
    draftPlatformTag: {
        padding: '2px 10px',
        background: '#f1f5f9',
        borderRadius: '12px',
        fontSize: '12px'
    },
    draftActions: {
        display: 'flex',
        gap: '6px'
    },
    editDraftBtn: {
        padding: '4px 10px',
        background: '#e2e8f0',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer'
    },
    publishDraftBtn: {
        padding: '4px 10px',
        background: '#3b82f6',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        color: 'white'
    },
    deleteDraftBtn: {
        padding: '4px 10px',
        background: '#ef4444',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        color: 'white'
    },
    // ============================================================
    // KEY FIX: Draft content wrapping styles
    // ============================================================
    draftContent: {
        marginBottom: '12px',
        color: '#1e293b',
        backgroundColor: '#f8fafc',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        // These 3 properties are the key to wrapping!
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        maxWidth: '100%',
        overflow: 'hidden'
    },
    draftText: {
        // Using a div, not p tag - more reliable for wrapping
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        maxWidth: '100%',
        lineHeight: '1.6',
        fontSize: '15px',
        color: '#1e293b'
    },
    draftFooter: {
        display: 'flex',
        gap: '16px',
        fontSize: '12px',
        color: '#94a3b8',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '10px',
        flexWrap: 'wrap'
    }
};

export default App;