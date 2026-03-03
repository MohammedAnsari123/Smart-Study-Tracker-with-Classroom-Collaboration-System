import React, { useMemo } from 'react';

const ConceptHeatmap = ({ data = [] }) => {
    // Generate dates for the last 365 days
    const heatmapGrid = useMemo(() => {
        const today = new Date();
        const grid = [];
        // We want to show approximately 52 weeks. 
        // Let's go back 364 days to keep it divisible by 7
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = data.find(d => d.date === dateStr) || { intensity: 0 };
            grid.push({ date: dateStr, intensity: dayData.intensity });
        }
        return grid.reverse(); // Chronological order
    }, [data]);

    const getIntensityClass = (level) => {
        switch (level) {
            case 1: return 'bg-green-200 dark:bg-green-900/30';
            case 2: return 'bg-green-400 dark:bg-green-700/60';
            case 3: return 'bg-green-600 dark:bg-green-500';
            case 4: return 'bg-green-800 dark:bg-green-400';
            default: return 'bg-gray-100 dark:bg-slate-800/50';
        }
    };

    return (
        <div className="bg-white dark:bg-darkCard p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-tighter">
                    Study Consistency Heatmap
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    <span>Less</span>
                    <div className="flex gap-1">
                        <div className="w-2.5 h-2.5 bg-gray-100 dark:bg-slate-800 rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-green-200 dark:bg-green-900/30 rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-green-400 dark:bg-green-700/60 rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-green-600 dark:bg-green-500 rounded-[2px]"></div>
                        <div className="w-2.5 h-2.5 bg-green-800 dark:bg-green-400 rounded-[2px]"></div>
                    </div>
                    <span>More</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1 md:gap-[3px]">
                {heatmapGrid.map((day, idx) => (
                    <div
                        key={idx}
                        className={`w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-[2px] transition-all duration-300 cursor-pointer hover:scale-125 hover:ring-2 hover:ring-primary-500/50 ${getIntensityClass(day.intensity)}`}
                        title={`${day.date}: ${day.intensity === 0 ? 'No study sessions' : `Level ${day.intensity} Activity`}`}
                    />
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                    Total active days in last year: <span className="text-primary-600 font-bold">{data.length}</span>
                </p>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    High intensity = 4+ hours/day
                </div>
            </div>
        </div>
    );
};

export default ConceptHeatmap;
