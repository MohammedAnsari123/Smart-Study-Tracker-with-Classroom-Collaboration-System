import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, CheckCircle, Clock, MoreVertical, Plus } from 'lucide-react';

const KanbanBoard = ({ classId, assignments, onStatusChange, isReadOnly = false }) => {
    const columns = [
        { id: 'todo', title: 'To-Do', color: 'bg-slate-500' },
        { id: 'doing', title: 'In-Progress', color: 'bg-blue-500' },
        { id: 'done', title: 'Done', color: 'bg-green-500' }
    ];

    const [localAssignments, setLocalAssignments] = useState(assignments);

    useEffect(() => {
        setLocalAssignments(assignments);
    }, [assignments]);

    const handleDragStart = (e, assignmentId) => {
        if (isReadOnly) return;
        e.dataTransfer.setData('assignmentId', assignmentId);
    };

    const handleDrop = async (e, targetStatus) => {
        if (isReadOnly) return;
        const id = e.dataTransfer.getData('assignmentId');

        // Optimistic UI update
        const updated = localAssignments.map(a =>
            a._id === id ? { ...a, status: targetStatus } : a
        );
        setLocalAssignments(updated);

        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/progress/update`,
                { assignmentId: id, classId, status: targetStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (onStatusChange) onStatusChange();
        } catch (error) {
            console.error('Failed to update status:', error);
            // Revert on error
            setLocalAssignments(assignments);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {columns.map(col => (
                <div
                    key={col.id}
                    onDrop={(e) => handleDrop(e, col.id)}
                    onDragOver={onDragOver}
                    className="flex flex-col bg-gray-100/50 dark:bg-slate-800/20 rounded-2xl p-4 min-h-[500px] border border-gray-200 dark:border-gray-800"
                >
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${col.color}`}></div>
                            <h3 className="font-bold text-gray-700 dark:text-gray-300 uppercase text-xs tracking-wider">
                                {col.title}
                            </h3>
                            <span className="bg-gray-200 dark:bg-slate-800 text-gray-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                                {localAssignments.filter(a => a.status === col.id).length}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {localAssignments
                            .filter(a => a.status === col.id)
                            .map(item => (
                                <div
                                    key={item._id}
                                    draggable={!isReadOnly}
                                    onDragStart={(e) => handleDragStart(e, item._id)}
                                    className={`bg-white dark:bg-darkCard p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all group ${isReadOnly ? 'cursor-default' : 'cursor-grab active:cursor-grabbing hover:border-primary-500/50'}`}
                                >
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 dark:border-gray-800/50">
                                        <div className="flex items-center text-[10px] text-gray-400 font-medium">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(item.dueDate || item.deadline).toLocaleDateString()}
                                        </div>
                                        {item.mySubmission && (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
