'use client';

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { BookOpen, Target, Filter, Play } from 'lucide-react';
import { Button } from './Button';
import { AnimatePresence, motion } from 'framer-motion';

interface CustomLearnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomLearnModal({ isOpen, onClose }: CustomLearnModalProps) {
  const [wordCount, setWordCount] = useState(20);
  const [difficulty, setDifficulty] = useState('all');
  const [wordType, setWordType] = useState('all');

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog as="div" open={isOpen} onClose={onClose} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg z-50 space-y-6"
            >
              <Dialog.Title className="text-xl font-bold text-center">
                Customize Your Session
              </Dialog.Title>

              {/* Word Count */}
              <div className="border rounded-lg p-4 space-y-3 bg-blue-50 border-blue-100">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <span className='font-extrabold'>Number of Words</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={50}
                  step={1}
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>5 words</span>
                  <span className="text-blue-600 font-semibold bg-blue-100 px-3 py-2 rounded-lg">{wordCount} words</span>
                  <span>50 words</span>
                </div>
              </div>

              {/* Difficulty */}
              <div className="border rounded-lg p-4 space-y-3 bg-blue-50 border-blue-100">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className='font-extrabold'>Difficulty Level</span>
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Levels</option>
                  <option value="easy">Beginner</option>
                  <option value="medium">Intermediate</option>
                  <option value="hard">Advanced</option>
                </select>
              </div>

              {/* Word Type */}
              <div className="border rounded-lg p-4 space-y-3 bg-blue-50 border-blue-100">
                <label className="flex items-center gap-2 font-medium text-gray-700">
                    <Filter className="w-5 h-5 text-blue-500" />
                    <span className='font-extrabold'>Word Type</span>
                </label>
                <select
                  value={wordType}
                  onChange={(e) => setWordType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="all">All Types</option>
                  <option value="noun">Nouns</option>
                  <option value="verb">Verbs</option>
                  <option value="adjective">Adjectives</option>
                </select>
              </div>

              {/* Footer */}
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={() => alert('Start!')}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
