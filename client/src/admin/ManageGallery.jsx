import React, { useState, useEffect } from 'react';
import { UploadCloud, Trash2, Loader2, Image as ImageIcon, X, Check, Plus } from 'lucide-react';
import { galleryService } from '../services/galleryService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ManageGallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [newImage, setNewImage] = useState({
        file: null,
        category: 'Interior'
    });

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await galleryService.getAll();
            setImages(response.data || []);
        } catch (error) {
            toast.error('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setNewImage({ ...newImage, file: e.target.files[0] });
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newImage.file) return toast.error('Please select an image');

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', newImage.file);
            formData.append('category', newImage.category);

            await galleryService.create(formData);
            toast.success('Image uploaded successfully');
            setShowUploadModal(false);
            setNewImage({ file: null, category: 'Interior' });
            fetchGallery();
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        try {
            await galleryService.delete(id);
            toast.success('Image removed from gallery');
            fetchGallery();
        } catch (error) {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                <div>
                    <h1 className="h2-fluid text-dark mb-1 font-serif font-black">Gallery</h1>
                    <p className="text-muted text-sm font-medium">Upload images to showcase on your public gallery page.</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary flex items-center gap-2 max-w-fit shadow-lg shadow-red/20"
                >
                    <UploadCloud size={18} /> Add New Media
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-muted gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-red" />
                    <span className="text-xs font-bold uppercase tracking-widest">Aesthetic sync in progress...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Upload Box (Trigger) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowUploadModal(true)}
                        className="glass-card border-2 border-dashed border-[#c0392b]/40 bg-white flex flex-col items-center justify-center p-8 rounded-2xl h-64 cursor-pointer group hover:border-red hover:bg-cream2 transition-all shadow-sm"
                    >
                        <div className="w-16 h-16 rounded-full bg-red text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-red/20">
                            <Plus size={28} />
                        </div>
                        <span className="font-sans font-black text-dark mb-1 uppercase tracking-widest text-[10px]">Upload Media</span>
                        <span className="text-[9px] text-muted font-bold uppercase">PNG, JPG up to 5MB</span>
                    </motion.div>

                    {/* Gallery Grids */}
                    {images.map((img, idx) => (
                        <motion.div
                            key={img._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative rounded-2xl overflow-hidden h-64 group shadow-md border border-[#e2d4c4]/60"
                        >
                            <img src={img.image} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                            <div className="absolute inset-0 bg-dark/70 opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-between p-5 backdrop-blur-[2px]">
                                <div className="self-end">
                                    <button
                                        onClick={() => handleDelete(img._id)}
                                        className="w-10 h-10 rounded-lg bg-red/20 text-red border border-red/30 flex items-center justify-center hover:bg-red hover:text-white transition-all shadow-lg active:scale-95"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div>
                                    <h4 className="text-white font-serif font-black text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-500">Exhibit #{idx + 1}</h4>
                                    <span className="inline-block mt-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-[0.2em] border border-white/20">
                                        {img.category}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-dark/60 backdrop-blur-md" onClick={() => !isUploading && setShowUploadModal(false)}></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#e2d4c4]/60 overflow-hidden"
                    >
                        <div className="p-6 border-b border-[#e2d4c4]/60 flex justify-between items-center">
                            <h2 className="text-xl font-serif font-black text-dark">Add to Gallery</h2>
                            <button onClick={() => setShowUploadModal(false)} className="text-muted hover:text-red transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">Category</label>
                                <select
                                    className="input-field bg-cream2 border-[#e2d4c4] focus:border-red font-bold text-sm"
                                    value={newImage.category}
                                    onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                                >
                                    <option value="Interior">Interior</option>
                                    <option value="Food">Food</option>
                                    <option value="Events">Events</option>
                                    <option value="Staff">Our Staff</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-2 ml-1">Media File</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#e2d4c4] border-dashed rounded-xl bg-cream2/50 hover:bg-cream2 hover:border-red transition-all group relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <div className="space-y-1 text-center">
                                        <ImageIcon className="mx-auto h-12 w-12 text-muted/60 group-hover:text-red transition-colors" />
                                        <div className="flex text-xs text-muted font-bold justify-center">
                                            <span className="text-red">Select a file</span>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        {newImage.file && (
                                            <p className="text-[10px] text-green-600 font-black uppercase mt-2 flex items-center justify-center gap-1">
                                                <Check size={12} /> {newImage.file.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUploading || !newImage.file}
                                className="w-full btn-primary py-4 flex items-center justify-center gap-2 shadow-lg shadow-red/20"
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={20} /> : 'Upload to Gallery'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageGallery;
