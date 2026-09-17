export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

export const formatTime = (timeString) => {
    // Assuming timeString is like "18:30" or "6:30 PM"
    if (timeString.includes('M')) return timeString; // Already formatted

    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;

    return `${formattedHours}:${minutes} ${ampm}`;
};
