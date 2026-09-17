import React from 'react';
import { motion } from 'framer-motion';

const Testimonials = () => {
    const reviews = [
        {
            id: 1,
            name: 'Daniel Johnson',
            location: 'California',
            rating: 4.8,
            text: "The tasting menu was an absolute journey. Every dish was perfectly seasoned and the wine pairing was immaculate. Can't wait to return on our next trip to NY.",
            featured: false,
        },
        {
            id: 2,
            name: 'Sophia Lee',
            location: 'New York',
            rating: 5.0,
            text: "Drizzle never fails to impress. Finding a place that balances such high-quality ingredients with a warm, unpretentious atmosphere is rare. The Truffle Pasta is a must-try!",
            featured: true,
        },
        {
            id: 3,
            name: 'Emily Carter',
            location: 'Texas',
            rating: 4.9,
            text: "We celebrated our anniversary here and the staff made us feel incredibly special. The steak was cooked to absolute perfection. 10/10 recommend.",
            featured: false,
        },
    ];

    return (
        <section className="section-padding bg-cream3">
            <div className="container-wide">

                <div className="flex flex-col xl:flex-row gap-16 lg:gap-24">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="xl:w-1/3 flex flex-col items-start"
                    >
                        <span className="eyebrow-tag mb-6">&uarr; Testimonials</span>
                        <h2 className="h2-fluid mb-6 text-dark leading-tight">
                            Where every visit becomes a great Memory
                        </h2>
                        <p className="body-fluid text-muted mb-8">
                            Don't just take our word for it. Here's what our wonderful customers have to say about their dining experience with us.
                        </p>

                        <div className="flex gap-1 text-yellow-500 text-sm mb-2">
                            ★★★★★
                        </div>
                        <p className="font-sans text-xs font-bold uppercase tracking-wider text-dark">
                            4.9/5 Average Rating
                        </p>
                    </motion.div>

                    {/* Review Cards */}
                    <div className="xl:w-2/3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`p-8 lg:p-10 rounded-xl flex flex-col h-full shadow-card transition-transform duration-300 hover:-translate-y-2 ${review.featured
                                    ? 'bg-red text-white scale-[1.03] z-10 border-none'
                                    : 'bg-white text-brown border border-[#e2d4c4]/60'
                                    }`}
                            >
                                <div className="text-4xl mb-6 font-serif opacity-30 leading-none">"</div>

                                <p className={`font-sans text-sm leading-relaxed flex-grow mb-8 ${review.featured ? 'text-white/90' : 'text-muted'}`}>
                                    {review.text}
                                </p>

                                <div className={`h-[1px] w-full mb-6 ${review.featured ? 'bg-white/20' : 'bg-[#e2d4c4]/60'}`}></div>

                                <div className="flex justify-between items-end">
                                    <div>
                                        <h4 className={`font-serif font-bold text-lg mb-1 ${review.featured ? 'text-white' : 'text-dark'}`}>{review.name}</h4>
                                        <p className={`font-sans text-xs uppercase tracking-wider ${review.featured ? 'text-white/60' : 'text-muted/60'}`}>{review.location}</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-black/10 px-2 py-1 rounded">
                                        <span className="text-yellow-400 text-xs">★</span>
                                        <span className={`font-sans font-bold text-xs ${review.featured ? 'text-white' : 'text-dark'}`}>{review.rating}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                </div>

            </div>
        </section>
    );
};

export default Testimonials;
