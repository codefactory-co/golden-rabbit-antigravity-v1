'use client';

import { useState } from 'react';
import { createNoteAction } from '@/src/app/actions/note.actions';
import { Modal } from '@/src/components/common/Modal';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { Icon } from '@/src/components/common/Icon';

export function NewNoteModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setIsOpen(true)}
                size="sm"
                className="flex items-center gap-1"
            >
                <Icon name="add" size={18} />
                새 노트
            </Button>

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="새로운 기록 남기기"
                description="아이디어를 기록하고 분류하여 관리하세요."
            >
                <form action={async (formData) => {
                    await createNoteAction(formData);
                    setIsOpen(false);
                }} className="space-y-4">
                    <Input
                        label="제목"
                        name="title"
                        id="title"
                        required
                        placeholder="노트 제목을 입력하세요"
                    />

                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">카테고리</label>
                        <select
                            id="category"
                            name="category"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border bg-white dark:bg-surface-dark dark:border-gray-700 dark:text-white"
                        >
                            <option>선택 안함</option>
                            <option>업무</option>
                            <option>개인</option>
                            <option>아이디어</option>
                            <option>공부</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">내용</label>
                        <textarea
                            id="content"
                            name="content"
                            rows={6}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 border placeholder-gray-400 resize-none dark:bg-surface-dark dark:border-gray-700 dark:text-white"
                            placeholder="내용을 자유롭게 작성하세요..."
                        ></textarea>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <Button type="submit" className="w-full sm:col-start-2">저장하기</Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="mt-3 w-full sm:mt-0 sm:col-start-1"
                            onClick={() => setIsOpen(false)}
                        >
                            취소
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
}
